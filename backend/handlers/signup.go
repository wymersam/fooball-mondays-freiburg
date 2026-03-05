package handlers

import (
	"football-mondays/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func SignupHandler(dataStore *models.DataStore, getCurrentWeekKey func() string, isSignupTime func() bool, saveData func(*models.DataStore)) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !isSignupTime() {
			c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Signups are temporarily blocked during the reset window (Monday 7pm-8pm). Please try again after 8pm."})
			return
		}
		if dataStore.Users == nil {
			dataStore.Users = make(map[string]models.User)
		}
		userID, err := c.Cookie("userId")
		if err != nil || userID == "" {
			c.JSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Please register first"})
			return
		}
		user, exists := dataStore.Users[userID]
		if !exists {
			c.JSON(http.StatusUnauthorized, models.ErrorResponse{Error: "User not found"})
			return
		}
		currentWeek := getCurrentWeekKey()
		if dataStore.Signups[currentWeek] == nil {
			dataStore.Signups[currentWeek] = []models.Signup{}
		}
		for _, signup := range dataStore.Signups[currentWeek] {
			if signup.UserID == userID {
				c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "You have already signed up for this week"})
				return
			}
		}
		newSignup := models.Signup{
			UserID:     userID,
			Username:   user.Username,
			SignupTime: time.Now(),
			Position:   len(dataStore.Signups[currentWeek]) + 1,
		}
		dataStore.Signups[currentWeek] = append(dataStore.Signups[currentWeek], newSignup)
		saveData(dataStore)
		c.JSON(http.StatusOK, models.SuccessResponse{
			Success:  true,
			Position: len(dataStore.Signups[currentWeek]),
		})
	}
}
