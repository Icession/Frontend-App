# RideWatch Backend - Spring Boot

## Overview
Spring Boot backend with JWT authentication, admin dashboard API, and PostgreSQL database.

## Requirements
- Java 17+
- Maven 3.8+
- PostgreSQL 12+

## Setup

### 1. Database Setup
```bash
# Create database
createdb ridewatch

# Or using PostgreSQL client
psql -U postgres
CREATE DATABASE ridewatch;
```

### 2. Update Database Credentials
Edit `src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/ridewatch
    username: your_postgres_user
    password: your_postgres_password
```

### 3. Build & Run
```bash
# Build
mvn clean install

# Run
mvn spring-boot:run
```

Server runs on `http://localhost:8080`

## API Endpoints

### Admin Dashboard
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/users` - All users
- `GET /api/admin/users/{id}` - User details
- `PUT /api/admin/users/{id}/status` - Update user status

### FAQ Management
- `GET /api/admin/faqs` - All FAQs
- `GET /api/admin/faqs/{id}` - FAQ details
- `POST /api/admin/faqs` - Create FAQ
- `PUT /api/admin/faqs/{id}` - Update FAQ
- `DELETE /api/admin/faqs/{id}` - Delete FAQ
- `GET /api/admin/faqs/category/{category}` - FAQs by category

## Environment Variables
```
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRATION_MS=86400000
POSTGRES_URL=jdbc:postgresql://localhost:5432/ridewatch
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
```

## Project Structure
```
backend/
├── src/main/java/com/ridewatch/
│   ├── controller/          # REST endpoints
│   ├── service/             # Business logic
│   ├── model/               # JPA entities
│   ├── repository/          # Data access
│   ├── dto/                 # Data transfer objects
│   └── RidewatchBackendApplication.java
├── src/main/resources/
│   ├── application.yml      # Configuration
└── pom.xml
```
