package handlers

import (
	"database/sql"
	"football-mondays/db"
	"football-mondays/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type paypalRefRequest struct {
	PaypalRef string `json:"paypalRef"`
}

// PaypalRefHandler allows a player to set or clear their PayPal reference for last week's game.
// Only one player per week can hold an active paypal_ref.
func PaypalRefHandler(dbConn *sql.DB, getCurrentWeekKey func() string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, err := c.Cookie("userId")
		if err != nil || userID == "" {
			c.JSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Please register first"})
			return
		}

		var req paypalRefRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid request"})
			return
		}

		weekKey := prevWeekKey(getCurrentWeekKey())
		if err := db.SetPaypalRef(dbConn, userID, weekKey, req.PaypalRef); err != nil {
			c.JSON(http.StatusConflict, models.ErrorResponse{Error: err.Error()})
			return
		}

		c.JSON(http.StatusOK, models.SuccessResponse{Success: true})
	}
}
