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
		bib_washer BOOLEAN DEFAULT FALSE,
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
    ALTER TABLE signups ADD COLUMN IF NOT EXISTS bib_washer BOOLEAN DEFAULT FALSE;
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
	rows, err := db.Query(`SELECT user_id, username, signup_time, position, bib_washer FROM signups WHERE week_key = $1 ORDER BY position ASC`, weekKey)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var signups []models.Signup
	for rows.Next() {
		var s models.Signup
		var signupTime time.Time
		if err := rows.Scan(&s.UserID, &s.Username, &signupTime, &s.Position, &s.BibWasher); err != nil {
			return nil, err
		}
		s.SignupTime = signupTime
		signups = append(signups, s)
	}
	return signups, nil
}

// LookupBibWasherEntry finds the bib washer signup for a given week without modifying anything.
// Returns nil, nil if no bib washer exists.
func LookupBibWasherEntry(db *sql.DB, weekKey string) (*models.Signup, error) {
	var s models.Signup
	var signupTime time.Time
	err := db.QueryRow(
		`SELECT user_id, username, signup_time, position, bib_washer FROM signups WHERE week_key = $1 AND bib_washer = TRUE LIMIT 1`,
		weekKey,
	).Scan(&s.UserID, &s.Username, &signupTime, &s.Position, &s.BibWasher)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	s.SignupTime = signupTime
	return &s, nil
}

// CarryForwardBibWasher re-signs up the bib washer from fromWeekKey into toWeekKey.
// The player is inserted at the next available position in the new week (skipped if already signed up).
// Returns true if a bib washer was found and carried forward, false if none existed.
func CarryForwardBibWasher(db *sql.DB, fromWeekKey, toWeekKey string) (bool, error) {
	var userID, username string
	var signupTime time.Time
	err := db.QueryRow(
		`SELECT user_id, username, signup_time FROM signups WHERE week_key = $1 AND bib_washer = TRUE LIMIT 1`,
		fromWeekKey,
	).Scan(&userID, &username, &signupTime)
	if err == sql.ErrNoRows {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	var count int
	_ = db.QueryRow(`SELECT COUNT(*) FROM signups WHERE week_key = $1`, toWeekKey).Scan(&count)
	_, err = db.Exec(
		`INSERT INTO signups (user_id, username, signup_time, position, week_key, bib_washer)
		 VALUES ($1, $2, $3, $4, $5, FALSE)
		 ON CONFLICT (user_id, week_key) DO NOTHING`,
		userID, username, time.Now(), count+1, toWeekKey,
	)
	return true, err
}

// GetSignupForUser retrieves a single signup for a user in a given week.
func GetSignupForUser(db *sql.DB, userID, weekKey string) (*models.Signup, error) {
	var s models.Signup
	var signupTime time.Time
	err := db.QueryRow(
		`SELECT user_id, username, signup_time, position, bib_washer FROM signups WHERE user_id = $1 AND week_key = $2`,
		userID, weekKey,
	).Scan(&s.UserID, &s.Username, &signupTime, &s.Position, &s.BibWasher)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	s.SignupTime = signupTime
	return &s, nil
}

// GetBibWasher returns the userID of the current bib washer for a week, or "" if none.
func GetBibWasher(db *sql.DB, weekKey string) (string, error) {
	var userID string
	err := db.QueryRow(`SELECT user_id FROM signups WHERE week_key = $1 AND bib_washer = TRUE LIMIT 1`, weekKey).Scan(&userID)
	if err == sql.ErrNoRows {
		return "", nil
	}
	return userID, err
}

// SetBibWasher sets the bib_washer flag for a user's signup in a given week.
func SetBibWasher(db *sql.DB, userID, weekKey string, value bool) error {
	_, err := db.Exec(`UPDATE signups SET bib_washer = $1 WHERE user_id = $2 AND week_key = $3`, value, userID, weekKey)
	return err
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
