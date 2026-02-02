package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// Data structures
type Signup struct {
	UserID     string    `json:"userId"`
	Username   string    `json:"username"`
	SignupTime time.Time `json:"signupTime"`
	Position   int       `json:"position"`
}

type User struct {
	Username  string    `json:"username"`
	CreatedAt time.Time `json:"createdAt"`
}

type DataStore struct {
	CurrentWeek string              `json:"currentWeek"`
	Signups     map[string][]Signup `json:"signups"`
	Users       map[string]User     `json:"users"`
}

type SignupStatus struct {
	CurrentWeek  string   `json:"currentWeek"`
	CanSignup    bool     `json:"canSignup"`
	MainList     []Signup `json:"mainList"`
	ReserveList  []Signup `json:"reserveList"`
	UserSignedUp bool     `json:"userSignedUp"`
}

type RegisterRequest struct {
	Username string `json:"username"`
}

type RegisterResponse struct {
	Success  bool   `json:"success"`
	Username string `json:"username"`
}

type UserResponse struct {
	Authenticated bool   `json:"authenticated"`
	Username      string `json:"username,omitempty"`
}

type SuccessResponse struct {
	Success  bool `json:"success"`
	Position int  `json:"position,omitempty"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

const DataFile = "signups.json"

var dataStore *DataStore

// Initialize data file if it doesn't exist
func initDataFile() {
	if _, err := os.Stat(DataFile); os.IsNotExist(err) {
		initialData := DataStore{
			CurrentWeek: getCurrentWeekKey(),
			Signups:     make(map[string][]Signup),
			Users:       make(map[string]User),
		}
		saveData(&initialData)
	}
	loadData()
}

// Get current week key (Monday of current week)
func getCurrentWeekKey() string {
	now := time.Now()
	// Calculate Monday of this week
	monday := now.AddDate(0, 0, -int(now.Weekday())+1)
	if now.Weekday() == time.Sunday {
		monday = monday.AddDate(0, 0, -7)
	}
	return monday.Format("2006-01-02")
}

// Check if it's Monday 8pm or later
func isSignupTime() bool {
	now := time.Now()
	weekday := now.Weekday()
	hour := now.Hour()

	// Allow signup on Monday at 8pm or later, or any day after Monday
	return (weekday == time.Monday && hour >= 20) || weekday > time.Monday
}

// Load data from JSON file
func loadData() {
	data, err := ioutil.ReadFile(DataFile)
	if err != nil {
		log.Printf("Error loading data: %v", err)
		dataStore = &DataStore{
			CurrentWeek: getCurrentWeekKey(),
			Signups:     make(map[string][]Signup),
			Users:       make(map[string]User),
		}
		return
	}

	err = json.Unmarshal(data, &dataStore)
	if err != nil {
		log.Printf("Error parsing data: %v", err)
		dataStore = &DataStore{
			CurrentWeek: getCurrentWeekKey(),
			Signups:     make(map[string][]Signup),
			Users:       make(map[string]User),
		}
	}
}

// Save data to JSON file
func saveData(data *DataStore) {
	jsonData, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		log.Printf("Error marshaling data: %v", err)
		return
	}

	err = ioutil.WriteFile(DataFile, jsonData, 0644)
	if err != nil {
		log.Printf("Error saving data: %v", err)
	}
}

// API Handlers
func healthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":    "OK",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

func statusHandler(c *gin.Context) {
	currentWeek := getCurrentWeekKey()

	// Reset if new week
	if dataStore.CurrentWeek != currentWeek {
		dataStore.CurrentWeek = currentWeek
		if dataStore.Signups == nil {
			dataStore.Signups = make(map[string][]Signup)
		}
		dataStore.Signups[currentWeek] = []Signup{}
		saveData(dataStore)
	}

	weekSignups := dataStore.Signups[currentWeek]
	if weekSignups == nil {
		weekSignups = []Signup{}
	}

	mainList := weekSignups
	reserveList := []Signup{}
	if len(weekSignups) > 10 {
		mainList = weekSignups[:10]
		reserveList = weekSignups[10:]
	}

	userID, err := c.Cookie("userId")
	userSignedUp := false
	if err == nil && userID != "" {
		for _, signup := range weekSignups {
			if signup.UserID == userID {
				userSignedUp = true
				break
			}
		}
	}

	response := SignupStatus{
		CurrentWeek:  currentWeek,
		CanSignup:    isSignupTime(),
		MainList:     mainList,
		ReserveList:  reserveList,
		UserSignedUp: userSignedUp,
	}

	c.JSON(http.StatusOK, response)
}

func registerHandler(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid request format"})
		return
	}

	if len(req.Username) < 2 {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Username must be at least 2 characters"})
		return
	}

	userID := uuid.New().String()
	dataStore.Users[userID] = User{
		Username:  req.Username,
		CreatedAt: time.Now(),
	}

	saveData(dataStore)

	// Set cookie
	c.SetCookie("userId", userID, 30*24*60*60, "/", "", false, true) // 30 days

	c.JSON(http.StatusOK, RegisterResponse{
		Success:  true,
		Username: req.Username,
	})
}

func signupHandler(c *gin.Context) {
	if !isSignupTime() {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Signups only allowed on Monday at 8pm or later"})
		return
	}

	userID, err := c.Cookie("userId")
	if err != nil || userID == "" {
		c.JSON(http.StatusUnauthorized, ErrorResponse{Error: "Please register first"})
		return
	}

	user, exists := dataStore.Users[userID]
	if !exists {
		c.JSON(http.StatusUnauthorized, ErrorResponse{Error: "User not found"})
		return
	}

	currentWeek := getCurrentWeekKey()
	if dataStore.Signups[currentWeek] == nil {
		dataStore.Signups[currentWeek] = []Signup{}
	}

	// Check if user already signed up
	for _, signup := range dataStore.Signups[currentWeek] {
		if signup.UserID == userID {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: "You have already signed up for this week"})
			return
		}
	}

	// Add to signup list
	newSignup := Signup{
		UserID:     userID,
		Username:   user.Username,
		SignupTime: time.Now(),
		Position:   len(dataStore.Signups[currentWeek]) + 1,
	}

	dataStore.Signups[currentWeek] = append(dataStore.Signups[currentWeek], newSignup)
	saveData(dataStore)

	c.JSON(http.StatusOK, SuccessResponse{
		Success:  true,
		Position: len(dataStore.Signups[currentWeek]),
	})
}

func removeSignupHandler(c *gin.Context) {
	userID, err := c.Cookie("userId")
	if err != nil || userID == "" {
		c.JSON(http.StatusUnauthorized, ErrorResponse{Error: "Not authenticated"})
		return
	}

	currentWeek := getCurrentWeekKey()
	if dataStore.Signups[currentWeek] == nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "No signups for this week"})
		return
	}

	// Find and remove the signup
	signupIndex := -1
	for i, signup := range dataStore.Signups[currentWeek] {
		if signup.UserID == userID {
			signupIndex = i
			break
		}
	}

	if signupIndex == -1 {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "You are not signed up for this week"})
		return
	}

	// Remove the signup
	dataStore.Signups[currentWeek] = append(
		dataStore.Signups[currentWeek][:signupIndex],
		dataStore.Signups[currentWeek][signupIndex+1:]...,
	)

	// Update positions
	for i := range dataStore.Signups[currentWeek] {
		dataStore.Signups[currentWeek][i].Position = i + 1
	}

	saveData(dataStore)
	c.JSON(http.StatusOK, SuccessResponse{Success: true})
}

func userHandler(c *gin.Context) {
	userID, err := c.Cookie("userId")
	if err != nil || userID == "" {
		c.JSON(http.StatusOK, UserResponse{Authenticated: false})
		return
	}

	user, exists := dataStore.Users[userID]
	if !exists {
		c.JSON(http.StatusOK, UserResponse{Authenticated: false})
		return
	}

	c.JSON(http.StatusOK, UserResponse{
		Authenticated: true,
		Username:      user.Username,
	})
}

// Serve static files
func setupStaticFiles(r *gin.Engine) {
	// Serve React build files in production
	if os.Getenv("GIN_MODE") == "release" {
		r.Static("/static", "./build/static")
		r.StaticFile("/", "./build/index.html")
		r.NoRoute(func(c *gin.Context) {
			c.File("./build/index.html")
		})
	} else {
		r.Static("/static", "./public")
		r.StaticFile("/", "./public/index.html")
	}
}

func main() {
	// Initialize data
	initDataFile()

	// Setup Gin router
	r := gin.Default()

	// CORS middleware for development
	if os.Getenv("GIN_MODE") != "release" {
		config := cors.DefaultConfig()
		config.AllowOrigins = []string{"http://localhost:3000"}
		config.AllowCredentials = true
		config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
		r.Use(cors.New(config))
	}

	// API routes
	api := r.Group("/api")
	{
		api.GET("/health", healthHandler)
		api.GET("/status", statusHandler)
		api.POST("/register", registerHandler)
		api.POST("/signup", signupHandler)
		api.DELETE("/signup", removeSignupHandler)
		api.GET("/user", userHandler)
	}

	// Setup static file serving
	setupStaticFiles(r)

	// Get port from environment or default to 3001
	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	fmt.Printf("Football Mondays Go server running on http://localhost:%s\n", port)
	log.Fatal(r.Run(":" + port))
}
