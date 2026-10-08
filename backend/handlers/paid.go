package handlers

import (
	"database/sql"
	"football-mondays/db"
	"football-mondays/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type paidRequest struct {
	UserID  string `json:"userId"`
	HasPaid bool   `json:"hasPaid"`
}

// PaidHandler allows an authenticated user to update a player's payment status for the previous week's game.
func PaidHandler(dbConn *sql.DB, getCurrentWeekKey func() string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, err := c.Cookie("userId")
		if err != nil || userID == "" {
			c.JSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Please register first"})
			return
		}

		var req paidRequest
		if err := c.ShouldBindJSON(&req); err != nil || req.UserID == "" {
			c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid request"})
			return
		}

		weekKey := prevWeekKey(getCurrentWeekKey())
		if err := db.TogglePaid(dbConn, req.UserID, weekKey, req.HasPaid); err != nil {
			c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to update payment status"})
			return
		}

		c.JSON(http.StatusOK, models.SuccessResponse{Success: true})
	}
}
