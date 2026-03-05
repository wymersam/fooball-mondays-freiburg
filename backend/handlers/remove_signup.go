package handlers

import (
	"football-mondays/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func RemoveSignupHandler(dataStore *models.DataStore, getCurrentWeekKey func() string, saveData func(*models.DataStore)) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, err := c.Cookie("userId")
		if err != nil || userID == "" {
			c.JSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Not authenticated"})
			return
		}
		currentWeek := getCurrentWeekKey()
		if dataStore.Signups[currentWeek] == nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "No signups for this week"})
			return
		}
		signupIndex := -1
		for i, signup := range dataStore.Signups[currentWeek] {
			if signup.UserID == userID {
				signupIndex = i
				break
			}
		}
		if signupIndex == -1 {
			c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "You are not signed up for this week"})
			return
		}
		dataStore.Signups[currentWeek] = append(
			dataStore.Signups[currentWeek][:signupIndex],
			dataStore.Signups[currentWeek][signupIndex+1:]...,
		)
		for i := range dataStore.Signups[currentWeek] {
			dataStore.Signups[currentWeek][i].Position = i + 1
		}
		saveData(dataStore)
		c.JSON(http.StatusOK, models.SuccessResponse{Success: true})
	}
}
