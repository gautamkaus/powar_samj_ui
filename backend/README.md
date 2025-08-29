# Powar Backend - Python FastAPI + Java Architecture

This backend implements a **hybrid microservices architecture** using **Python FastAPI** for large data processing and **Java Spring Boot** for small operations and data formatting.

## 🏗️ Architecture Overview

### **Python FastAPI Backend (Port 5000)**
- **Purpose**: Large data processing and database operations
- **Framework**: FastAPI with Uvicorn ASGI server
- **Responsibilities**:
  - Fetching master data (states, districts, tahsils, professions)
  - Retrieving user profiles with location information
  - Processing large datasets efficiently with pandas/numpy
  - Complex database queries with joins across master tables
  - Analytics data aggregation
  - **Automatic API documentation** (Swagger UI & ReDoc)
  - **Type validation** with Pydantic models
  - **Async/await** support for better performance

### **Java Spring Boot Backend (Port 8080)**
- **Purpose**: Small operations and data formatting
- **Framework**: Spring Boot 3.1.5 with Java 17
- **Responsibilities**:
  - User authentication (login/register/logout)
  - Blog post creation/editing
  - Small CRUD operations
  - Data formatting for frontend consumption
  - API gateway functionality
  - JWT token management
  - Rate limiting and security

## 🔄 Data Flow Architecture

```
┌─────────────┐    ┌─────────────────┐    ┌─────────────────────┐    ┌─────────────┐
│  Frontend   │───▶│  Java Backend   │───▶│ Python FastAPI      │───▶│  Database   │
│             │    │ (Port 8080)     │    │ (Port 5000)         │    │             │
└─────────────┘    └─────────────────┘    └─────────────────────┘    └─────────────┘
         ▲                   │                       │                       │
         │                   ▼                       ▼                       │
         └─────────── Formatted Data ←────── Raw Data ←──────────────────────┘
```

### **Request Flow**
1. **Frontend** makes requests to Java backend
2. **Java backend** handles authentication and small operations directly
3. **For large data**: Java backend calls Python FastAPI endpoints
4. **Python FastAPI backend** processes and returns raw data
5. **Java backend** formats data and sends to frontend

## 📁 Project Structure

```
backend/
├── python/                          # Python FastAPI Backend
│   ├── app.py                      # Main FastAPI application
│   ├── requirements.txt            # Python dependencies
│   └── venv/                      # Virtual environment (auto-created)
├── java/                           # Java Spring Boot Backend
│   ├── src/main/java/com/powar/
│   │   ├── PowarJavaBackendApplication.java  # Main Spring Boot app
│   │   ├── controller/             # REST controllers
│   │   │   ├── AuthController.java # Authentication endpoints
│   │   │   └── DataController.java # Data formatting endpoints
│   │   ├── service/                # Business logic
│   │   │   ├── AuthService.java    # Authentication interface
│   │   │   ├── impl/               # Service implementations
│   │   │   └── PythonApiClient.java # Python API communication
│   │   ├── dto/                    # Data Transfer Objects
│   │   └── config/                 # Configuration classes
│   ├── src/main/resources/
│   │   └── application.yml         # Spring Boot configuration
│   └── pom.xml                     # Maven dependencies
├── start-python.bat                # Windows script to start Python FastAPI
├── start-java.bat                  # Windows script to start Java
├── env.example                     # Environment variables template
└── README.md                       # This file
```

## 🚀 Getting Started

### **Prerequisites**
- **Python 3.8+** with pip
- **Java 17+** (OpenJDK or Oracle JDK)
- **Maven 3.6+**
- **MySQL 8.0+** database
- **Windows** (for batch scripts)

### **1. Environment Setup**
```bash
# Copy environment template
cp env.example .env

# Edit .env with your database credentials
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=powar_db
DB_PORT=3306

# Python API URL for Java backend
PYTHON_API_URL=http://localhost:5000

# JWT configuration
JWT_SECRET=your-super-secret-jwt-key
```

### **2. Start Python FastAPI Backend**
```bash
# Windows (Recommended)
start-python.bat

# Manual Setup
cd python
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 5000 --reload
```

**🎯 API Documentation**: After starting, visit:
- **Swagger UI**: http://localhost:5000/docs
- **ReDoc**: http://localhost:5000/redoc

### **3. Start Java Spring Boot Backend**
```bash
# Windows (Recommended)
start-java.bat

# Manual Setup
cd java
mvn clean compile
mvn spring-boot:run
```

**🎯 Java Backend**: http://localhost:8080

## 🌐 API Endpoints

### **Python FastAPI Backend (Port 5000)**

#### **Health & Monitoring**
- `GET /api/python/health` - Health check endpoint

#### **Master Data Management**
- `GET /api/python/master/states` - Fetch all states
- `GET /api/python/master/districts/{state_id}` - Fetch districts by state
- `GET /api/python/master/tahsils/{district_id}` - Fetch tahsils by district
- `GET /api/python/master/professions` - Fetch all professions
- `GET /api/python/master/location-hierarchy` - Complete location hierarchy

#### **User Management**
- `GET /api/python/users` - Fetch all users with profile information
- `GET /api/python/users/{user_id}` - Fetch specific user details
- `GET /api/python/users/by-location/{state_id}` - Fetch users by state

#### **Analytics**
- `GET /api/python/analytics` - Fetch dashboard analytics data

**📚 Interactive Documentation**: Visit `/docs` for Swagger UI or `/redoc` for ReDoc

### **Java Spring Boot Backend (Port 8080)**

#### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/validate` - Validate JWT token

#### **Data Endpoints (Formatted)**
- `GET /api/data/members` - Formatted members data from Python API
- `GET /api/data/blogs` - Formatted blogs data from Python API
- `GET /api/data/communities` - Formatted communities data from Python API
- `GET /api/data/analytics` - Formatted analytics data from Python API

#### **Health & Monitoring**
- `GET /actuator/health` - Spring Boot health check
- `GET /api/data/health/python` - Python API health through Java

## 🔐 Authentication & Security

### **JWT Token Flow**
1. **Login/Register**: Frontend → Java Backend
2. **Token Generation**: Java Backend creates JWT + Refresh Token
3. **Data Requests**: Frontend includes JWT in Authorization header
4. **Token Validation**: Java Backend validates JWT before processing
5. **Large Data**: Java Backend calls Python FastAPI (no auth needed)
6. **Response**: Java Backend formats data and returns to frontend

### **Security Features**
- **JWT-based authentication** with refresh tokens
- **Password hashing** with BCrypt
- **CORS configuration** for cross-origin requests
- **Input validation** with Spring Validation
- **Rate limiting** and security headers

## 💾 Database Schema

The system uses the following MySQL tables:

### **Master Data Tables**
```sql
-- Location hierarchy
master_state (id, state_name)
master_dist (id, master_state_id, dist_name)
master_tahsil (id, master_dist_id, tahsil_name)

-- Professional information
master_profession (id, employee_type)
-- employee_type: 'PRIVATE', 'GOVERNMENT', 'SELF_EMPLOYED', 'BUSINESS'
```

### **User Management Tables**
```sql
-- Core user table
Users (id, email_id, mobile_no, password_hash, role, created_at, updated_at)
-- role: 'ADMIN', 'USER', 'MODERATOR'

-- User profile information
user_profile (
    id, user_id, first_name, middle_name, last_name, dob, profile_url, 
    gender, state_id, district_id, tahsil_id, address_line, about, 
    profession_id, business_description, created_at, updated_at
)
-- gender: 'MALE', 'FEMALE', 'OTHER'
```

### **Table Relationships**
- `Users` ←→ `user_profile` (1:1 relationship)
- `master_state` ←→ `master_dist` (1:many relationship)
- `master_dist` ←→ `master_tahsil` (1:many relationship)
- `user_profile` ←→ `master_state` (many:1 relationship)
- `user_profile` ←→ `master_dist` (many:1 relationship)
- `user_profile` ←→ `master_tahsil` (many:1 relationship)
- `user_profile` ←→ `master_profession` (many:1 relationship)

## 🔧 Configuration

### **Python FastAPI Configuration**
- **Database connection** via environment variables
- **CORS enabled** for all origins
- **Logging configured** for debugging
- **Automatic request/response validation**
- **OpenAPI schema generation**
- **Async support** for better performance
- **Pydantic models** for data validation

### **Java Spring Boot Configuration**
- **Spring Boot 3.1.5** with Java 17
- **JWT secret** and expiration configurable
- **CORS enabled** for all origins
- **Actuator endpoints** for monitoring
- **Database connection** with Hibernate JPA
- **Security configuration** with Spring Security

## 📊 Performance Benefits

### **Python FastAPI Backend**
- **Fast performance** with async/await support
- **Efficient data processing** with pandas and numpy
- **Optimized database queries** with complex joins across master tables
- **Memory-efficient** handling of large datasets
- **Fast bulk operations** for analytics
- **Automatic API documentation** generation
- **Type safety** with Pydantic models
- **Uvicorn ASGI server** for high performance

### **Java Spring Boot Backend**
- **Fast response times** for small operations
- **Efficient JWT handling** and validation
- **Robust error handling** and logging
- **Type safety** and compile-time checks
- **Connection pooling** for database operations
- **Caching capabilities** with Spring Cache

## 🚨 Error Handling

### **Python FastAPI Backend**
- **Structured error responses** with proper HTTP status codes
- **Pydantic validation** for request/response data
- **Global exception handler** for consistent error formatting
- **Detailed logging** for debugging

### **Java Backend**
- **Catches Python API errors** and formats them consistently
- **Spring Boot error handling** with proper HTTP status codes
- **Validation errors** with detailed messages
- **Comprehensive logging** with SLF4J

### **Frontend Experience**
- **Consistent error format** from Java backend
- **Proper HTTP status codes** for error handling
- **User-friendly error messages**

## 🔍 Monitoring & Documentation

### **Python FastAPI Backend**
- **Built-in logging** and health endpoint
- **Interactive API documentation** (Swagger UI & ReDoc)
- **OpenAPI schema** generation
- **Request/response validation**
- **Performance metrics** with Uvicorn

### **Java Spring Boot Backend**
- **Spring Boot Actuator** endpoints
- **Health checks** for both Java and Python backends
- **Metrics and monitoring** capabilities
- **Logging with SLF4J**

### **Health Check Endpoints**
- **Python**: `/api/python/health`
- **Java**: `/actuator/health`
- **Python through Java**: `/api/data/health/python`

## 🚀 Deployment

### **Development Environment**
- Use provided batch scripts for easy startup
- Hot reload enabled for both backends
- Debug logging enabled
- **FastAPI auto-reload** with uvicorn
- **Spring Boot dev tools** for Java

### **Production Environment**
- **Gunicorn with Uvicorn workers** for Python FastAPI backend
- **JAR file deployment** for Java backend
- **Environment variables** for configuration
- **Reverse proxy** (nginx) setup
- **HTTPS** configuration
- **Database connection pooling**
- **Load balancing** capabilities

## 🧪 Testing

### **Python FastAPI Backend**
```bash
cd python
python -m pytest tests/
# Or run specific tests
pytest tests/test_master_data.py -v
```

### **Java Spring Boot Backend**
```bash
cd java
mvn test
# Or run specific tests
mvn test -Dtest=AuthControllerTest
```

### **Integration Testing**
- Test both backends together
- Verify data flow from Python to Java
- Check error handling scenarios
- Test master data relationships

## 📝 Development Notes

### **Demo Users**
- Java backend includes demo users for testing:
  - Username: `admin`, Password: `admin123`
  - Username: `user1`, Password: `user123`
  - Username: `user2`, Password: `user123`

### **Current Implementation**
- **In-Memory Storage**: Current implementation uses in-memory storage (not production-ready)
- **Database**: Ensure MySQL is running and accessible with the provided schema
- **Ports**: Default ports are 5000 (Python FastAPI) and 8080 (Java)

### **API Documentation**
- **FastAPI automatically generates** interactive docs at `/docs` and `/redoc`
- **Swagger UI** for testing APIs directly
- **ReDoc** for beautiful documentation

### **Master Data Features**
- **Hierarchical location data** (State → District → Tahsil)
- **Professional categorization** (Private, Government, Self-employed, Business)
- **User profile management** with location and professional details
- **Analytics** based on user demographics and location

## 🤝 Contributing

### **Development Guidelines**
1. Follow the existing code structure and patterns
2. Add proper error handling and logging
3. Update this README for any architectural changes
4. Test both backends before submitting changes
5. **Use Pydantic models** for request/response validation in Python
6. **Follow Spring Boot conventions** in Java code
7. **Add unit tests** for new functionality
8. **Maintain master data relationships** when adding new features

### **Code Quality**
- **Type hints** in Python code
- **Proper exception handling**
- **Comprehensive logging**
- **Input validation**
- **Error responses** with appropriate HTTP status codes
- **Database query optimization** for master data joins

## 📞 Support & Troubleshooting

### **Common Issues**
1. **Check the logs** in both backends
2. **Verify database connectivity** and credentials
3. **Ensure all prerequisites** are installed
4. **Check environment variable** configuration
5. **Verify ports** are not in use by other services
6. **Check database schema** matches the expected structure

### **Debugging Steps**
1. **Start Python backend first** - it provides data to Java
2. **Check Python API health** at `/api/python/health`
3. **Verify Java backend** can reach Python API
4. **Test endpoints** using FastAPI docs at `/docs`
5. **Check database** connection and schema
6. **Verify master data** tables have data

### **Getting Help**
- **Use FastAPI docs** at `/docs` for API testing and exploration
- **Check Spring Boot logs** for Java backend issues
- **Verify environment variables** in `.env` file
- **Test database connection** independently
- **Check master data relationships** in database

---

## 🎯 **Quick Start Summary**

1. **Setup Environment**: Copy `env.example` to `.env` and configure
2. **Setup Database**: Ensure MySQL is running with the provided schema
3. **Start Python**: Run `start-python.bat` or use uvicorn manually
4. **Start Java**: Run `start-java.bat` or use Maven
5. **Test APIs**: Visit `http://localhost:5000/docs` for FastAPI docs
6. **Verify Health**: Check both backends are running and healthy

**🚀 Your hybrid FastAPI + Java backend with master data support is now ready for development!**
