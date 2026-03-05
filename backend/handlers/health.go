package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// Health check handler
func HealthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":    "OK",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}
