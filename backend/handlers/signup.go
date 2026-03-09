package handlers

import (
	"database/sql"
	"football-mondays/db"
	"football-mondays/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// SignupHandler handles user signup for the current week
func SignupHandler(dbConn *sql.DB, getCurrentWeekKey func() string, isSignupTime func() bool) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !isSignupTime() {
			c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Signups are temporarily blocked during the reset window (Monday 7pm-8pm). Please try again after 8pm."})
			return
		}
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
		// Check if already signed up
		signups, _ := db.GetSignupsForWeek(dbConn, currentWeek)
		for _, signup := range signups {
			if signup.UserID == userID {
				c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "You have already signed up for this week"})
				return
			}
		}
		newSignup := models.Signup{
			UserID:     userID,
			Username:   user.Username,
			SignupTime: time.Now(),
			Position:   len(signups) + 1,
		}
		_ = db.InsertSignup(dbConn, newSignup, currentWeek)
		c.JSON(http.StatusOK, models.SuccessResponse{
			Success:  true,
			Position: newSignup.Position,
		})
	}
}
