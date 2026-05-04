package handlers

import (
	"database/sql"
	"football-mondays/db"
	"football-mondays/models"
	"football-mondays/utils"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// isAdminUser checks whether the cookie user is in the ADMIN_USERNAMES env var.
// Used only by AdminCheckHandler so the password prompt can appear on the frontend.
func isAdminUser(c *gin.Context, dbConn *sql.DB) bool {
	adminNames := os.Getenv("ADMIN_USERNAMES")
	if adminNames == "" {
		return false
	}
	userID, err := c.Cookie("userId")
	if err != nil || userID == "" {
		return false
	}
	user, err := db.GetUserByID(dbConn, userID)
	if err != nil || user == nil {
		return false
	}
	for _, name := range strings.Split(adminNames, ",") {
		if strings.TrimSpace(name) == user.Username {
			return true
		}
	}
	return false
}

// isAdminAuthed checks username (via cookie) AND the X-Admin-Password header against
// the ADMIN_PASSWORD env var. If ADMIN_PASSWORD is not set, falls back to username-only.
func isAdminAuthed(c *gin.Context, dbConn *sql.DB) bool {
	if !isAdminUser(c, dbConn) {
		return false
	}
	password := os.Getenv("ADMIN_PASSWORD")
	if password == "" {
		return true // no password configured, username alone is sufficient
	}
	return c.GetHeader("X-Admin-Password") == password
}

func boolPtr(v bool) *bool { return &v }

// nextMonday returns the week key (Monday date) of the week following the given week key.
func nextMonday(weekKey string) string {
	t, err := time.Parse("2006-01-02", weekKey)
	if err != nil {
		return weekKey
	}
	return t.AddDate(0, 0, 7).Format("2006-01-02")
}

// prevMonday returns the week key of the week preceding the given week key.
func prevMonday(weekKey string) string {
	t, err := time.Parse("2006-01-02", weekKey)
	if err != nil {
		return weekKey
	}
	return t.AddDate(0, 0, -7).Format("2006-01-02")
}

// AdminCheckHandler returns whether the current user is an admin.
func AdminCheckHandler(dbConn *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"isAdmin": isAdminUser(c, dbConn)})
	}
}

// AdminOverrideStatusHandler returns the current override state.
func AdminOverrideStatusHandler(dbConn *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !isAdminAuthed(c, dbConn) {
			c.JSON(http.StatusForbidden, models.ErrorResponse{Error: "Forbidden"})
			return
		}
		ov := utils.GetSignupOverride()
		if ov == nil {
			c.JSON(http.StatusOK, gin.H{"override": "auto"})
		} else if *ov {
			c.JSON(http.StatusOK, gin.H{"override": "open"})
		} else {
			c.JSON(http.StatusOK, gin.H{"override": "closed"})
		}
	}
}

// AdminResetHandler clears the current week's signups and forces the signup window open.
func AdminResetHandler(dbConn *sql.DB, getCurrentWeekKey func() string) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !isAdminAuthed(c, dbConn) {
			c.JSON(http.StatusForbidden, models.ErrorResponse{Error: "Forbidden"})
			return
		}
		weekKey := getCurrentWeekKey()
		prevWeekKey := prevMonday(weekKey)

		log.Printf("[AdminReset] prevWeekKey=%s weekKey=%s", prevWeekKey, weekKey)

		// Snapshot the bib washer before clearing; try current week first, then previous.
		bibEntry, err := db.LookupBibWasherEntry(dbConn, weekKey)
		if err != nil {
			log.Printf("[AdminReset] Error looking up bib washer for %s: %v", weekKey, err)
		}
		if bibEntry == nil {
			bibEntry, err = db.LookupBibWasherEntry(dbConn, prevWeekKey)
			if err != nil {
				log.Printf("[AdminReset] Error looking up bib washer for %s: %v", prevWeekKey, err)
			}
		}
		if bibEntry != nil {
			log.Printf("[AdminReset] Found bib washer: %s, will re-add to %s after reset", bibEntry.Username, weekKey)
		} else {
			log.Printf("[AdminReset] No bib washer found in %s or %s", weekKey, prevWeekKey)
		}

		if err := db.ClearSignupsForWeek(dbConn, weekKey); err != nil {
			c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to reset signups"})
			return
		}

		// Re-insert the bib washer as position 1 in the freshly cleared week.
		if bibEntry != nil {
			if err := db.InsertSignup(dbConn, models.Signup{
				UserID:     bibEntry.UserID,
				Username:   bibEntry.Username,
				SignupTime: time.Now(),
				Position:   1,
			}, weekKey); err != nil {
				log.Printf("[AdminReset] Error re-inserting bib washer %s into %s: %v", bibEntry.Username, weekKey, err)
			} else {
				log.Printf("[AdminReset] Bib washer %s re-added to %s at position 1", bibEntry.Username, weekKey)
			}
		}

		utils.SetSignupOverride(boolPtr(true))
		c.JSON(http.StatusOK, models.SuccessResponse{Success: true})
	}
}

// AdminOpenSignupsHandler forces the signup window open without clearing signups.
func AdminOpenSignupsHandler(dbConn *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !isAdminAuthed(c, dbConn) {
			c.JSON(http.StatusForbidden, models.ErrorResponse{Error: "Forbidden"})
			return
		}
		utils.SetSignupOverride(boolPtr(true))
		c.JSON(http.StatusOK, models.SuccessResponse{Success: true})
	}
}

// AdminCloseSignupsHandler forces the signup window closed.
func AdminCloseSignupsHandler(dbConn *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !isAdminAuthed(c, dbConn) {
			c.JSON(http.StatusForbidden, models.ErrorResponse{Error: "Forbidden"})
			return
		}
		utils.SetSignupOverride(boolPtr(false))
		c.JSON(http.StatusOK, models.SuccessResponse{Success: true})
	}
}

// AdminClearOverrideHandler removes the override and restores time-based rules.
func AdminClearOverrideHandler(dbConn *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !isAdminAuthed(c, dbConn) {
			c.JSON(http.StatusForbidden, models.ErrorResponse{Error: "Forbidden"})
			return
		}
		utils.SetSignupOverride(nil)
		c.JSON(http.StatusOK, models.SuccessResponse{Success: true})
	}
}

type adminPaidRequest struct {
	UserID  string `json:"userId"`
	HasPaid bool   `json:"hasPaid"`
}

// AdminPaidHandler lets an admin toggle the paid status of any player for the previous week.
func AdminPaidHandler(dbConn *sql.DB, getCurrentWeekKey func() string) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !isAdminAuthed(c, dbConn) {
			c.JSON(http.StatusForbidden, models.ErrorResponse{Error: "Forbidden"})
			return
		}
		var req adminPaidRequest
		if err := c.ShouldBindJSON(&req); err != nil || req.UserID == "" {
			c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid request"})
			return
		}
		weekKey := prevMonday(getCurrentWeekKey())
		if err := db.TogglePaid(dbConn, req.UserID, weekKey, req.HasPaid); err != nil {
			c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to update payment status"})
			return
		}
		c.JSON(http.StatusOK, models.SuccessResponse{Success: true})
	}
}

type adminPaypalRefRequest struct {
	UserID    string `json:"userId"`
	PaypalRef string `json:"paypalRef"`
}

// AdminPaypalRefHandler lets an admin set or clear the PayPal ref for any player for the previous week.
func AdminPaypalRefHandler(dbConn *sql.DB, getCurrentWeekKey func() string) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !isAdminAuthed(c, dbConn) {
			c.JSON(http.StatusForbidden, models.ErrorResponse{Error: "Forbidden"})
			return
		}
		var req adminPaypalRefRequest
		if err := c.ShouldBindJSON(&req); err != nil || req.UserID == "" {
			c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid request"})
			return
		}
		weekKey := prevMonday(getCurrentWeekKey())
		if err := db.SetPaypalRef(dbConn, req.UserID, weekKey, req.PaypalRef); err != nil {
			c.JSON(http.StatusConflict, models.ErrorResponse{Error: err.Error()})
			return
		}
		c.JSON(http.StatusOK, models.SuccessResponse{Success: true})
	}
}

// AdminCollectorsHandler returns the full collector history.
func AdminCollectorsHandler(dbConn *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !isAdminAuthed(c, dbConn) {
			c.JSON(http.StatusForbidden, models.ErrorResponse{Error: "Forbidden"})
			return
		}
		records, err := db.GetCollectors(dbConn)
		if err != nil {
			c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to fetch collector history"})
			return
		}
		c.JSON(http.StatusOK, records)
	}
}

// CollectorsHandler returns the full collector history (public, no auth required).
func CollectorsHandler(dbConn *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		records, err := db.GetCollectors(dbConn)
		if err != nil {
			c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to fetch collector history"})
			return
		}
		c.JSON(http.StatusOK, records)
	}
}
