package services

import (
    "errors"

    "devlink-backend/internal/models"
    "gorm.io/gorm"
)

type ResourceService struct {
    db *gorm.DB
}

type CreateResourceRequest struct {
    Title       string `json:"title" binding:"required"`
    URL         string `json:"url" binding:"required,url"`
    Description string `json:"description"`
    Category    string `json:"category"`
    Tags        string `json:"tags"`
    IsPublic    bool   `json:"is_public"`
}

type UpdateResourceRequest struct {
    Title       *string `json:"title,omitempty"`
    URL         *string `json:"url,omitempty"`
    Description *string `json:"description,omitempty"`
    Category    *string `json:"category,omitempty"`
    Tags        *string `json:"tags,omitempty"`
    IsPublic    *bool   `json:"is_public,omitempty"`
}

type ResourceFilters struct {
    Category string `form:"category"`
    Tags     string `form:"tags"`
    Search   string `form:"search"`
    IsPublic *bool  `form:"is_public"`
    Page     int    `form:"page,default=1"`
    Limit    int    `form:"limit,default=20"`
}

func NewResourceService(db *gorm.DB) *ResourceService {
    return &ResourceService{db: db}
}

func (s *ResourceService) CreateResource(userID uint, req CreateResourceRequest) (*models.Resource, error) {
    resource := models.Resource{
        Title:       req.Title,
        URL:         req.URL,
        Description: req.Description,
        Category:    req.Category,
        Tags:        req.Tags,
        IsPublic:    req.IsPublic,
        UserID:      userID,
    }

    if err := s.db.Create(&resource).Error; err != nil {
        return nil, err
    }

    return &resource, nil
}

func (s *ResourceService) GetResourceByID(resourceID, userID uint) (*models.Resource, error) {
    var resource models.Resource
    query := s.db.Where("id = ?", resourceID)
    
    // Users can only access their own resources or public ones
    query = query.Where("user_id = ? OR is_public = ?", userID, true)
    
    if err := query.First(&resource).Error; err != nil {
        return nil, err
    }

    return &resource, nil
}

func (s *ResourceService) GetUserResources(userID uint, filters ResourceFilters) ([]models.Resource, int64, error) {
    var resources []models.Resource
    var total int64

    query := s.db.Model(&models.Resource{}).Where("user_id = ?", userID)

    // Apply filters
    if filters.Category != "" {
        query = query.Where("category ILIKE ?", "%"+filters.Category+"%")
    }

    if filters.Tags != "" {
        query = query.Where("tags ILIKE ?", "%"+filters.Tags+"%")
    }

    if filters.Search != "" {
        searchTerm := "%" + filters.Search + "%"
        query = query.Where("title ILIKE ? OR description ILIKE ? OR url ILIKE ?", 
            searchTerm, searchTerm, searchTerm)
    }

    if filters.IsPublic != nil {
        query = query.Where("is_public = ?", *filters.IsPublic)
    }

    // Count total before pagination
    if err := query.Count(&total).Error; err != nil {
        return nil, 0, err
    }

    // Apply pagination
    offset := (filters.Page - 1) * filters.Limit
    if err := query.Order("created_at DESC").
        Limit(filters.Limit).
        Offset(offset).
        Find(&resources).Error; err != nil {
        return nil, 0, err
    }

    return resources, total, nil
}

func (s *ResourceService) UpdateResource(resourceID, userID uint, req UpdateResourceRequest) (*models.Resource, error) {
    var resource models.Resource
    
    // Check if resource exists and belongs to user
    if err := s.db.Where("id = ? AND user_id = ?", resourceID, userID).First(&resource).Error; err != nil {
        return nil, errors.New("resource not found or access denied")
    }

    // Update only provided fields
    updates := make(map[string]interface{})
    if req.Title != nil {
        updates["title"] = *req.Title
    }
    if req.URL != nil {
        updates["url"] = *req.URL
    }
    if req.Description != nil {
        updates["description"] = *req.Description
    }
    if req.Category != nil {
        updates["category"] = *req.Category
    }
    if req.Tags != nil {
        updates["tags"] = *req.Tags
    }
    if req.IsPublic != nil {
        updates["is_public"] = *req.IsPublic
    }

    if err := s.db.Model(&resource).Updates(updates).Error; err != nil {
        return nil, err
    }

    return &resource, nil
}

func (s *ResourceService) DeleteResource(resourceID, userID uint) error {
    result := s.db.Where("id = ? AND user_id = ?", resourceID, userID).Delete(&models.Resource{})
    
    if result.Error != nil {
        return result.Error
    }
    
    if result.RowsAffected == 0 {
        return errors.New("resource not found or access denied")
    }
    
    return nil
}

func (s *ResourceService) IncrementClickCount(resourceID uint) error {
    return s.db.Model(&models.Resource{}).
        Where("id = ?", resourceID).
        Update("click_count", gorm.Expr("click_count + ?", 1)).Error
}

func (s *ResourceService) GetPublicResources(filters ResourceFilters) ([]models.Resource, int64, error) {
    var resources []models.Resource
    var total int64

    query := s.db.Model(&models.Resource{}).Where("is_public = ?", true).Preload("User")

    // Apply filters (same as above but for public resources)
    if filters.Category != "" {
        query = query.Where("category ILIKE ?", "%"+filters.Category+"%")
    }

    if filters.Tags != "" {
        query = query.Where("tags ILIKE ?", "%"+filters.Tags+"%")
    }

    if filters.Search != "" {
        searchTerm := "%" + filters.Search + "%"
        query = query.Where("title ILIKE ? OR description ILIKE ?", searchTerm, searchTerm)
    }

    // Count total
    if err := query.Count(&total).Error; err != nil {
        return nil, 0, err
    }

    // Apply pagination
    offset := (filters.Page - 1) * filters.Limit
    if err := query.Order("created_at DESC").
        Limit(filters.Limit).
        Offset(offset).
        Find(&resources).Error; err != nil {
        return nil, 0, err
    }

    return resources, total, nil
}