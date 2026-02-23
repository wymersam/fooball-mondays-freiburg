// db.go
// SQLite database logic for users and signups
package main

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func initDB() {
	var err error
	db, err = sql.Open("sqlite3", "file:football-mondays.db?cache=shared&mode=rwc")
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}

	// Create users table
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS users (
		id TEXT PRIMARY KEY,
		username TEXT UNIQUE NOT NULL,
		created_at DATETIME,
		last_ip TEXT
	)`)
	if err != nil {
		log.Fatalf("Failed to create users table: %v", err)
	}

	// Create signups table
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS signups (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id TEXT NOT NULL,
		username TEXT NOT NULL,
		signup_time DATETIME,
		position INTEGER,
		week_key TEXT NOT NULL
	)`)
	if err != nil {
		log.Fatalf("Failed to create signups table: %v", err)
	}
}
