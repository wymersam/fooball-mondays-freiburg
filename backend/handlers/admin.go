package handlers

import (
	"database/sql"
	"football-mondays/db"
	"football-mondays/models"
	"football-mondays/utils"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

// isAdminUser checks whether the cookie user is in the ADMIN_USERNAMES env var.
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

func boolPtr(v bool) *bool { return &v }

// AdminCheckHandler returns whether the current user is an admin.
func AdminCheckHandler(dbConn *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"isAdmin": isAdminUser(c, dbConn)})
	}
}

// AdminOverrideStatusHandler returns the current override state.
func AdminOverrideStatusHandler(dbConn *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !isAdminUser(c, dbConn) {
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
		if !isAdminUser(c, dbConn) {
			c.JSON(http.StatusForbidden, models.ErrorResponse{Error: "Forbidden"})
			return
		}
		weekKey := getCurrentWeekKey()
		if err := db.ClearSignupsForWeek(dbConn, weekKey); err != nil {
			c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to reset signups"})
			return
		}
		utils.SetSignupOverride(boolPtr(true))
		c.JSON(http.StatusOK, models.SuccessResponse{Success: true})
	}
}

// AdminOpenSignupsHandler forces the signup window open without clearing signups.
func AdminOpenSignupsHandler(dbConn *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !isAdminUser(c, dbConn) {
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
		if !isAdminUser(c, dbConn) {
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
		if !isAdminUser(c, dbConn) {
			c.JSON(http.StatusForbidden, models.ErrorResponse{Error: "Forbidden"})
			return
		}
		utils.SetSignupOverride(nil)
		c.JSON(http.StatusOK, models.SuccessResponse{Success: true})
	}
}
