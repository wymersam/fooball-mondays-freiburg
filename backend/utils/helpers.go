package utils

import (
	"log"
	"os"
	"strconv"
	"time"
)

// Get current week key (Monday of current week)
func GetCurrentWeekKey() string {
	loc, err := time.LoadLocation("Europe/Berlin")
	if err != nil {
		loc = time.Local
	}
	now := time.Now().In(loc)
	// Calculate Monday of this week
	monday := now.AddDate(0, 0, -int(now.Weekday())+1)
	if now.Weekday() == time.Sunday {
		monday = monday.AddDate(0, 0, -7)
	}
	return monday.Format("2006-01-02")
}

// Check if signups are allowed (block window configurable via env)
func IsSignupTime() bool {
	loc, err := time.LoadLocation("Europe/Berlin")
	if err != nil {
		loc = time.Local
	}
	now := time.Now().In(loc)

	// Get block day and hour from env, fallback to Monday 18 (6-7pm)
	blockDay := os.Getenv("SIGNUP_BLOCK_DAY")
	if blockDay == "" {
		blockDay = "Monday"
	}
	blockHourStr := os.Getenv("SIGNUP_BLOCK_HOUR")
	blockHour := 18
	if blockHourStr != "" {
		if h, err := strconv.Atoi(blockHourStr); err == nil {
			blockHour = h
		}
	}

	// Compare current day/hour to block window
	weekdayStr := now.Weekday().String()
	hour := now.Hour()
	// Debug log
	log.Printf("IsSignupTime debug: now=%s %02d, env blockDay=%s, blockHour=%d", weekdayStr, hour, blockDay, blockHour)
	if weekdayStr == blockDay && hour == blockHour {
		log.Println("Signup is currently blocked!")
		return false
	}
	return true
}
