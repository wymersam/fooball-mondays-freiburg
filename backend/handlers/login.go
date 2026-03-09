package handlers

import (
	"database/sql"
	"football-mondays/db"
	"football-mondays/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// LoginHandler handles user login by username
func LoginHandler(dbConn *sql.DB, setUserCookie func(*gin.Context, string)) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req models.LoginRequest
		if err := c.ShouldBindJSON(&req); err != nil || req.Username == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
			return
		}
		user, _ := db.GetUserByUsername(dbConn, req.Username)
		if user == nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username"})
			return
		}
		setUserCookie(c, user.UserID)
		c.JSON(http.StatusOK, gin.H{"success": true, "username": user.Username})
	}
}
