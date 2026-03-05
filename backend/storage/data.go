package storage

import (
	"encoding/json"
	"football-mondays/models"
	"football-mondays/utils"
	"log"
	"os"
	"path/filepath"
	"time"
)

// EnsureDataStore makes sure the dataStore is initialised
func EnsureDataStore(ds *models.DataStore) {
	if ds == nil {
		log.Println("dataStore is nil, initialising...")
		InitDataFile(ds)
	}
}

// loadData loads data from JSON file
func loadData(ds *models.DataStore) {
	dataFilePath := utils.GetDataFilePath()
	data, err := os.ReadFile(dataFilePath)
	if err != nil {
		log.Printf("Error loading data: %v", err)
		*ds = models.DataStore{
			CurrentWeek: utils.GetCurrentWeekKey(),
			Signups:     make(map[string][]models.Signup),
			Users:       make(map[string]models.User),
		}
		return
	}

	var loaded models.DataStore
	err = json.Unmarshal(data, &loaded)
	if err != nil {
		log.Printf("Error parsing data: %v", err)
		*ds = models.DataStore{
			CurrentWeek: utils.GetCurrentWeekKey(),
			Signups:     make(map[string][]models.Signup),
			Users:       make(map[string]models.User),
		}
	} else {
		*ds = loaded
	}

	log.Printf("Loaded shared data from %s", dataFilePath)
}

// SaveData saves the data to JSON file
func SaveData(data *models.DataStore) {
	dataFilePath := utils.GetDataFilePath()
	jsonData, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		log.Printf("Error marshaling data: %v", err)
		return
	}

	err = os.WriteFile(dataFilePath, jsonData, 0644)
	if err != nil {
		log.Printf("Error saving data to %s: %v", dataFilePath, err)
		return
	}

	log.Printf("Saved shared data to %s", dataFilePath)
}

// InitDataFile initialises the data file if it doesn't exist
func InitDataFile(ds *models.DataStore) {
	dataFilePath := utils.GetDataFilePath()
	if _, err := os.Stat(dataFilePath); os.IsNotExist(err) {
		// Ensure directory exists
		if err := os.MkdirAll(filepath.Dir(dataFilePath), 0755); err != nil {
			log.Printf("Error creating data directory: %v", err)
		}

		initialData := models.DataStore{
			CurrentWeek: utils.GetCurrentWeekKey(),
			Signups:     make(map[string][]models.Signup),
			Users:       make(map[string]models.User),
		}
		SaveData(&initialData)
	}
	loadData(ds)
}

// Reset signups for the current week
func resetSignupsForWeek(weekKey string, ds *models.DataStore) {
	ds.CurrentWeek = weekKey
	if ds.Signups == nil {
		ds.Signups = make(map[string][]models.Signup)
	}
	ds.Signups[weekKey] = []models.Signup{}
	SaveData(ds)
}

// Check and handle weekly reset at 7pm Monday
func CheckWeeklyReset(dataStore *models.DataStore) {
	loc, err := time.LoadLocation("Europe/Berlin")
	if err != nil {
		loc = time.Local
	}

	// Defensive: ensure dataStore is initialized
	if dataStore == nil {
		log.Println("dataStore is nil in checkWeeklyReset, initialising...")
		InitDataFile(dataStore)
	}

	// Use German time for week key
	now := time.Now().In(loc)
	currentWeek := now.AddDate(0, 0, -int(now.Weekday())+1)
	if now.Weekday() == time.Sunday {
		currentWeek = currentWeek.AddDate(0, 0, -7)
	}
	currentWeekKey := currentWeek.Format("2006-01-02")

	// If we're in a new week, reset automatically
	if dataStore != nil && dataStore.CurrentWeek != currentWeekKey {
		log.Printf("New week detected: %s (was %s)", currentWeekKey, dataStore.CurrentWeek)
		resetSignupsForWeek(currentWeekKey, dataStore)
		return
	}

	// If it's Monday 7pm or later and we haven't reset yet for this week
	if dataStore != nil && now.Weekday() == time.Monday && now.Hour() >= 18 {
		weekSignups := dataStore.Signups[currentWeekKey]
		if len(weekSignups) > 0 {
			resetTime := time.Date(now.Year(), now.Month(), now.Day(), 18, 0, 0, 0, loc)
			for _, signup := range weekSignups {
				if signup.SignupTime.In(loc).Before(resetTime) {
					log.Printf("Resetting signups for week %s at Monday 7pm (Europe/Berlin)", currentWeekKey)
					resetSignupsForWeek(currentWeekKey, dataStore)
					break
				}
			}
		}
	}
}
