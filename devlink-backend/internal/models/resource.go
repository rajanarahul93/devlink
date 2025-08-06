package models

import (
    "time"
    "gorm.io/gorm"
)

type Resource struct {
    ID          uint           `json:"id" gorm:"primaryKey"`
    Title       string         `json:"title" gorm:"not null"`
    URL         string         `json:"url" gorm:"not null"`
    Description string         `json:"description"`
    Category    string         `json:"category"`
    Tags        string         `json:"tags"` // JSON string for now, can be normalized later
    IsPublic    bool           `json:"is_public" gorm:"default:false"`
    ClickCount  int            `json:"click_count" gorm:"default:0"`
    UserID      uint           `json:"user_id" gorm:"index;not null"`
    CreatedAt   time.Time      `json:"created_at"`
    UpdatedAt   time.Time      `json:"updated_at"`
    DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
    
    // Relationships
    User User `json:"user,omitempty" gorm:"foreignKey:UserID"`
}