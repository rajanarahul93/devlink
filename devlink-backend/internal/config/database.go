package config

import (
    "fmt"
    "log"

    "devlink-backend/internal/models"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
)

func ConnectDatabase(config *Config) *gorm.DB {
    dsn := fmt.Sprintf(
        "host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
        config.DBHost, config.DBUser, config.DBPassword, config.DBName, config.DBPort,
    )

    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }

    // Auto-migrate models
    err = db.AutoMigrate(&models.User{}, &models.Resource{})
    if err != nil {
        log.Fatal("Failed to migrate database:", err)
    }

    log.Println("Database connected and migrated successfully")
    return db
}