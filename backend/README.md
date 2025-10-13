# Core Operations Hub Backend

Spring Boot backend service with Oracle Database integration for the Core Operations Hub application.

## Tech Stack
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- Oracle Database XE 21c
- Flyway (Database Migrations)
- JWT Authentication
- Swagger/OpenAPI Documentation
- Spring Boot Actuator

## Prerequisites
- Java 17 or higher
- Maven 3.6+
- Docker & Docker Compose (for Oracle DB)
- Oracle Database XE 21c (or use Docker)

## Setup Instructions

### 1. Start Oracle Database
```bash
docker-compose up oracle -d
# Wait for Oracle to be healthy (check logs)
docker-compose logs -f oracle
```

### 2. Configure Application
Copy `application.properties` and set environment variables if needed:
```bash
export SPRING_DATASOURCE_URL=jdbc:oracle:thin:@localhost:1521:XE
export SPRING_DATASOURCE_USERNAME=coreops
export SPRING_DATASOURCE_PASSWORD=coreops123
export JWT_SECRET=your-secret-key-here
```

### 3. Run Flyway Migrations
Migrations run automatically on application startup. To run manually:
```bash
mvn flyway:migrate
```

### 4. Build and Run Application
```bash
# Build
mvn clean install

# Run
mvn spring-boot:run

# Or run JAR
java -jar target/hub-1.0.0.jar
```

### 5. Access Application
- API Base URL: http://localhost:8080/api
- Swagger UI: http://localhost:8080/swagger-ui.html
- Actuator Health: http://localhost:8080/actuator/health

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login and get JWT token

### Templates
- `GET /api/templates` - Get all templates
- `GET /api/templates/{id}` - Get template by ID
- `POST /api/templates` - Create new template (DESIGNER role)
- `PUT /api/templates/{id}` - Update template (DESIGNER role)
- `POST /api/templates/{id}/publish` - Publish template (DESIGNER role)
- `DELETE /api/templates/{id}` - Delete template (DESIGNER role)
- `POST /api/templates/import` - Import template (DESIGNER role)
- `GET /api/templates/{id}/export` - Export template

### Test Runs
- `GET /api/test-runs` - Get all test runs
- `GET /api/test-runs/{id}` - Get test run by ID
- `POST /api/test-runs` - Create new test run
- `PUT /api/test-runs/{id}` - Update test run

## Default Users
| Username | Password | Role |
|----------|----------|------|
| designer1 | password123 | DESIGNER |
| viewer1 | password123 | VIEWER |
| admin | password123 | ADMIN |

## Database Schema
- **users** - User accounts with BCrypt password hashing
- **templates** - Workflow templates with versioning
- **stages** - Template stages (phases)
- **stage_steps** - Individual steps within stages
- **test_runs** - Workflow execution instances
- **test_run_stages** - Runtime stage state

## Development

### Run Tests
```bash
mvn test
```

### Check Code Coverage
```bash
mvn jacoco:report
```

### Build Docker Image
```bash
docker build -t coreops-backend:latest .
```

## Troubleshooting

### Oracle Connection Issues
- Check Oracle container is running: `docker ps | grep oracle`
- Check Oracle logs: `docker logs coreops-oracle`
- Test connection: `sqlplus coreops/coreops123@localhost:1521/XE`

### Flyway Migration Errors
- Check migration files in `src/main/resources/db/migration`
- Clean and rebuild: `mvn clean install -Dflyway.cleanDisabled=false`
- Repair Flyway: `mvn flyway:repair`

## License
Proprietary - Core Operations Team
