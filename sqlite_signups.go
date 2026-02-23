package main

import (
	"database/sql"
	"time"
)

// Insert a signup into the database
func insertSignup(db *sql.DB, signup Signup, weekKey string) error {
	_, err := db.Exec(`INSERT INTO signups (user_id, username, signup_time, position, week_key) VALUES (?, ?, ?, ?, ?)`,
		signup.UserID, signup.Username, signup.SignupTime, signup.Position, weekKey)
	return err
}

// Get all signups for a week
func getSignupsForWeek(db *sql.DB, weekKey string) ([]Signup, error) {
	rows, err := db.Query(`SELECT user_id, username, signup_time, position FROM signups WHERE week_key = ? ORDER BY position ASC`, weekKey)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var signups []Signup
	for rows.Next() {
		var s Signup
		var signupTime string
		if err := rows.Scan(&s.UserID, &s.Username, &signupTime, &s.Position); err != nil {
			return nil, err
		}
		t, _ := time.Parse(time.RFC3339, signupTime)
		s.SignupTime = t
		signups = append(signups, s)
	}
	return signups, nil
}

// Remove a signup for a user in a week
func removeSignup(db *sql.DB, userID, weekKey string) error {
	_, err := db.Exec(`DELETE FROM signups WHERE user_id = ? AND week_key = ?`, userID, weekKey)
	return err
}

// Clear all signups for a week
func clearSignupsForWeek(db *sql.DB, weekKey string) error {
	_, err := db.Exec(`DELETE FROM signups WHERE week_key = ?`, weekKey)
	return err
}
