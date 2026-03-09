package handlers

import (
	"database/sql"
	"football-mondays/db"
	"football-mondays/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// StatusHandler returns the current signup status for the week, including the main and reserve lists
func StatusHandler(dbConn *sql.DB, getCurrentWeekKey func() string, isSignupTime func() bool) gin.HandlerFunc {
	return func(c *gin.Context) {
		currentWeek := getCurrentWeekKey()
		weekSignups, _ := db.GetSignupsForWeek(dbConn, currentWeek)
		mainList := weekSignups
		reserveList := []models.Signup{}
		if len(weekSignups) > 10 {
			mainList = weekSignups[:10]
			reserveList = weekSignups[10:]
		}
		username := c.Query("currentUser")
		userSignedUp := false
		if username != "" {
			for _, signup := range weekSignups {
				if signup.Username == username {
					userSignedUp = true
					break
				}
			}
		}
		response := models.SignupStatus{
			CurrentWeek:  currentWeek,
			CanSignup:    isSignupTime(),
			MainList:     mainList,
			ReserveList:  reserveList,
			UserSignedUp: userSignedUp,
		}
		c.JSON(http.StatusOK, response)
	}
}
