package handlers

import (
	"database/sql"
	"football-mondays/db"
	"net/http"

	"github.com/gin-gonic/gin"
)

// HistoryHandler returns aggregated player stats (games played, reserve, dropouts)
func HistoryHandler(dbConn *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		stats, err := db.GetPlayerStats(dbConn)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load history"})
			return
		}
		if stats == nil {
			stats = []db.PlayerStat{}
		}
		c.JSON(http.StatusOK, stats)
	}
}
