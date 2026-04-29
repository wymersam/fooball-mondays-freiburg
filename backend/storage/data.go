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

// lastResetWeekKey tracks the week key for which we last performed a reset,
// so the reset only fires once per week even if CheckWeeklyReset is called repeatedly.
var lastResetWeekKey string

// CheckWeeklyReset checks if it's the configured reset day/time (Europe/Berlin) and resets signups for the week if needed.
// Configurable via SIGNUP_BLOCK_DAY (default: Monday) and SIGNUP_BLOCK_HOUR (default: 19:00, supports HH or HH:MM).
// The reset only fires once per week: at or after the reset time on the configured day.
func CheckWeeklyReset(dbConn *sql.DB) {
	loc, err := time.LoadLocation("Europe/Berlin")
	if err != nil {
		loc = time.Local
	}
	now := time.Now().In(loc)

	// Calculate the Monday of the *previous* week as the week key for signups to clear.
	// Signups are stored under the Monday key of the week they were made.
	// We want to clear whatever week was active before this reset fires.
	// Since the reset fires Monday evening, the signups to clear are from the current week key
	// (people signed up Mon morning through the week, now it's Mon 7pm and they reset for next week).
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

	weekdayStr := now.Weekday().String()
	resetTime := time.Date(now.Year(), now.Month(), now.Day(), blockHour, blockMinute, 0, 0, loc)

	// Only reset if:
	// 1. It's the configured reset day (e.g. Monday)
	// 2. The current time is at or after the reset time (e.g. 7pm)
	// 3. We haven't already reset for this week
	if weekdayStr == blockDay && !now.Before(resetTime) && lastResetWeekKey != currentWeekKey {
		// Clear the previous week's signups (the ones for today's game that just ended),
		// so new signups under currentWeekKey are for the following week's game.
		weekToClean := currentWeek.AddDate(0, 0, -14).Format("2006-01-02")
		log.Printf("Resetting signups for week %s (clearing %s) at %s %02d:%02d (Europe/Berlin)", currentWeekKey, weekToClean, blockDay, blockHour, blockMinute)
		if carried, err := db.CarryForwardBibWasher(dbConn, weekToClean, currentWeekKey); err != nil {
			log.Printf("Error carrying forward bib washer from %s to %s: %v", weekToClean, currentWeekKey, err)
		} else if carried {
			log.Printf("Bib washer carried forward from %s to %s", weekToClean, currentWeekKey)
		}
		_ = db.ClearSignupsForWeek(dbConn, weekToClean)
		lastResetWeekKey = currentWeekKey
	}
}
