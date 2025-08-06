package main

import (
    "log"
    "net/http"
    "os"
    "strings"
    "time"

    "devlink-backend/internal/config"
    "devlink-backend/internal/handlers"
    "devlink-backend/internal/middleware"
    "devlink-backend/internal/services"
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
)

func main() {
    // Load configuration
    cfg := config.LoadConfig()
    
    // Connect to database
    db := config.ConnectDatabase(cfg)
    
    // Initialize services
    authService := services.NewAuthService(db, cfg.JWTSecret)
    resourceService := services.NewResourceService(db)
    
    // Initialize handlers
    authHandler := handlers.NewAuthHandler(authService)
    resourceHandler := handlers.NewResourceHandler(resourceService)
    
    // Set Gin mode
    gin.SetMode(cfg.GinMode)
    
    // Initialize router
    router := gin.Default()
    
    // CORS middleware
    router.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:5173"},
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        AllowCredentials: true,
        MaxAge: 12 * time.Hour,
    }))
    
    // Health check
    router.GET("/health", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "status":  "ok",
            "message": "DevLink API is running",
        })
    })
    
    // API routes (these MUST come before static file serving)
    api := router.Group("/api/v1")
    {
        // Public routes
        auth := api.Group("/auth")
        {
            auth.POST("/register", authHandler.Register)
            auth.POST("/login", authHandler.Login)
        }
        
        // Public resources (no auth required)
        api.GET("/resources/public", resourceHandler.GetPublicResources)
        api.POST("/resources/:id/click", resourceHandler.ClickResource)
        
        // Protected routes
        protected := api.Group("/")
        protected.Use(middleware.JWTAuth(authService))
        {
            // User profile
            protected.GET("/profile", authHandler.GetProfile)
            
            // Resource management
            resources := protected.Group("/resources")
            {
                resources.POST("/", resourceHandler.CreateResource)
                resources.GET("/", resourceHandler.GetUserResources)
                resources.GET("/:id", resourceHandler.GetResource)
                resources.PUT("/:id", resourceHandler.UpdateResource)
                resources.DELETE("/:id", resourceHandler.DeleteResource)
            }
        }
    }
    
    // Determine the frontend path based on environment
    var frontendPath string
    if os.Getenv("DOCKER_ENV") == "true" {
        frontendPath = "./frontend/dist"
    } else {
        frontendPath = "../../devlink-frontend/dist"
    }
    
    // Static file serving (MUST come after API routes)
    // Serve static files from the frontend dist directory
// Serve static files from a specific path
router.Static("/static", frontendPath)

// Serve index.html at root and handle client-side routing
router.GET("/", func(c *gin.Context) {
    c.File(frontendPath + "/index.html")
})

// Handle client-side routing for SPA routes
router.NoRoute(func(c *gin.Context) {
    // Only serve index.html for non-API routes
    if !strings.HasPrefix(c.Request.URL.Path, "/api") {
        c.File(frontendPath + "/index.html")
    } else {
        c.JSON(404, gin.H{"error": "API endpoint not found"})
    }
})

    
    log.Printf("Server starting on port %s", cfg.Port)
    log.Fatal(router.Run(":" + cfg.Port))
}