package handlers

import (
	"database/sql"
	"football-mondays/db"
	"football-mondays/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// RemoveSignupHandler handles removing a user's signup for the current week
func RemoveSignupHandler(dbConn *sql.DB, getCurrentWeekKey func() string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, err := c.Cookie("userId")
		if err != nil || userID == "" {
			c.JSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Please register first"})
			return
		}
		user, err := db.GetUserByID(dbConn, userID)
		if err != nil || user == nil {
			c.JSON(http.StatusUnauthorized, models.ErrorResponse{Error: "User not found"})
			return
		}
		currentWeek := getCurrentWeekKey()
		err = db.RemoveSignup(dbConn, userID, currentWeek)
		if err != nil {
			c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to remove signup"})
			return
		}
		c.JSON(http.StatusOK, models.SuccessResponse{Success: true})
	}
}
