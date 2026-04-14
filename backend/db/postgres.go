package db

import (
	"database/sql"
	"football-mondays/models"
	"time"
)

// CreateTables creates the necessary tables if they don't exist (PostgreSQL version)
func CreateTables(db *sql.DB) error {
	_, err := db.Exec(`
    CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        created_at TIMESTAMPTZ NOT NULL
    );
    CREATE TABLE IF NOT EXISTS signups (
        user_id TEXT,
        username TEXT,
        signup_time TIMESTAMPTZ,
        position INTEGER,
        week_key TEXT,
        PRIMARY KEY (user_id, week_key),
        FOREIGN KEY(user_id) REFERENCES users(user_id)
    );
    `)
	return err
}

// MigrateSchema upgrades existing columns to TIMESTAMPTZ if they are plain TIMESTAMP.
// Safe to run on every startup — it's a no-op if already TIMESTAMPTZ.
func MigrateSchema(db *sql.DB) error {
	_, err := db.Exec(`
    ALTER TABLE users ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC';
    ALTER TABLE signups ALTER COLUMN signup_time TYPE TIMESTAMPTZ USING signup_time AT TIME ZONE 'UTC';
    `)
	return err
}

// InsertUser inserts a new user into the database
func InsertUser(db *sql.DB, user models.User) error {
	_, err := db.Exec(`INSERT INTO users (user_id, username, created_at) VALUES ($1, $2, $3)`,
		user.UserID, user.Username, user.CreatedAt)
	return err
}

// GetUserByID retrieves a user by user_id
func GetUserByID(db *sql.DB, userID string) (*models.User, error) {
	row := db.QueryRow(`SELECT user_id, username, created_at FROM users WHERE user_id = $1`, userID)
	var u models.User
	var createdAt time.Time
	err := row.Scan(&u.UserID, &u.Username, &createdAt)
	if err != nil {
		return nil, err
	}
	u.CreatedAt = createdAt
	return &u, nil
}

// GetUserByUsername retrieves a user by username
func GetUserByUsername(db *sql.DB, username string) (*models.User, error) {
	row := db.QueryRow(`SELECT user_id, username, created_at FROM users WHERE username = $1`, username)
	var u models.User
	var createdAt time.Time
	err := row.Scan(&u.UserID, &u.Username, &createdAt)
	if err != nil {
		return nil, err
	}
	u.CreatedAt = createdAt
	return &u, nil
}

// DeleteUser deletes a user by user_id
func DeleteUser(db *sql.DB, userID string) error {
	_, err := db.Exec(`DELETE FROM users WHERE user_id = $1`, userID)
	return err
}

// InsertSignup inserts a signup into the database
func InsertSignup(db *sql.DB, signup models.Signup, weekKey string) error {
	_, err := db.Exec(`INSERT INTO signups (user_id, username, signup_time, position, week_key) VALUES ($1, $2, $3, $4, $5)`,
		signup.UserID, signup.Username, signup.SignupTime, signup.Position, weekKey)
	return err
}

// GetSignupsForWeek retrieves all signups for a given week, ordered by position
func GetSignupsForWeek(db *sql.DB, weekKey string) ([]models.Signup, error) {
	rows, err := db.Query(`SELECT user_id, username, signup_time, position FROM signups WHERE week_key = $1 ORDER BY position ASC`, weekKey)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var signups []models.Signup
	for rows.Next() {
		var s models.Signup
		var signupTime time.Time
		if err := rows.Scan(&s.UserID, &s.Username, &signupTime, &s.Position); err != nil {
			return nil, err
		}
		s.SignupTime = signupTime
		signups = append(signups, s)
	}
	return signups, nil
}

// RemoveSignup removes a signup for a user in a week
func RemoveSignup(db *sql.DB, userID, weekKey string) error {
	_, err := db.Exec(`DELETE FROM signups WHERE user_id = $1 AND week_key = $2`, userID, weekKey)
	return err
}

// ClearSignupsForWeek clears all signups for a week
func ClearSignupsForWeek(db *sql.DB, weekKey string) error {
	_, err := db.Exec(`DELETE FROM signups WHERE week_key = $1`, weekKey)
	return err
}
