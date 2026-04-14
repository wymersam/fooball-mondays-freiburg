package handlers

import (
	"database/sql"
	"football-mondays/db"
	"football-mondays/models"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// StatusHandler returns the current signup status for the week, including the main and reserve lists
func StatusHandler(dbConn *sql.DB, getCurrentWeekKey func() string, isSignupTime func() bool) gin.HandlerFunc {
	return func(c *gin.Context) {
		currentWeek := getCurrentWeekKey()
		weekSignups, _ := db.GetSignupsForWeek(dbConn, currentWeek)
		mainList := weekSignups
		reserveList := []models.Signup{}
		if len(weekSignups) > 12 {
			mainList = weekSignups[:12]
			reserveList = weekSignups[12:]
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
			NextReset:    nextResetTime(),
		}
		c.JSON(http.StatusOK, response)
	}
}

// nextResetTime returns the next Monday 19:00 Europe/Berlin as a UTC time.
func nextResetTime() time.Time {
	loc, err := time.LoadLocation("Europe/Berlin")
	if err != nil {
		loc = time.Local
	}
	now := time.Now().In(loc)
	monday := now.AddDate(0, 0, -int(now.Weekday())+1)
	if now.Weekday() == time.Sunday {
		monday = monday.AddDate(0, 0, -7)
	}

	blockHour := 19
	blockMinute := 0
	if resetHour := os.Getenv("RESET_HOUR"); resetHour != "" {
		if strings.Contains(resetHour, ":") {
			parts := strings.SplitN(resetHour, ":", 2)
			if h, err := strconv.Atoi(parts[0]); err == nil {
				blockHour = h
			}
			if m, err := strconv.Atoi(parts[1]); err == nil {
				blockMinute = m
			}
		} else {
			if h, err := strconv.Atoi(resetHour); err == nil {
				blockHour = h
			}
		}
	}

	resetToday := time.Date(monday.Year(), monday.Month(), monday.Day(), blockHour, blockMinute, 0, 0, loc)
	if now.Before(resetToday) {
		return resetToday.UTC()
	}
	// Already past this Monday's reset — next reset is next Monday
	nextMonday := monday.AddDate(0, 0, 7)
	return time.Date(nextMonday.Year(), nextMonday.Month(), nextMonday.Day(), blockHour, blockMinute, 0, 0, loc).UTC()
}
