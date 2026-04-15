package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	_ "github.com/lib/pq"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/joho/godotenv"

	"football-mondays/db"
	"football-mondays/handlers"
	"football-mondays/storage"
	"football-mondays/utils"
)

func generateUUID() string {
	return uuid.New().String()
}

func setUserCookie(c *gin.Context, userID string) {
	isProduction := os.Getenv("PORT") != "" || os.Getenv("RAILWAY_ENVIRONMENT") != ""
	if isProduction {
		c.SetSameSite(http.SameSiteNoneMode)
		c.SetCookie("userId", userID, 30*24*60*60, "/", "", true, true)
	} else {
		c.SetSameSite(http.SameSiteLaxMode)
		c.SetCookie("userId", userID, 30*24*60*60, "/", "", false, true)
	}
}

// Serve static files
func setupStaticFiles(r *gin.Engine) {
	// Check if build directory exists (production)
	if _, err := os.Stat("./build/index.html"); err == nil {
		buildDir := http.Dir("./build")
		r.Use(func(c *gin.Context) {
			// Skip API routes
			if len(c.Request.URL.Path) >= 4 && c.Request.URL.Path[:4] == "/api" {
				c.Next()
				return
			}
			// Try to open the requested path in the build directory
			path := c.Request.URL.Path
			f, err := buildDir.Open(path)
			if err != nil {
				// Not found — serve index.html for SPA routing
				c.File("./build/index.html")
				c.Abort()
				return
			}
			f.Close()
			c.FileFromFS(path, buildDir)
			c.Abort()
		})
	} else {
		// Development mode - serve from public
		r.Static("/static", "./public")
		r.StaticFile("/", "./public/index.html")
	}
}

// Start background goroutine to check for weekly resets
func startWeeklyResetChecker(dbConn *sql.DB) {
	go func() {
		for {
			// Check every 5 minutes
			time.Sleep(5 * time.Minute)
			storage.CheckWeeklyReset(dbConn)
		}
	}()
}
func main() {
	// Load .env file if it exists (for local development)
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	} else {
		log.Println("Loaded environment variables from .env file")
	}

	// Initialize PostgreSQL database
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL environment variable is not set")
	}
	sqlDB, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}
	defer sqlDB.Close()

	// Create tables if they don't exist
	if err := db.CreateTables(sqlDB); err != nil {
		log.Fatalf("Failed to create tables: %v", err)
	}

	// Migrate existing TIMESTAMP columns to TIMESTAMPTZ
	if err := db.MigrateSchema(sqlDB); err != nil {
		log.Fatalf("Failed to migrate schema: %v", err)
	}

	// Start weekly reset checker
	startWeeklyResetChecker(sqlDB)
	log.Println("Weekly reset checker started")

	// Setup Gin router
	r := gin.Default()

	// CORS middleware
	config := cors.DefaultConfig()

	// Detect if we're in production (Railway sets PORT, or check for build files)
	isProduction := os.Getenv("PORT") != "" || os.Getenv("RAILWAY_ENVIRONMENT") != ""

	if isProduction {
		// Production - allow all deployed frontend domains and any custom frontend
		allowedOrigins := []string{
			"https://football-mondays-freiburg-development.up.railway.app",
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
		// Development - allow localhost and deployed frontend for local backend testing
		config.AllowOrigins = []string{
			"http://localhost:3000",
			"https://football-mondays-freiburg-development.up.railway.app",
		}
		log.Println("CORS enabled for development: http://localhost:3000 and https://football-mondays-freiburg-development.up.railway.app")
	}
	config.AllowCredentials = true
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	r.Use(cors.New(config))

	// API routes
	api := r.Group("/api")
	{
		api.GET("/health", handlers.HealthHandler)
		api.GET("/status", handlers.StatusHandler(sqlDB, utils.GetCurrentWeekKey, utils.IsSignupTime))
		api.POST("/register", handlers.RegisterHandler(sqlDB, generateUUID, setUserCookie))
		api.POST("/login", handlers.LoginHandler(sqlDB, setUserCookie))
		api.POST("/signup", handlers.SignupHandler(sqlDB, utils.GetCurrentWeekKey, utils.IsSignupTime))
		api.DELETE("/signup", handlers.RemoveSignupHandler(sqlDB, utils.GetCurrentWeekKey))

		admin := api.Group("/admin")
		{
			admin.GET("/check", handlers.AdminCheckHandler(sqlDB))
			admin.GET("/override", handlers.AdminOverrideStatusHandler(sqlDB))
			admin.POST("/reset", handlers.AdminResetHandler(sqlDB, utils.GetCurrentWeekKey))
			admin.POST("/open", handlers.AdminOpenSignupsHandler(sqlDB))
			admin.POST("/close", handlers.AdminCloseSignupsHandler(sqlDB))
			admin.DELETE("/override", handlers.AdminClearOverrideHandler(sqlDB))
		}
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
