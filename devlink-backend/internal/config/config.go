package config

import (
    "log"
    "os"

    "github.com/joho/godotenv"
)

type Config struct {
    Port        string
    DBHost      string
    DBPort      string
    DBUser      string
    DBPassword  string
    DBName      string
    JWTSecret   string
    GinMode     string
}

func LoadConfig() *Config {
    // Load .env file
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found")
    }

    return &Config{
        Port:        getEnv("PORT", "8080"),
        DBHost:      getEnv("DB_HOST", "localhost"),
        DBPort:      getEnv("DB_PORT", "5432"),
        DBUser:      getEnv("DB_USER", "postgres"),
        DBPassword:  getEnv("DB_PASSWORD", ""),
        DBName:      getEnv("DB_NAME", "devlink"),
        JWTSecret:   getEnv("JWT_SECRET", "fallback-secret"),
        GinMode:     getEnv("GIN_MODE", "debug"),
    }
}

func getEnv(key, defaultValue string) string {
    if value := os.Getenv(key); value != "" {
        return value
    }
    return defaultValue
}