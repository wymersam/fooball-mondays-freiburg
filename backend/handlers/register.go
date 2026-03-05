package handlers

import (
	"football-mondays/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func RegisterHandler(dataStore *models.DataStore, generateUUID func() string, saveData func(*models.DataStore), setUserCookie func(*gin.Context, string), ensureDataStore func()) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req models.RegisterRequest
		if err := c.ShouldBindJSON(&req); err != nil || req.Username == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format or missing username"})
			return
		}
		ensureDataStore()
		if dataStore.Users == nil {
			dataStore.Users = make(map[string]models.User)
		}
		var foundUserID string
		for userID, user := range dataStore.Users {
			if user.Username == req.Username {
				foundUserID = userID
				break
			}
		}
		if foundUserID == "" {
			newUserID := generateUUID()
			dataStore.Users[newUserID] = models.User{
				Username:  req.Username,
				CreatedAt: time.Now(),
			}
			foundUserID = newUserID
			saveData(dataStore)
		}
		setUserCookie(c, foundUserID)
		c.JSON(http.StatusOK, models.RegisterResponse{
			Success:  true,
			Username: req.Username,
		})
	}
}
