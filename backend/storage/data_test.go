package storage

import (
	"database/sql"
	"football-mondays/db"
	"football-mondays/models"
	"testing"
	"time"
)

func TestWeeklyReset(t *testing.T) {
	// Open in-memory SQLite DB
	sqlDB, err := sql.Open("sqlite3", ":memory:")
	if err != nil {
		t.Fatalf("Failed to open in-memory DB: %v", err)
	}
	defer sqlDB.Close()

	// Create tables
	if err := db.CreateTables(sqlDB); err != nil {
		t.Fatalf("Failed to create tables: %v", err)
	}

	// Insert a signup for last week
	lastWeek := "2024-02-26"
	signupTime := time.Date(2024, 2, 26, 19, 0, 0, 0, time.UTC)
	signup := models.Signup{
		UserID:     "1",
		Username:   "foo",
		SignupTime: signupTime,
		Position:   1,
	}
	if err := db.InsertSignup(sqlDB, signup, lastWeek); err != nil {
		t.Fatalf("Failed to insert signup: %v", err)
	}

	// Call the reset logic
	CheckWeeklyReset(sqlDB)

	// Check that signups for last week are cleared
	signups, err := db.GetSignupsForWeek(sqlDB, lastWeek)
	if err != nil {
		t.Fatalf("Failed to get signups: %v", err)
	}
	if len(signups) != 0 {
		t.Errorf("Signups not reset for new week")
	}
}
