package services

import (
    "errors"
    "time"

    "devlink-backend/internal/models"
    "github.com/golang-jwt/jwt/v5"
    "golang.org/x/crypto/bcrypt"
    "gorm.io/gorm"
)

type AuthService struct {
    db        *gorm.DB
    jwtSecret string
}

type Claims struct {
    UserID uint   `json:"user_id"`
    Email  string `json:"email"`
    jwt.RegisteredClaims
}

func NewAuthService(db *gorm.DB, jwtSecret string) *AuthService {
    return &AuthService{
        db:        db,
        jwtSecret: jwtSecret,
    }
}

func (s *AuthService) Register(name, email, password string) (*models.User, error) {
    // Check if user already exists
    var existingUser models.User
    if err := s.db.Where("email = ?", email).First(&existingUser).Error; err == nil {
        return nil, errors.New("user with this email already exists")
    }

    // Hash password
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    if err != nil {
        return nil, err
    }

    // Create user
    user := models.User{
        Name:     name,
        Email:    email,
        Password: string(hashedPassword),
    }

    if err := s.db.Create(&user).Error; err != nil {
        return nil, err
    }

    return &user, nil
}

func (s *AuthService) Login(email, password string) (*models.User, string, error) {
    var user models.User
    if err := s.db.Where("email = ?", email).First(&user).Error; err != nil {
        return nil, "", errors.New("invalid credentials")
    }

    // Check password
    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
        return nil, "", errors.New("invalid credentials")
    }

    // Generate JWT token
    token, err := s.generateToken(user.ID, user.Email)
    if err != nil {
        return nil, "", err
    }

    return &user, token, nil
}

func (s *AuthService) generateToken(userID uint, email string) (string, error) {
    claims := Claims{
        UserID: userID,
        Email:  email,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
            IssuedAt:  jwt.NewNumericDate(time.Now()),
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString([]byte(s.jwtSecret))
}

func (s *AuthService) ValidateToken(tokenString string) (*Claims, error) {
    token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
        return []byte(s.jwtSecret), nil
    })

    if err != nil {
        return nil, err
    }

    claims, ok := token.Claims.(*Claims)
    if !ok || !token.Valid {
        return nil, errors.New("invalid token")
    }

    return claims, nil
}