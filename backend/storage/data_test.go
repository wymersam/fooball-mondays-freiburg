package storage

import (
	"football-mondays/models"
	"testing"
	"time"
)

func TestWeeklyReset(t *testing.T) {
	// Setup a fake dataStore with a signup from last week
	ds := &models.DataStore{
		CurrentWeek: "2024-02-26",
		Signups: map[string][]models.Signup{
			"2024-02-26": {{UserID: "1", Username: "foo", SignupTime: time.Date(2024, 2, 26, 19, 0, 0, 0, time.UTC), Position: 1}},
		},
		Users: map[string]models.User{"1": {Username: "foo", CreatedAt: time.Now()}},
	}

	CheckWeeklyReset(ds)

	if ds.CurrentWeek != "2024-03-04" {
		t.Errorf("CurrentWeek not updated: got %v, want %v", ds.CurrentWeek, "2024-03-04")
	}
	if len(ds.Signups[ds.CurrentWeek]) != 0 {
		t.Errorf("Signups not reset for new week")
	}
}
