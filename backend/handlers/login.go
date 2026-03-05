package handlers

import (
	"football-mondays/models"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func LoginHandler(dataStore *models.DataStore, saveData func(*models.DataStore), setUserCookie func(*gin.Context, string)) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req models.LoginRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
			return
		}
		var foundUserID string
		var foundUser models.User
		for userID, user := range dataStore.Users {
			if user.Username == req.Username {
				foundUserID = userID
				foundUser = user
				break
			}
		}
		if foundUserID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
			return
		}
		dataStore.Users[foundUserID] = foundUser
		saveData(dataStore)
		isProduction := os.Getenv("PORT") != "" || os.Getenv("RAILWAY_ENVIRONMENT") != ""
		if isProduction {
			c.SetSameSite(http.SameSiteNoneMode)
			c.SetCookie("userId", foundUserID, 30*24*60*60, "/", "", true, true)
		} else {
			c.SetSameSite(http.SameSiteLaxMode)
			c.SetCookie("userId", foundUserID, 30*24*60*60, "/", "", false, true)
		}
		c.JSON(http.StatusOK, models.RegisterResponse{
			Success:  true,
			Username: foundUser.Username,
		})
	}
}
