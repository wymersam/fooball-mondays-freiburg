package utils

import (
	"log"
	"os"
	"strconv"
	"strings"
	"time"
)

// Get current week key (Monday of the active signup week).
// Before the reset time on the reset day, signups still belong to the previous week's game,
// so we return last Monday's key. After the reset, we return this Monday's key.
func GetCurrentWeekKey() string {
	loc, err := time.LoadLocation("Europe/Berlin")
	if err != nil {
		loc = time.Local
	}
	now := time.Now().In(loc)

	blockDay := os.Getenv("SIGNUP_BLOCK_DAY")
	if blockDay == "" {
		blockDay = "Monday"
	}
	blockHour := 19
	blockMinute := 0
	if blockTimeStr := os.Getenv("SIGNUP_BLOCK_HOUR"); blockTimeStr != "" {
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

	monday := now.AddDate(0, 0, -int(now.Weekday())+1)
	if now.Weekday() == time.Sunday {
		monday = monday.AddDate(0, 0, -7)
	}
	// Before the reset time on reset day, the active signups are from the previous week
	if now.Weekday().String() == blockDay {
		resetTime := time.Date(now.Year(), now.Month(), now.Day(), blockHour, blockMinute, 0, 0, loc)
		if now.Before(resetTime) {
			monday = monday.AddDate(0, 0, -7)
		}
	}
	return monday.Format("2006-01-02")
}

// Check if signups are allowed (block window configurable via env)
func IsSignupTime() bool {
	// Admin override: nil = use time rules, true = force open, false = force closed
	if ov := GetSignupOverride(); ov != nil {
		return *ov
	}
	loc, err := time.LoadLocation("Europe/Berlin")
	if err != nil {
		loc = time.Local
	}
	now := time.Now().In(loc)

	// Get block day and time from env, fallback to Monday 18:00 (6-7pm)
	blockDay := os.Getenv("SIGNUP_BLOCK_DAY")
	if blockDay == "" {
		blockDay = "Monday"
	}

	blockTimeStr := os.Getenv("SIGNUP_BLOCK_HOUR")
	blockHour := 19
	blockMinute := 0
	if blockTimeStr != "" {
		// Support both "HH" and "HH:MM" formats
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

	// Compare current day/time to block window (180 minutes from block time)
	weekdayStr := now.Weekday().String()
	blockStart := time.Date(now.Year(), now.Month(), now.Day(), blockHour, blockMinute, 0, 0, loc)
	blockEnd := blockStart.Add(180 * time.Minute)
	log.Printf("IsSignupTime debug: now=%s %02d:%02d, env blockDay=%s, blockTime=%02d:%02d", weekdayStr, now.Hour(), now.Minute(), blockDay, blockHour, blockMinute)
	if weekdayStr == blockDay && !now.Before(blockStart) && now.Before(blockEnd) {
		log.Println("Signup is currently blocked!")
		return false
	}
	return true
}
