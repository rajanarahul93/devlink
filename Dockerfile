# Stage 1: Build the frontend
FROM node:20 AS frontend-builder

WORKDIR /app/frontend
COPY devlink-frontend/package*.json ./
RUN npm install

COPY devlink-frontend/ ./
RUN npm run build

# Stage 2: Build the Go backend
FROM golang:1.24.3 AS backend-builder

WORKDIR /app

# Copy go mod files first for better caching
COPY devlink-backend/go.mod devlink-backend/go.sum ./
RUN go mod download

# Copy the entire backend source code
COPY devlink-backend/ ./

# Move built frontend to the correct location for your Go app
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Build Go backend (adjust path to match your main.go location)
RUN go build -o server ./cmd/server/main.go

# Final stage: run the app
FROM debian:bullseye-slim

# Install ca-certificates for HTTPS requests
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the built server binary
COPY --from=backend-builder /app/server .

# Copy the frontend dist files to the correct path
# Your Go code expects "../../devlink-frontend/dist" from cmd/server/
# But in Docker, we'll place it at "./frontend/dist"
COPY --from=backend-builder /app/frontend/dist ./frontend/dist



EXPOSE 8080
CMD ["./server"]