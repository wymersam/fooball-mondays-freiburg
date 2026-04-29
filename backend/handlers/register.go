package handlers

import (
	"database/sql"
	"football-mondays/db"
	"football-mondays/models"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

// RegisterHandler handles user registration by username
func RegisterHandler(dbConn *sql.DB, generateUUID func() string, setUserCookie func(*gin.Context, string)) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req models.RegisterRequest
		if err := c.ShouldBindJSON(&req); err != nil || req.Username == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format or missing username"})
			return
		}

		// Check invite code for new registrations
		inviteCode := os.Getenv("INVITE_CODE")
		if inviteCode != "" {
			// Only block if the user doesn't already exist
			existingUser, _ := db.GetUserByUsername(dbConn, req.Username)
			if existingUser == nil && req.InviteCode != inviteCode {
				c.JSON(http.StatusForbidden, gin.H{"error": "Invalid invite code"})
				return
			}
		}

		// Check if user exists
		user, _ := db.GetUserByUsername(dbConn, req.Username)
		var userID string
		if user == nil {
			userID = generateUUID()
			newUser := models.User{
				UserID:    userID,
				Username:  req.Username,
				CreatedAt: time.Now(),
			}
			_ = db.InsertUser(dbConn, newUser)
		} else {
			userID = user.UserID
		}
		setUserCookie(c, userID)
		c.JSON(http.StatusOK, models.RegisterResponse{
			Success:  true,
			Username: req.Username,
		})
	}
}
