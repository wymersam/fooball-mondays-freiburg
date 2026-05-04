package storage

import (
	"database/sql"
	"football-mondays/db"
	"football-mondays/models"
	"testing"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

// berlinTime constructs a time in Europe/Berlin for a given date and hour.
func berlinTime(year int, month time.Month, day, hour, minute int) time.Time {
	loc, _ := time.LoadLocation("Europe/Berlin")
	return time.Date(year, month, day, hour, minute, 0, 0, loc)
}

// newDB opens an in-memory SQLite DB and creates the schema.
func newDB(t *testing.T) *sql.DB {
	t.Helper()
	sqlDB, err := sql.Open("sqlite3", ":memory:")
	if err != nil {
		t.Fatalf("open db: %v", err)
	}
	if err := db.CreateTables(sqlDB); err != nil {
		t.Fatalf("create tables: %v", err)
	}
	t.Cleanup(func() { sqlDB.Close() })
	return sqlDB
}

// countSignups returns the number of signups for a given week key.
func countSignups(t *testing.T, sqlDB *sql.DB, weekKey string) int {
	t.Helper()
	var n int
	if err := sqlDB.QueryRow(`SELECT COUNT(*) FROM signups WHERE week_key = ?`, weekKey).Scan(&n); err != nil {
		t.Fatalf("count signups for %s: %v", weekKey, err)
	}
	return n
}

// insertSignup is a helper that fatals on error.
func insertSignup(t *testing.T, sqlDB *sql.DB, userID, username, weekKey string, bibWasher bool) {
	t.Helper()
	s := models.Signup{UserID: userID, Username: username, SignupTime: time.Now(), Position: 1}
	if err := db.InsertSignup(sqlDB, s, weekKey); err != nil {
		t.Fatalf("insert signup: %v", err)
	}
	if bibWasher {
		if err := db.SetBibWasher(sqlDB, userID, weekKey, true); err != nil {
			t.Fatalf("set bib washer: %v", err)
		}
	}
}

// resetAt fires checkWeeklyResetAt and resets lastResetWeekKey so each test is independent.
func resetAt(sqlDB *sql.DB, now time.Time) {
	lastResetWeekKey = ""
	checkWeeklyResetAt(sqlDB, now)
}

// Monday May 4 2026 at 20:00 Europe/Berlin — a normal post-game reset moment.
// currentWeekKey  = "2026-05-04"
// bibWasherSource = "2026-04-27"  (last game week)
// weekToClean     = "2026-04-20"  (two weeks ago)
var resetNow = berlinTime(2026, time.May, 4, 20, 0)

const (
	weekCurrent  = "2026-05-04"
	weekLastGame = "2026-04-27"
	weekTwoAgo   = "2026-04-20"
	weekThreeAgo = "2026-04-13"
)

// TestResetClearsTwoWeeksAgo verifies that the reset deletes signups from two weeks ago,
// which is the safe window (payments tab still references last week).
func TestResetClearsTwoWeeksAgo(t *testing.T) {
	sqlDB := newDB(t)
	insertSignup(t, sqlDB, "u1", "alice", weekTwoAgo, false)

	resetAt(sqlDB, resetNow)

	if n := countSignups(t, sqlDB, weekTwoAgo); n != 0 {
		t.Errorf("expected signups from %s to be cleared, got %d", weekTwoAgo, n)
	}
}

// TestResetPreservesLastWeekForPayments verifies that last week's signups are NOT cleared,
// so the payments tab remains usable throughout the week.
func TestResetPreservesLastWeekForPayments(t *testing.T) {
	sqlDB := newDB(t)
	insertSignup(t, sqlDB, "u1", "alice", weekLastGame, false)

	resetAt(sqlDB, resetNow)

	if n := countSignups(t, sqlDB, weekLastGame); n != 1 {
		t.Errorf("expected last week's signups (%s) to be preserved, got %d", weekLastGame, n)
	}
}

// TestBibWasherCarriedFromLastGameWeek is the regression test for the original bug:
// the bib washer must be read from the last game week (currentWeek-7), not two weeks ago.
// CarryForwardBibWasher pre-registers them in the new week (bib_washer=false — they already washed).
func TestBibWasherCarriedFromLastGameWeek(t *testing.T) {
	sqlDB := newDB(t)
	// Bib washer was set in the last game week — this is where it should be read from.
	insertSignup(t, sqlDB, "u1", "alice", weekLastGame, true)

	resetAt(sqlDB, resetNow)

	// Alice should be pre-registered in the new week as a regular player.
	if n := countSignups(t, sqlDB, weekCurrent); n != 1 {
		t.Errorf("expected bib washer to be carried forward into %s as a signup, got %d signups", weekCurrent, n)
	}
	// They should NOT be marked as bib washer for the new week (they already washed).
	bibID, err := db.GetBibWasher(sqlDB, weekCurrent)
	if err != nil {
		t.Fatalf("get bib washer: %v", err)
	}
	if bibID != "" {
		t.Errorf("carried-forward player should not be bib washer for new week, got %q", bibID)
	}
}

// TestBibWasherNotCarriedFromTwoWeeksAgo ensures a bib washer set two weeks ago
// (without being in last week) is NOT mistakenly carried forward.
func TestBibWasherNotCarriedFromTwoWeeksAgo(t *testing.T) {
	sqlDB := newDB(t)
	// Bib washer only in two-weeks-ago week, nothing in last week.
	insertSignup(t, sqlDB, "u1", "alice", weekTwoAgo, true)

	resetAt(sqlDB, resetNow)

	if n := countSignups(t, sqlDB, weekCurrent); n != 0 {
		t.Errorf("expected no carry-forward from two weeks ago into %s, got %d signups", weekCurrent, n)
	}
}

// TestResetDoesNotFireBeforeResetHour ensures no cleanup happens before the configured time.
func TestResetDoesNotFireBeforeResetHour(t *testing.T) {
	sqlDB := newDB(t)
	insertSignup(t, sqlDB, "u1", "alice", weekTwoAgo, false)

	// 18:59 — one minute before the 19:00 reset.
	before := berlinTime(2026, time.May, 4, 18, 59)
	resetAt(sqlDB, before)

	if n := countSignups(t, sqlDB, weekTwoAgo); n != 1 {
		t.Errorf("reset should not fire before 19:00, but signups were cleared")
	}
}

// TestResetDoesNotFireOnNonResetDay ensures no cleanup happens on a non-Monday.
func TestResetDoesNotFireOnNonResetDay(t *testing.T) {
	sqlDB := newDB(t)
	insertSignup(t, sqlDB, "u1", "alice", weekTwoAgo, false)

	// Tuesday May 5 at 20:00.
	tuesday := berlinTime(2026, time.May, 5, 20, 0)
	resetAt(sqlDB, tuesday)

	if n := countSignups(t, sqlDB, weekTwoAgo); n != 1 {
		t.Errorf("reset should not fire on a non-Monday, but signups were cleared")
	}
}

// TestResetOnlyFiresOncePerWeek ensures calling checkWeeklyResetAt twice on the same Monday
// doesn't double-clear or re-process.
func TestResetOnlyFiresOncePerWeek(t *testing.T) {
	sqlDB := newDB(t)
	insertSignup(t, sqlDB, "u1", "alice", weekTwoAgo, false)

	// First call — should reset.
	lastResetWeekKey = ""
	checkWeeklyResetAt(sqlDB, resetNow)
	// Re-insert to check if a second call would clear again.
	insertSignup(t, sqlDB, "u2", "bob", weekTwoAgo, false)
	// Second call — should be a no-op.
	checkWeeklyResetAt(sqlDB, resetNow)

	if n := countSignups(t, sqlDB, weekTwoAgo); n != 1 {
		t.Errorf("expected reset to fire only once; got %d signups after second call", n)
	}
}
