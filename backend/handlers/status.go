package handlers

import (
	"football-mondays/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func StatusHandler(dataStore *models.DataStore, getCurrentWeekKey func() string, isSignupTime func() bool, checkWeeklyReset func(), initDataFile func()) gin.HandlerFunc {
	return func(c *gin.Context) {
		checkWeeklyReset()
		if dataStore == nil {
			initDataFile()
		}
		currentWeek := getCurrentWeekKey()
		weekSignups := []models.Signup{}
		if dataStore != nil && dataStore.Signups != nil {
			weekSignups = dataStore.Signups[currentWeek]
			if weekSignups == nil {
				weekSignups = []models.Signup{}
			}
		}
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
