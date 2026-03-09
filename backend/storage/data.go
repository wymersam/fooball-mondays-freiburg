package storage

import (
	"database/sql"
	"football-mondays/db"
	"log"
	"time"
)

// CheckWeeklyReset checks if it's Monday 7pm (Europe/Berlin) and resets signups for the week if needed
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

	// If it's Monday 7pm or later, clear signups for the week
	if now.Weekday() == time.Monday && now.Hour() >= 18 {
		signups, _ := db.GetSignupsForWeek(dbConn, currentWeekKey)
		if len(signups) > 0 {
			resetTime := time.Date(now.Year(), now.Month(), now.Day(), 18, 0, 0, 0, loc)
			for _, signup := range signups {
				if signup.SignupTime.In(loc).Before(resetTime) {
					log.Printf("Resetting signups for week %s at Monday 7pm (Europe/Berlin)", currentWeekKey)
					_ = db.ClearSignupsForWeek(dbConn, currentWeekKey)
					break
				}
			}
		}
	}
}
