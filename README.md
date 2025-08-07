# DevLink - Developer Resource Manager



A full-stack web application for developers to save, organize, and share programming resources


## Overview

DevLink is your personal developer's knowledge base - a sleek, modern platform where you can save, categorize, and share useful programming resources like documentation, GitHub repos, tutorials, tools, and code snippets. Think of it as **Notion meets Pocket**, specifically designed for developers.


- **Dark-first Design** - Professional dark theme with light mode toggle
- **Secure Authentication** - JWT-based user management
- **Smart Organization** - Tags, categories, and powerful search
- **Responsive Design** - Works perfectly on all devices
- **Lightning Fast** - Built with modern tech stack
- **Cloud Ready** - One-click deployment to free platforms

##  Tech Stack

### Frontend
- **React** with Vite for lightning-fast development
- **TailwindCSS** for utility-first styling
- **shadcn/ui** for beautiful, accessible components
- **React Router** for client-side navigation
- **Axios** for API communication

### Backend
- **Go (Golang)** with Gin framework
- **PostgreSQL** database with GORM ORM
- **JWT Authentication** for secure user sessions
- **RESTful API** design with proper error handling
- **Docker** containerization for easy deployment

### DevOps & Deployment
- **Docker & Docker Compose** for containerization
- **Nginx** for production frontend serving
- **GitHub Actions** ready for CI/CD

##  Features

###  Resource Management
- **Save Any Link** - Documentation, repos, tutorials, tools
- **Rich Metadata** - Title, description, category, custom tags
- **Click Tracking** - Analytics for your most-used resources
- **Public/Private** - Share resources or keep them personal

###  Advanced Search & Filtering
- **Full-text Search** - Find resources by title, description, or URL
- **Category Filtering** - Documentation, Tutorial, Tool, Library, etc.
- **Tag-based Organization** - Create your own tagging system
- **Smart Pagination** - Handle large resource collections

###  User Experience
- **Secure Authentication** - Register/login with email
- **Personal Dashboard** - Overview of your resource collection
- **Responsive Design** - Seamless experience on any device
- **Dark/Light Theme** - Choose your preferred interface



###  Analytics & Insights
- **Usage Statistics** - Track clicks and popular resources
- **Collection Overview** - Total resources, public shares, etc.
- **Recent Activity** - Quick access to recently added resources

## Glance

<img width="1918" height="969" alt="Screenshot 2025-08-07 101945" src="https://github.com/user-attachments/assets/3f440232-5bc6-4c4e-87a4-69feb4ed3dae" />

<img width="1919" height="971" alt="Screenshot 2025-08-07 001829" src="https://github.com/user-attachments/assets/88e1ce35-0b14-4c9a-bc9c-736c356e8d4c" />

<img width="1919" height="972" alt="Screenshot 2025-08-07 001801" src="https://github.com/user-attachments/assets/5f81105e-741d-4c3d-8030-81c64cf44f9f" />






##  Quick Start

### Prerequisites
- **Node.js** 19+ and npm
- **Go** 1.24+
- **PostgreSQL** 17+
- **Docker** (optional, for containerized setup)

### 1. Clone the Repository
```bash
git clone https://github.com/rajanarahul93/devlink.git
cd devlink
```

### 2. Backend Setup
```bash
cd devlink-backend

# Install dependencies
go mod download

# Set up environment
cp .env.example .env
# Edit .env with your database credentials

# Run the server
go run cmd/server/main.go
```

### 3. Frontend Setup
```bash
cd devlink-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Database Setup
```bash
# Create PostgreSQL database
createdb devlink

# The application will auto-migrate tables on first run
```

### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080

##  Docker Deployment

### Development with Docker Compose
```bash
# Start all services (database, backend, frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Deployment
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

##  API Documentation

### Authentication Endpoints
```
POST /api/v1/auth/register    # User registration
POST /api/v1/auth/login       # User login
GET  /api/v1/profile          # Get user profile
```

### Resource Management
```
GET    /api/v1/resources           # Get user resources (with filters)
POST   /api/v1/resources           # Create new resource
GET    /api/v1/resources/:id       # Get specific resource
PUT    /api/v1/resources/:id       # Update resource
DELETE /api/v1/resources/:id       # Delete resource
POST   /api/v1/resources/:id/click # Track resource click
```

### Public Resources
```
GET /api/v1/resources/public       # Get public resources
```

### Query Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `search` - Search term
- `category` - Filter by category
- `tags` - Filter by tags
- `is_public` - Filter by visibility

### Categories
Default categories include: Documentation, Tutorial, Tool, Library, Framework, Blog, Video, Course, Repository, Article, Reference, Other.


##  Testing

### Backend Tests
```bash
cd devlink-backend
go test ./...
```

### Frontend Tests
```bash
cd devlink-frontend
npm test
```

##  Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

##  Security

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcrypt
- **SQL Injection Protection** via GORM
- **CORS Configuration** for cross-origin requests
- **Input Validation** on all endpoints

##  Performance

- **Lazy Loading** for large resource lists
- **Database Indexing** on frequently queried fields
- **Image Optimization** with modern formats
- **Caching Headers** for static assets
- **Gzip Compression** enabled


⭐ **Star this repo if you find it helpful!** ⭐
