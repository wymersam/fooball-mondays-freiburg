package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/smtp"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

// Data structures
type Signup struct {
	UserID     string    `json:"userId"`
	Username   string    `json:"username"`
	SignupTime time.Time `json:"signupTime"`
	Position   int       `json:"position"`
}

type User struct {
	Username     string    `json:"username"`
	PasswordHash string    `json:"passwordHash"`
	Email        string    `json:"email,omitempty"`
	CreatedAt    time.Time `json:"createdAt"`
	LastIP       string    `json:"lastIp,omitempty"`
}

type ChatMessage struct {
	ID        string    `json:"id"`
	Username  string    `json:"username"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
	WeekKey   string    `json:"weekKey"`
}

type DataStore struct {
	CurrentWeek  string                   `json:"currentWeek"`
	Signups      map[string][]Signup      `json:"signups"`
	Users        map[string]User          `json:"users"`
	ChatMessages map[string][]ChatMessage `json:"chatMessages"`
}

// WebSocket structures
type Client struct {
	conn     *websocket.Conn
	username string
	hub      *Hub
	send     chan []byte
}

type Hub struct {
	clients    map[*Client]bool
	broadcast  chan []byte
	register   chan *Client
	unregister chan *Client
	mutex      sync.RWMutex
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
	Password string `json:"password"`
	Email    string `json:"email"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
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

// WebSocket upgrader and hub
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow connections from any origin in development
	},
}

var hub *Hub

var freiburgLocation *time.Location

func init() {
	var err error
	freiburgLocation, err = time.LoadLocation("Europe/Berlin")
	if err != nil {
		log.Fatalf("Failed to load Europe/Berlin timezone: %v", err)
	}
}

// Get data file path (allows override via environment variable)
func getDataFilePath() string {
	if path := os.Getenv("DATA_FILE"); path != "" {
		return path
	}
	return DataFile
}

// Initialise data file if it doesn't exist
func initDataFile() {
	dataFilePath := getDataFilePath()
	if _, err := os.Stat(dataFilePath); os.IsNotExist(err) {
		// Ensure directory exists
		if err := os.MkdirAll(filepath.Dir(dataFilePath), 0755); err != nil {
			log.Printf("Error creating data directory: %v", err)
		}

		initialData := DataStore{
			CurrentWeek:  getCurrentWeekKey(),
			Signups:      make(map[string][]Signup),
			Users:        make(map[string]User),
			ChatMessages: make(map[string][]ChatMessage),
		}
		saveData(&initialData)
	}
	loadData()
}

// Get current week key (Monday of current week)
func getCurrentWeekKey() string {
	now := time.Now().In(freiburgLocation)
	// Calculate Monday of this week
	monday := now.AddDate(0, 0, -int(now.Weekday())+1)
	if now.Weekday() == time.Sunday {
		monday = monday.AddDate(0, 0, -7)
	}
	return monday.Format("2006-01-02")
}

// Check if signups should be reset (Monday 7pm or later)
func shouldResetSignups() bool {
	now := time.Now().In(freiburgLocation)
	weekday := now.Weekday()
	hour := now.Hour()

	// Reset on Monday at 7pm or later
	return weekday == time.Monday && hour >= 19
}

// Check if signups are allowed (anytime except Monday 7pm-8pm)
func isSignupTime() bool {
	now := time.Now().In(freiburgLocation)
	weekday := now.Weekday()
	hour := now.Hour()

	// Block signup only during Monday 7pm-8pm reset window
	if weekday == time.Monday && hour == 19 {
		return false
	}

	return true
}

// Check and handle weekly reset at 7pm Monday
func checkWeeklyReset() {
	currentWeek := getCurrentWeekKey()

	// If it's Monday 7pm or later and we haven't reset yet for this week
	if shouldResetSignups() {
		// Check if we've already reset by looking at signup times
		weekSignups := dataStore.Signups[currentWeek]
		if len(weekSignups) > 0 {
			// If there are signups and any are from before today 7pm, reset
			now := time.Now().In(freiburgLocation)
			resetTime := time.Date(now.Year(), now.Month(), now.Day(), 19, 0, 0, 0, freiburgLocation)

			for _, signup := range weekSignups {
				if signup.SignupTime.Before(resetTime) {
					log.Printf("Resetting signups for week %s at Monday 7pm", currentWeek)
					resetSignupsForWeek(currentWeek)
					break
				}
			}
		}
	}
}

// Reset signups for the current week
func resetSignupsForWeek(weekKey string) {
	dataStore.CurrentWeek = weekKey
	if dataStore.Signups == nil {
		dataStore.Signups = make(map[string][]Signup)
	}
	dataStore.Signups[weekKey] = []Signup{}
	saveData(dataStore)
}

// Load data from JSON file
func loadData() {
	dataFilePath := getDataFilePath()
	data, err := os.ReadFile(dataFilePath)
	if err != nil {
		log.Printf("Error loading data: %v", err)
		dataStore = &DataStore{
			CurrentWeek:  getCurrentWeekKey(),
			Signups:      make(map[string][]Signup),
			Users:        make(map[string]User),
			ChatMessages: make(map[string][]ChatMessage),
		}
		return
	}

	err = json.Unmarshal(data, &dataStore)
	if err != nil {
		log.Printf("Error parsing data: %v", err)
		dataStore = &DataStore{
			CurrentWeek:  getCurrentWeekKey(),
			Signups:      make(map[string][]Signup),
			Users:        make(map[string]User),
			ChatMessages: make(map[string][]ChatMessage),
		}
	}

	log.Printf("Loaded shared data from %s", dataFilePath)
}

// Save data to JSON file
func saveData(data *DataStore) {
	dataFilePath := getDataFilePath()
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

// Send email notification using Gmail SMTP (500 emails/day)
func sendEmailNotification(email, subject, body string) error {
	if email == "" {
		return nil // User doesn't have email configured
	}

	// Get Gmail SMTP credentials from environment
	smtpEmail := os.Getenv("SMTP_EMAIL")
	smtpPassword := os.Getenv("SMTP_PASSWORD")

	if smtpEmail == "" || smtpPassword == "" {
		// If no credentials, just log (development mode)
		log.Printf("=== EMAIL NOTIFICATION (NOT SENT - NO SMTP CONFIG) ===")
		log.Printf("To: %s", email)
		log.Printf("Subject: %s", subject)
		log.Printf("Body: %s", body)
		log.Printf("=======================================================")
		return nil
	}

	// Setup authentication
	auth := smtp.PlainAuth("", smtpEmail, smtpPassword, "smtp.gmail.com")

	// Compose email message
	fromName := "Football Mondays Freiburg"
	msg := []byte("From: " + fromName + " <" + smtpEmail + ">\r\n" +
		"To: " + email + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"\r\n" +
		body + "\r\n")

	// Send email via Gmail SMTP
	err := smtp.SendMail(
		"smtp.gmail.com:587",
		auth,
		smtpEmail,
		[]string{email},
		msg,
	)

	if err != nil {
		log.Printf("Error sending email to %s: %v", email, err)
		return fmt.Errorf("failed to send email: %w", err)
	}

	log.Printf("✅ Email sent successfully to %s", email)
	return nil
}

// Check if someone moved from reserve to starting XI and notify them
func checkAndNotifyPromotions(currentWeek string, oldSignups, newSignups []Signup) {
	// Create maps for quick lookup
	oldPositions := make(map[string]int)
	for i, signup := range oldSignups {
		oldPositions[signup.UserID] = i + 1
	}

	// Check each person in the new signups
	for i, signup := range newSignups {
		newPosition := i + 1
		oldPosition, existed := oldPositions[signup.UserID]

		// If they moved from reserve (>20) to starting XI (<=20)
		if existed && oldPosition > 20 && newPosition <= 20 {
			// Get user details to send email notification
			user, exists := dataStore.Users[signup.UserID]
			if exists && user.Email != "" {
				subject := "⚽ You're in the Starting XI!"
				body := fmt.Sprintf(
					"Great news, %s!\n\n"+
						"You're in the Starting XI for Monday :).\n\n"+
						"See you on the pitch! Jawooohhhlll 🏟️\n\n",
					user.Username,
				)
				go sendEmailNotification(user.Email, subject, body)
			}
		}
	}
}

// API Handlers
func healthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":    "OK",
		"timestamp": time.Now().In(freiburgLocation).Format(time.RFC3339),
	})
}

func statusHandler(c *gin.Context) {
	// Check and handle weekly reset
	checkWeeklyReset()

	currentWeek := getCurrentWeekKey()

	weekSignups := dataStore.Signups[currentWeek]
	if weekSignups == nil {
		weekSignups = []Signup{}
	}

	mainList := weekSignups
	reserveList := []Signup{}
	if len(weekSignups) > 20 {
		mainList = weekSignups[:20]
		reserveList = weekSignups[20:]
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

	if len(req.Password) < 4 {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Password must be at least 4 characters"})
		return
	}

	// Check if username already exists
	for _, user := range dataStore.Users {
		if user.Username == req.Username {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Username already taken"})
			return
		}
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "Failed to create account"})
		return
	}

	userID := uuid.New().String()
	clientIP := c.ClientIP()
	dataStore.Users[userID] = User{
		Username:     req.Username,
		PasswordHash: string(hashedPassword),
		Email:        req.Email,
		CreatedAt:    time.Now().In(freiburgLocation),
		LastIP:       clientIP,
	}

	saveData(dataStore)

	// Set cookie - use Lax for development, None for production
	isProduction := os.Getenv("PORT") != "" || os.Getenv("RAILWAY_ENVIRONMENT") != ""
	if isProduction {
		c.SetSameSite(http.SameSiteNoneMode)
		c.SetCookie("userId", userID, 30*24*60*60, "/", "", true, true) // 30 days, secure
	} else {
		c.SetSameSite(http.SameSiteLaxMode)
		c.SetCookie("userId", userID, 30*24*60*60, "/", "", false, true) // 30 days
	}

	c.JSON(http.StatusOK, RegisterResponse{
		Success:  true,
		Username: req.Username,
	})
}

func loginHandler(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid request format"})
		return
	}

	// Find user by username
	var foundUserID string
	var foundUser User
	for userID, user := range dataStore.Users {
		if user.Username == req.Username {
			foundUserID = userID
			foundUser = user
			break
		}
	}

	if foundUserID == "" {
		c.JSON(http.StatusUnauthorized, ErrorResponse{Error: "Invalid username or password"})
		return
	}

	// Check password
	err := bcrypt.CompareHashAndPassword([]byte(foundUser.PasswordHash), []byte(req.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, ErrorResponse{Error: "Invalid username or password"})
		return
	}

	// Update last IP
	foundUser.LastIP = c.ClientIP()
	dataStore.Users[foundUserID] = foundUser
	saveData(dataStore)

	// Set cookie - use Lax for development, None for production
	isProduction := os.Getenv("PORT") != "" || os.Getenv("RAILWAY_ENVIRONMENT") != ""
	if isProduction {
		c.SetSameSite(http.SameSiteNoneMode)
		c.SetCookie("userId", foundUserID, 30*24*60*60, "/", "", true, true) // 30 days, secure
	} else {
		c.SetSameSite(http.SameSiteLaxMode)
		c.SetCookie("userId", foundUserID, 30*24*60*60, "/", "", false, true) // 30 days
	}

	c.JSON(http.StatusOK, RegisterResponse{
		Success:  true,
		Username: foundUser.Username,
	})
}

func signupHandler(c *gin.Context) {
	if !isSignupTime() {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Signups are temporarily blocked during the reset window (Monday 7pm-8pm). Please try again after 8pm."})
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
		SignupTime: time.Now().In(freiburgLocation),
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

	// Store old signups before removal for promotion detection
	oldSignups := make([]Signup, len(dataStore.Signups[currentWeek]))
	copy(oldSignups, dataStore.Signups[currentWeek])

	// Remove the signup
	dataStore.Signups[currentWeek] = append(
		dataStore.Signups[currentWeek][:signupIndex],
		dataStore.Signups[currentWeek][signupIndex+1:]...,
	)

	// Update positions
	for i := range dataStore.Signups[currentWeek] {
		dataStore.Signups[currentWeek][i].Position = i + 1
	}

	// Check and notify promotions
	checkAndNotifyPromotions(currentWeek, oldSignups, dataStore.Signups[currentWeek])

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

func logoutHandler(c *gin.Context) {
	// Clear the userId cookie
	isProduction := os.Getenv("PORT") != "" || os.Getenv("RAILWAY_ENVIRONMENT") != ""
	if isProduction {
		c.SetSameSite(http.SameSiteNoneMode)
		c.SetCookie("userId", "", -1, "/", "", true, true) // MaxAge -1 deletes the cookie
	} else {
		c.SetSameSite(http.SameSiteLaxMode)
		c.SetCookie("userId", "", -1, "/", "", false, true)
	}

	c.JSON(http.StatusOK, SuccessResponse{Success: true})
}

// Admin handler to clear all users
func adminClearUsersHandler(c *gin.Context) {
	// Check admin secret from header or query param
	adminSecret := c.GetHeader("X-Admin-Secret")
	if adminSecret == "" {
		adminSecret = c.Query("secret")
	}

	expectedSecret := os.Getenv("ADMIN_SECRET")
	if expectedSecret == "" {
		c.JSON(http.StatusForbidden, ErrorResponse{Error: "Admin functionality not configured"})
		return
	}

	if adminSecret != expectedSecret {
		c.JSON(http.StatusUnauthorized, ErrorResponse{Error: "Invalid admin secret"})
		return
	}

	// Clear all users
	userCount := len(dataStore.Users)
	dataStore.Users = make(map[string]User)
	saveData(dataStore)

	log.Printf("Admin cleared %d users", userCount)
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": fmt.Sprintf("Cleared %d users", userCount),
	})
}

// Admin handler to clear all signups for current week
func adminClearSignupsHandler(c *gin.Context) {
	// Check admin secret
	adminSecret := c.GetHeader("X-Admin-Secret")
	if adminSecret == "" {
		adminSecret = c.Query("secret")
	}

	expectedSecret := os.Getenv("ADMIN_SECRET")
	if expectedSecret == "" {
		c.JSON(http.StatusForbidden, ErrorResponse{Error: "Admin functionality not configured"})
		return
	}

	if adminSecret != expectedSecret {
		c.JSON(http.StatusUnauthorized, ErrorResponse{Error: "Invalid admin secret"})
		return
	}

	// Clear signups for current week
	currentWeek := getCurrentWeekKey()
	signupCount := len(dataStore.Signups[currentWeek])
	dataStore.Signups[currentWeek] = []Signup{}
	saveData(dataStore)

	log.Printf("Admin cleared %d signups for week %s", signupCount, currentWeek)
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": fmt.Sprintf("Cleared %d signups for week %s", signupCount, currentWeek),
	})
}

// Serve static files
func setupStaticFiles(r *gin.Engine) {
	// Check if build directory exists (production)
	if _, err := os.Stat("./build/index.html"); err == nil {
		r.Static("/assets", "./build/assets")
		r.StaticFile("/", "./build/index.html")
		r.NoRoute(func(c *gin.Context) {
			c.File("./build/index.html")
		})
	} else {
		// Development mode - serve from public
		r.Static("/static", "./public")
		r.StaticFile("/", "./public/index.html")
	}
}

// Start background goroutine to check for weekly resets
func startWeeklyResetChecker() {
	go func() {
		for {
			// Check every 5 minutes
			time.Sleep(5 * time.Minute)
			checkWeeklyReset()
		}
	}()
}

// WebSocket Hub implementation
func newHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]bool),
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			h.mutex.Lock()
			h.clients[client] = true
			h.mutex.Unlock()
			log.Printf("WebSocket client connected: %s", client.username)

		case client := <-h.unregister:
			h.mutex.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
				log.Printf("WebSocket client disconnected: %s", client.username)
			}
			h.mutex.Unlock()

		case message := <-h.broadcast:
			h.mutex.RLock()
			for client := range h.clients {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
			h.mutex.RUnlock()
		}
	}
}

// WebSocket client methods
func (c *Client) readPump() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()

	c.conn.SetReadLimit(512)
	c.conn.SetReadDeadline(time.Now().In(freiburgLocation).Add(60 * time.Second))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().In(freiburgLocation).Add(60 * time.Second))
		return nil
	})

	for {
		_, messageBytes, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("WebSocket error: %v", err)
			}
			break
		}

		var incomingMessage struct {
			Message string `json:"message"`
		}
		if err := json.Unmarshal(messageBytes, &incomingMessage); err != nil {
			log.Printf("Error parsing message: %v", err)
			continue
		}

		// Create chat message
		chatMessage := ChatMessage{
			ID:        uuid.New().String(),
			Username:  c.username,
			Message:   incomingMessage.Message,
			Timestamp: time.Now().In(freiburgLocation),
			WeekKey:   getCurrentWeekKey(),
		}

		// Save to datastore
		currentWeek := getCurrentWeekKey()
		if dataStore.ChatMessages == nil {
			dataStore.ChatMessages = make(map[string][]ChatMessage)
		}
		dataStore.ChatMessages[currentWeek] = append(dataStore.ChatMessages[currentWeek], chatMessage)
		saveData(dataStore)

		// Broadcast to all clients
		messageJSON, _ := json.Marshal(chatMessage)
		select {
		case c.hub.broadcast <- messageJSON:
		default:
			close(c.send)
			delete(c.hub.clients, c)
		}
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(54 * time.Second)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().In(freiburgLocation).Add(10 * time.Second))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().In(freiburgLocation).Add(10 * time.Second))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// Chat API handlers
func chatHistoryHandler(c *gin.Context) {
	currentWeek := getCurrentWeekKey()

	var messages []ChatMessage
	if dataStore.ChatMessages != nil {
		if weekMessages, exists := dataStore.ChatMessages[currentWeek]; exists {
			messages = weekMessages
		}
	}

	if messages == nil {
		messages = []ChatMessage{}
	}

	c.JSON(http.StatusOK, gin.H{"messages": messages})
}

func websocketHandler(c *gin.Context) {
	// Get username from query parameter (you might want to use JWT auth here)
	username := c.Query("username")
	if username == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username required"})
		return
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}

	client := &Client{
		conn:     conn,
		username: username,
		hub:      hub,
		send:     make(chan []byte, 256),
	}

	client.hub.register <- client

	go client.writePump()
	go client.readPump()
}

func main() {
	// Load .env file if it exists (for local development)
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	} else {
		log.Println("Loaded environment variables from .env file")
	}

	// Initialize data
	initDataFile()

	// Initialize WebSocket hub
	hub = newHub()
	go hub.run()

	// Start weekly reset checker
	startWeeklyResetChecker()
	log.Println("Weekly reset checker started")

	// Setup Gin router
	r := gin.Default()

	// CORS middleware
	config := cors.DefaultConfig()

	// Detect if we're in production (Railway sets PORT, or check for build files)
	isProduction := os.Getenv("PORT") != "" || os.Getenv("RAILWAY_ENVIRONMENT") != ""

	if isProduction {
		// Production - allow Railway domains and any custom frontend
		allowedOrigins := []string{
			"https://football-mondays-freiburg-production.up.railway.app",
			"https://football-mondays-production.up.railway.app",
		}
		// Add custom frontend URL if provided
		if frontendURL := os.Getenv("FRONTEND_URL"); frontendURL != "" {
			allowedOrigins = append(allowedOrigins, frontendURL)
		}
		config.AllowOrigins = allowedOrigins
		log.Printf("CORS enabled for production origins: %v", allowedOrigins)
	} else {
		// Development
		config.AllowOrigins = []string{"http://localhost:3000"}
		log.Println("CORS enabled for development: http://localhost:3000")
	}
	config.AllowCredentials = true
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	r.Use(cors.New(config))

	// API routes
	api := r.Group("/api")
	{
		api.GET("/health", healthHandler)
		api.GET("/status", statusHandler)
		api.POST("/register", registerHandler)
		api.POST("/login", loginHandler)
		api.POST("/logout", logoutHandler)
		api.POST("/signup", signupHandler)
		api.DELETE("/signup", removeSignupHandler)
		api.GET("/user", userHandler)
		// Chat routes
		api.GET("/chat/history", chatHistoryHandler)
		api.GET("/chat/ws", websocketHandler)
	}

	// Admin routes
	admin := r.Group("/api/admin")
	{
		admin.POST("/clear-users", adminClearUsersHandler)
		admin.POST("/clear-signups", adminClearSignupsHandler)
	}

	// Setup static file serving
	setupStaticFiles(r)

	// Get port from environment or default to 3001
	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	// Bind to 0.0.0.0 for Railway deployment
	addr := "0.0.0.0:" + port
	fmt.Printf("Football Mondays Go server running on %s\n", addr)
	log.Fatal(r.Run(addr))
}
