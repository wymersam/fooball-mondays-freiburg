package db

import (
	"database/sql"
	"football-mondays/models"
	"time"
)

// Insert a signup into the database
func InsertSignup(db *sql.DB, signup models.Signup, weekKey string) error {
	_, err := db.Exec(`INSERT INTO signups (user_id, username, signup_time, position, week_key) VALUES (?, ?, ?, ?, ?)`,
		signup.UserID, signup.Username, signup.SignupTime, signup.Position, weekKey)
	return err
}

// Get all signups for a week
func GetSignupsForWeek(db *sql.DB, weekKey string) ([]models.Signup, error) {
	rows, err := db.Query(`SELECT user_id, username, signup_time, position FROM signups WHERE week_key = ? ORDER BY position ASC`, weekKey)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var signups []models.Signup
	for rows.Next() {
		var s models.Signup
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
func RemoveSignup(db *sql.DB, userID, weekKey string) error {
	_, err := db.Exec(`DELETE FROM signups WHERE user_id = ? AND week_key = ?`, userID, weekKey)
	return err
}

// Clear all signups for a week
func ClearSignupsForWeek(db *sql.DB, weekKey string) error {
	_, err := db.Exec(`DELETE FROM signups WHERE week_key = ?`, weekKey)
	return err
}
