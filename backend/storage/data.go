package storage

import (
	"database/sql"
	"football-mondays/db"
	"log"
	"os"
	"strconv"
	"strings"
	"time"
)

// CheckWeeklyReset checks if it's the configured reset day/time (Europe/Berlin) and resets signups for the week if needed.
// Configurable via SIGNUP_BLOCK_DAY (default: Monday) and SIGNUP_BLOCK_HOUR (default: 19:00, supports HH or HH:MM).
func CheckWeeklyReset(dbConn *sql.DB) {
	loc, err := time.LoadLocation("Europe/Berlin")
	if err != nil {
		loc = time.Local
	}
	now := time.Now().In(loc)
	currentWeek := now.AddDate(0, 0, -int(now.Weekday())+1)
	if now.Weekday() == time.Sunday {
		currentWeek = currentWeek.AddDate(0, 0, -7)
	}
	currentWeekKey := currentWeek.Format("2006-01-02")

	// Read configurable reset day and time from env
	blockDay := os.Getenv("SIGNUP_BLOCK_DAY")
	if blockDay == "" {
		blockDay = "Monday"
	}
	blockTimeStr := os.Getenv("SIGNUP_BLOCK_HOUR")
	blockHour := 19
	blockMinute := 0
	if blockTimeStr != "" {
		if strings.Contains(blockTimeStr, ":") {
			parts := strings.SplitN(blockTimeStr, ":", 2)
			if h, err := strconv.Atoi(parts[0]); err == nil {
				blockHour = h
			}
			if m, err := strconv.Atoi(parts[1]); err == nil {
				blockMinute = m
			}
		} else {
			if h, err := strconv.Atoi(blockTimeStr); err == nil {
				blockHour = h
			}
		}
	}

	// If it's the configured reset day and at/after the reset time, clear signups for the week
	weekdayStr := now.Weekday().String()
	resetTime := time.Date(now.Year(), now.Month(), now.Day(), blockHour, blockMinute, 0, 0, loc)
	if weekdayStr == blockDay && !now.Before(resetTime) {
		signups, _ := db.GetSignupsForWeek(dbConn, currentWeekKey)
		if len(signups) > 0 {
			for _, signup := range signups {
				if signup.SignupTime.In(loc).Before(resetTime) {
					log.Printf("Resetting signups for week %s at %s %02d:%02d (Europe/Berlin)", currentWeekKey, blockDay, blockHour, blockMinute)
					_ = db.ClearSignupsForWeek(dbConn, currentWeekKey)
					break
				}
			}
		}
	}
}
