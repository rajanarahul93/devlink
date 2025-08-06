package handlers

import (
    "net/http"
    "strconv"

    "devlink-backend/internal/services"
    "devlink-backend/internal/models"
    "github.com/gin-gonic/gin"
)

type ResourceHandler struct {
    resourceService *services.ResourceService
}

type ResourceResponse struct {
    ID          uint   `json:"id"`
    Title       string `json:"title"`
    URL         string `json:"url"`
    Description string `json:"description"`
    Category    string `json:"category"`
    Tags        string `json:"tags"`
    IsPublic    bool   `json:"is_public"`
    ClickCount  int    `json:"click_count"`
    UserID      uint   `json:"user_id"`
    CreatedAt   string `json:"created_at"`
    UpdatedAt   string `json:"updated_at"`
}

type PaginatedResponse struct {
    Resources []ResourceResponse `json:"resources"`
    Total     int64              `json:"total"`
    Page      int                `json:"page"`
    Limit     int                `json:"limit"`
    Pages     int                `json:"pages"`
}

func NewResourceHandler(resourceService *services.ResourceService) *ResourceHandler {
    return &ResourceHandler{
        resourceService: resourceService,
    }
}

func (h *ResourceHandler) CreateResource(c *gin.Context) {
    userID, exists := c.Get("user_id")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
        return
    }

    var req services.CreateResourceRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    resource, err := h.resourceService.CreateResource(userID.(uint), req)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    response := h.toResourceResponse(*resource)
    c.JSON(http.StatusCreated, response)
}

func (h *ResourceHandler) GetResource(c *gin.Context) {
    userID, exists := c.Get("user_id")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
        return
    }

    resourceID, err := strconv.ParseUint(c.Param("id"), 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid resource ID"})
        return
    }

    resource, err := h.resourceService.GetResourceByID(uint(resourceID), userID.(uint))
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Resource not found"})
        return
    }

    response := h.toResourceResponse(*resource)
    c.JSON(http.StatusOK, response)
}

func (h *ResourceHandler) GetUserResources(c *gin.Context) {
    userID, exists := c.Get("user_id")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
        return
    }

    var filters services.ResourceFilters
    if err := c.ShouldBindQuery(&filters); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    resources, total, err := h.resourceService.GetUserResources(userID.(uint), filters)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    response := h.toPaginatedResponse(resources, total, filters.Page, filters.Limit)
    c.JSON(http.StatusOK, response)
}

func (h *ResourceHandler) UpdateResource(c *gin.Context) {
    userID, exists := c.Get("user_id")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
        return
    }

    resourceID, err := strconv.ParseUint(c.Param("id"), 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid resource ID"})
        return
    }

    var req services.UpdateResourceRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    resource, err := h.resourceService.UpdateResource(uint(resourceID), userID.(uint), req)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        return
    }

    response := h.toResourceResponse(*resource)
    c.JSON(http.StatusOK, response)
}

func (h *ResourceHandler) DeleteResource(c *gin.Context) {
    userID, exists := c.Get("user_id")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
        return
    }

    resourceID, err := strconv.ParseUint(c.Param("id"), 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid resource ID"})
        return
    }

    if err := h.resourceService.DeleteResource(uint(resourceID), userID.(uint)); err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Resource deleted successfully"})
}

func (h *ResourceHandler) ClickResource(c *gin.Context) {
    resourceID, err := strconv.ParseUint(c.Param("id"), 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid resource ID"})
        return
    }

    if err := h.resourceService.IncrementClickCount(uint(resourceID)); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to track click"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Click tracked"})
}

func (h *ResourceHandler) GetPublicResources(c *gin.Context) {
    var filters services.ResourceFilters
    if err := c.ShouldBindQuery(&filters); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    resources, total, err := h.resourceService.GetPublicResources(filters)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    response := h.toPaginatedResponse(resources, total, filters.Page, filters.Limit)
    c.JSON(http.StatusOK, response)
}

// Helper methods
func (h *ResourceHandler) toResourceResponse(resource models.Resource) ResourceResponse {
    return ResourceResponse{
        ID:          resource.ID,
        Title:       resource.Title,
        URL:         resource.URL,
        Description: resource.Description,
        Category:    resource.Category,
        Tags:        resource.Tags,
        IsPublic:    resource.IsPublic,
        ClickCount:  resource.ClickCount,
        UserID:      resource.UserID,
        CreatedAt:   resource.CreatedAt.Format("2006-01-02T15:04:05Z"),
        UpdatedAt:   resource.UpdatedAt.Format("2006-01-02T15:04:05Z"),
    }
}

func (h *ResourceHandler) toPaginatedResponse(resources []models.Resource, total int64, page, limit int) PaginatedResponse {
    var resourceResponses []ResourceResponse
    for _, resource := range resources {
        resourceResponses = append(resourceResponses, h.toResourceResponse(resource))
    }

    pages := int((total + int64(limit) - 1) / int64(limit)) // Ceiling division

    return PaginatedResponse{
        Resources: resourceResponses,
        Total:     total,
        Page:      page,
        Limit:     limit,
        Pages:     pages,
    }
}