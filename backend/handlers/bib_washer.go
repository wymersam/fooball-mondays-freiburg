package handlers

import (
	"database/sql"
	"football-mondays/db"
	"football-mondays/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type bibWasherRequest struct {
	BibWasher bool `json:"bibWasher"`
}

// BibWasherHandler handles volunteering to wash bibs for this week's game
func BibWasherHandler(dbConn *sql.DB, getCurrentWeekKey func() string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, err := c.Cookie("userId")
		if err != nil || userID == "" {
			c.JSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Please register first"})
			return
		}

		var req bibWasherRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid request"})
			return
		}

		weekKey := getCurrentWeekKey()

		if req.BibWasher {
			existing, err := db.GetBibWasher(dbConn, weekKey)
			if err != nil {
				c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to check bib washer status"})
				return
			}
			if existing != "" && existing != userID {
				c.JSON(http.StatusConflict, models.ErrorResponse{Error: "Someone has already volunteered to wash the bibs"})
				return
			}
		}

		if err := db.SetBibWasher(dbConn, userID, weekKey, req.BibWasher); err != nil {
			c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to update bib washer status"})
			return
		}

		c.JSON(http.StatusOK, models.SuccessResponse{Success: true})
	}
}
