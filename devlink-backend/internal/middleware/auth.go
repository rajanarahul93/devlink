package middleware

import (
    "net/http"
    "strings"

    "devlink-backend/internal/services"
    "github.com/gin-gonic/gin"
)

func JWTAuth(authService *services.AuthService) gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
            c.Abort()
            return
        }

        // Check if header starts with "Bearer "
        if !strings.HasPrefix(authHeader, "Bearer ") {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header format"})
            c.Abort()
            return
        }

        // Extract token
        token := strings.TrimPrefix(authHeader, "Bearer ")
        
        // Validate token
        claims, err := authService.ValidateToken(token)
        if err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
            c.Abort()
            return
        }

        // Add user info to context
        c.Set("user_id", claims.UserID)
        c.Set("user_email", claims.Email)
        
        c.Next()
    }
}