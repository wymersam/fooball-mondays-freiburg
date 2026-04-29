package handlers

import (
	"database/sql"
	"football-mondays/db"
	"football-mondays/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ballBringerRequest struct {
	BallBringer bool `json:"ballBringer"`
}

func BallBringerHandler(dbConn *sql.DB, getCurrentWeekKey func() string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, err := c.Cookie("userId")
		if err != nil || userID == "" {
			c.JSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Please register first"})
			return
		}

		var req ballBringerRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid request"})
			return
		}

		weekKey := getCurrentWeekKey()

		if err := db.SetBallBringer(dbConn, userID, weekKey, req.BallBringer); err != nil {
			c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to update ball bringer status"})
			return
		}

		c.JSON(http.StatusOK, models.SuccessResponse{Success: true})
	}
}
