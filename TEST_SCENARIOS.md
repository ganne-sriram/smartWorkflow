# Core Operations Hub - Comprehensive Test Scenarios

## Overview
This document provides detailed test scenarios for verifying the Core Operations Hub application after the Oracle/H2 database migration. Use this guide to test the application locally on your machine.

---

## Prerequisites

### Required Software
- Java 17 or higher
- Maven 3.6+
- Node.js 18+ and npm
- Git

### Repository Setup
```bash
cd ~/repos/usecase02
git checkout devin/1760319018-oracle-database-migration
git pull origin devin/1760319018-oracle-database-migration
```

---

## Test Scenario 1: Backend Startup with H2 Database

### Objective
Verify that the backend starts successfully with H2 in-memory database (no Docker/Oracle required).

### Steps
```bash
# Navigate to backend directory
cd ~/repos/usecase02/backend

# Clean and build
mvn clean install

# Start the backend
mvn spring-boot:run
```

### Expected Results
✅ Application starts successfully within 10-15 seconds
✅ Console output shows:
   - "Started CoreOpsHubApplication in X seconds"
   - "Tomcat started on port 8080"
   - "Initializing default users..."
   - "Created user: designer1"
   - "Created user: viewer1"
   - "Created user: admin"
   - "Default users created successfully"

✅ No errors about database connection or schema creation

### Troubleshooting
- If you see "Table 'USERS' already exists" error:
  - Stop the backend (Ctrl+C)
  - Run `mvn clean` to remove target directory
  - Run `mvn spring-boot:run` again

---

## Test Scenario 2: Authentication - Login Endpoint

### Objective
Verify that users can authenticate and receive JWT tokens.

### Prerequisites
- Backend must be running (Test Scenario 1 completed)

### Test Cases

#### Test Case 2.1: Login as Designer
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"designer1","password":"password123"}' \
  -w "\nHTTP Status: %{http_code}\n"
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "username": "designer1",
  "role": "DESIGNER"
}
```
✅ HTTP Status: 200
✅ Token is a valid JWT string
✅ Username matches request
✅ Role is "DESIGNER"

#### Test Case 2.2: Login as Viewer
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"viewer1","password":"password123"}' \
  -w "\nHTTP Status: %{http_code}\n"
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "username": "viewer1",
  "role": "VIEWER"
}
```
✅ HTTP Status: 200
✅ Role is "VIEWER"

#### Test Case 2.3: Login as Admin
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}' \
  -w "\nHTTP Status: %{http_code}\n"
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "username": "admin",
  "role": "ADMIN"
}
```
✅ HTTP Status: 200
✅ Role is "ADMIN"

#### Test Case 2.4: Invalid Credentials
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"designer1","password":"wrongpassword"}' \
  -w "\nHTTP Status: %{http_code}\n"
```

**Expected Response:**
```json
{
  "message": "Invalid credentials"
}
```
✅ HTTP Status: 401
✅ Error message indicates invalid credentials

---

## Test Scenario 3: Template CRUD Operations

### Objective
Verify template creation, retrieval, update, and deletion operations.

### Prerequisites
- Backend must be running
- Login as designer1 to get JWT token:
```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"designer1","password":"password123"}' | jq -r '.token')
echo "JWT Token: $TOKEN"
```

### Test Case 3.1: Get All Templates
```bash
curl -X GET http://localhost:8080/api/templates \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n"
```

**Expected Response:**
```json
[]
```
✅ HTTP Status: 200
✅ Returns empty array (no templates exist yet)

### Test Case 3.2: Create Template
```bash
curl -X POST http://localhost:8080/api/templates \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sample Workflow",
    "objective": "Test workflow creation",
    "stages": [
      {
        "stageNumber": 1,
        "name": "Stage 1",
        "type": "REVIEW",
        "description": "First stage",
        "availableOptions": ["Option A", "Option B"],
        "availableChecklists": ["Check 1", "Check 2"],
        "stageSteps": []
      }
    ]
  }' \
  -w "\nHTTP Status: %{http_code}\n"
```

**Expected Response:**
```json
{
  "id": 1,
  "name": "Sample Workflow",
  "objective": "Test workflow creation",
  "status": "DRAFT",
  "version": 1,
  "createdBy": "designer1",
  "createdAt": "2025-10-13T...",
  "stages": [...]
}
```
✅ HTTP Status: 200
✅ Template has ID (Long type, e.g., 1)
✅ Status is "DRAFT"
✅ createdBy is "designer1"
✅ Stages array contains the created stage

### Test Case 3.3: Get Template by ID
```bash
curl -X GET http://localhost:8080/api/templates/1 \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n"
```

**Expected Response:**
✅ HTTP Status: 200
✅ Returns the template with ID 1
✅ All fields match the created template

### Test Case 3.4: Update Template
```bash
curl -X PUT http://localhost:8080/api/templates/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Workflow",
    "objective": "Updated objective",
    "stages": [
      {
        "stageNumber": 1,
        "name": "Updated Stage",
        "type": "APPROVAL",
        "description": "Updated description",
        "availableOptions": ["Option C"],
        "availableChecklists": [],
        "stageSteps": []
      }
    ]
  }' \
  -w "\nHTTP Status: %{http_code}\n"
```

**Expected Response:**
✅ HTTP Status: 200
✅ Name is "Updated Workflow"
✅ updatedBy is "designer1"
✅ updatedAt timestamp is present

### Test Case 3.5: Publish Template
```bash
curl -X POST http://localhost:8080/api/templates/1/publish \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n"
```

**Expected Response:**
✅ HTTP Status: 200
✅ Status changes from "DRAFT" to "ACTIVE"

### Test Case 3.6: Delete Template
```bash
curl -X DELETE http://localhost:8080/api/templates/1 \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n"
```

**Expected Response:**
✅ HTTP Status: 200 or 204
✅ Template is deleted
✅ GET /api/templates/1 returns 404

---

## Test Scenario 4: Test Run Operations

### Objective
Verify test run creation, execution, and status updates.

### Prerequisites
- Backend must be running
- At least one published template exists (Test Scenario 3 completed)
- Login to get JWT token

### Test Case 4.1: Create Test Run
```bash
curl -X POST http://localhost:8080/api/test-runs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": 1,
    "templateName": "Sample Workflow",
    "stages": [
      {
        "name": "Stage 1",
        "availableOptions": ["Option A", "Option B"],
        "availableChecklists": ["Check 1"],
        "selectedOptions": [],
        "selectedChecklists": [],
        "status": "PENDING"
      }
    ]
  }' \
  -w "\nHTTP Status: %{http_code}\n"
```

**Expected Response:**
```json
{
  "id": 1,
  "templateId": 1,
  "templateName": "Sample Workflow",
  "currentStageIndex": 0,
  "status": "RUNNING",
  "startedAt": "2025-10-13T...",
  "userId": 1,
  "stages": [...]
}
```
✅ HTTP Status: 200
✅ Test run has ID (Long type)
✅ Status is "RUNNING"
✅ startedAt timestamp is present
✅ userId matches logged-in user

### Test Case 4.2: Get Test Run by ID
```bash
curl -X GET http://localhost:8080/api/test-runs/1 \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n"
```

**Expected Response:**
✅ HTTP Status: 200
✅ Returns the test run with ID 1

### Test Case 4.3: Update Test Run (Complete Stage)
```bash
curl -X PUT http://localhost:8080/api/test-runs/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentStageIndex": 1,
    "stages": [
      {
        "name": "Stage 1",
        "availableOptions": ["Option A", "Option B"],
        "availableChecklists": ["Check 1"],
        "selectedOptions": ["Option A"],
        "selectedChecklists": ["Check 1"],
        "status": "COMPLETED"
      }
    ]
  }' \
  -w "\nHTTP Status: %{http_code}\n"
```

**Expected Response:**
✅ HTTP Status: 200
✅ currentStageIndex updated to 1
✅ Stage status is "COMPLETED"

### Test Case 4.4: Submit Test Run
```bash
curl -X PUT http://localhost:8080/api/test-runs/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentStageIndex": 1,
    "submittedAt": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'",
    "stages": [...]
  }' \
  -w "\nHTTP Status: %{http_code}\n"
```

**Expected Response:**
✅ HTTP Status: 200
✅ Status changes to "COMPLETED"
✅ submittedAt timestamp is present

---

## Test Scenario 5: Role-Based Access Control

### Objective
Verify that VIEWER role cannot create/update/delete templates.

### Test Case 5.1: Viewer Cannot Create Template
```bash
# Login as viewer
VIEWER_TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"viewer1","password":"password123"}' | jq -r '.token')

# Try to create template
curl -X POST http://localhost:8080/api/templates \
  -H "Authorization: Bearer $VIEWER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "objective": "Test",
    "stages": []
  }' \
  -w "\nHTTP Status: %{http_code}\n"
```

**Expected Response:**
✅ HTTP Status: 403 (Forbidden)
✅ Error message indicates insufficient permissions

### Test Case 5.2: Viewer Can Read Templates
```bash
curl -X GET http://localhost:8080/api/templates \
  -H "Authorization: Bearer $VIEWER_TOKEN" \
  -w "\nHTTP Status: %{http_code}\n"
```

**Expected Response:**
✅ HTTP Status: 200
✅ Returns list of templates (read access allowed)

---

## Test Scenario 6: Health Checks and Monitoring

### Objective
Verify health check endpoints and Swagger UI are accessible.

### Test Case 6.1: Health Check
```bash
curl http://localhost:8080/actuator/health
```

**Expected Response:**
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "H2"
      }
    },
    "diskSpace": {
      "status": "UP"
    },
    "ping": {
      "status": "UP"
    }
  }
}
```
✅ status is "UP"
✅ Database component shows "UP"

### Test Case 6.2: Swagger UI
Open in browser: http://localhost:8080/swagger-ui.html

**Expected Result:**
✅ Swagger UI page loads successfully
✅ All API endpoints are listed
✅ Can test endpoints through Swagger UI

### Test Case 6.3: H2 Console (Optional)
Open in browser: http://localhost:8080/h2-console

**Connection Settings:**
- JDBC URL: `jdbc:h2:mem:coreops`
- User Name: `sa`
- Password: (leave empty)

**Expected Result:**
✅ H2 console loads
✅ Can connect to database
✅ Can view tables: USERS, TEMPLATES, STAGES, etc.

---

## Test Scenario 7: Frontend Integration

### Objective
Verify that the Angular frontend can communicate with the backend.

### Prerequisites
- Backend must be running on port 8080
- Frontend dependencies installed

### Steps

#### Step 1: Install Frontend Dependencies
```bash
cd ~/repos/usecase02
npm install
```

**Expected Result:**
✅ Dependencies install successfully
✅ No error messages

#### Step 2: Start Frontend
```bash
npm start
```

**Expected Result:**
✅ Angular development server starts
✅ Console shows "** Angular Live Development Server is listening on localhost:4200"
✅ Opens browser at http://localhost:4200

**Troubleshooting:**
- If port 4200 is in use:
  ```bash
  # Find and kill process using port 4200
  lsof -ti:4200 | xargs kill -9
  # Or use a different port
  ng serve --port 4201
  ```

#### Step 3: Test Login Flow
1. Open http://localhost:4200 in browser
2. Navigate to login page
3. Enter credentials:
   - Username: `designer1`
   - Password: `password123`
4. Click "Login"

**Expected Result:**
✅ Login successful
✅ Redirected to dashboard/workflows page
✅ JWT token stored in browser (check localStorage)
✅ No CORS errors in browser console

#### Step 4: Test Template Operations
1. Navigate to Template Library
2. Click "Create Template"
3. Fill in template details
4. Save template

**Expected Result:**
✅ Template created successfully
✅ Template appears in list with Long ID (e.g., 1, 2, 3)
✅ Can view, edit, delete templates
✅ No errors in browser console

#### Step 5: Test Workflow Execution
1. Select a published template
2. Start a test run
3. Complete stages
4. Submit test run

**Expected Result:**
✅ Test run created successfully
✅ Can progress through stages
✅ Can complete and submit test run

---

## Test Scenario 8: Database Persistence

### Objective
Verify that data persists correctly in H2 database during application lifecycle.

### Test Case 8.1: Data Persistence
```bash
# 1. Start backend
cd ~/repos/usecase02/backend
mvn spring-boot:run

# 2. Create a template (in another terminal)
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"designer1","password":"password123"}' | jq -r '.token')

curl -X POST http://localhost:8080/api/templates \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","objective":"Test","stages":[]}' 

# 3. Get all templates - should return the created template
curl -X GET http://localhost:8080/api/templates \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Result:**
✅ Created template is returned with ID
✅ Data persists for the duration of the application run

**Note:** H2 in-memory database does NOT persist data after application restart. If you stop the backend, all data will be lost. This is expected behavior for H2 in-memory mode.

---

## Test Scenario 9: Oracle Database Testing (Optional)

### Objective
Verify that the backend can connect to Oracle Database when configured.

### Prerequisites
- Docker installed
- Oracle configuration uncommented in application.properties

### Steps

#### Step 1: Update Configuration
Edit `backend/src/main/resources/application.properties`:
```properties
# Comment out H2 configuration
# spring.datasource.url=jdbc:h2:mem:coreops
# spring.datasource.driver-class-name=org.h2.Driver
# spring.jpa.database-platform=org.hibernate.dialect.H2Dialect

# Uncomment Oracle configuration
spring.datasource.url=jdbc:oracle:thin:@localhost:1521/XEPDB1
spring.datasource.username=coreops
spring.datasource.password=coreops123
spring.datasource.driver-class-name=oracle.jdbc.OracleDriver
spring.jpa.database-platform=org.hibernate.dialect.OracleDialect

# Change ddl-auto from create-drop to validate (use Flyway)
spring.jpa.hibernate.ddl-auto=validate

# Enable Flyway
spring.flyway.enabled=true
```

#### Step 2: Start Oracle
```bash
cd ~/repos/usecase02
docker-compose up oracle -d

# Wait for Oracle to be ready (30-60 seconds)
docker-compose logs -f oracle
# Look for "DATABASE IS READY TO USE"
```

#### Step 3: Start Backend
```bash
cd ~/repos/usecase02/backend
mvn clean spring-boot:run
```

**Expected Result:**
✅ Backend connects to Oracle successfully
✅ Flyway migrations execute (V1-V7)
✅ Default users created via V7 migration
✅ Login works with Oracle database
✅ All API endpoints work as expected

---

## Known Issues and Workarounds

### Issue 1: Port 4200 Already in Use
**Symptom:** Frontend fails to start with "Port 4200 is already in use"

**Solution:**
```bash
# Kill process using port 4200
lsof -ti:4200 | xargs kill -9

# Or use a different port
ng serve --port 4201
```

**Note:** If using a different port, update CORS configuration in backend.

### Issue 2: H2 vs Oracle Configuration Mismatch
**Symptom:** Flyway migrations fail when using H2 database

**Root Cause:** Flyway migrations use Oracle-specific SQL syntax (e.g., `NUMBER`, `CLOB`, `SYSTIMESTAMP`)

**Solutions:**
- **Option A (Recommended for local dev):** Keep H2 and disable Flyway:
  ```properties
  spring.flyway.enabled=false
  spring.jpa.hibernate.ddl-auto=create-drop
  ```
  
- **Option B (Production):** Use Oracle database:
  - Start Oracle container
  - Uncomment Oracle configuration
  - Enable Flyway
  - Change `ddl-auto` to `validate`

### Issue 3: Maven Build Errors
**Symptom:** Build fails with compilation errors

**Solution:**
```bash
# Clean build artifacts
mvn clean

# Rebuild
mvn clean install

# If still failing, check Java version
java -version  # Should be Java 17
```

### Issue 4: Login Returns 401 After Restart
**Symptom:** Login works initially but fails after backend restart

**Root Cause:** H2 in-memory database loses data on restart

**Solution:** Restart backend - DataInitializer will recreate default users

---

## Success Criteria Summary

### Backend Tests (All Must Pass)
- ✅ Backend starts successfully with H2 database
- ✅ Default users created automatically
- ✅ Login returns 200 with JWT token for all 3 users
- ✅ Template CRUD operations work
- ✅ Test Run operations work
- ✅ Health check returns UP status
- ✅ Swagger UI accessible

### Frontend Tests (Optional - Depends on Port Availability)
- ⚠️ Frontend starts on port 4200
- ⚠️ Login flow works through UI
- ⚠️ Template operations work through UI
- ⚠️ No CORS errors

### Integration Tests
- ✅ Backend and frontend communicate successfully
- ✅ JWT authentication works end-to-end
- ✅ All API endpoints accessible from frontend

---

## Quick Start Commands

### Backend Only
```bash
cd ~/repos/usecase02/backend
mvn clean spring-boot:run
```

### Full Stack (Backend + Frontend)
```bash
# Terminal 1: Backend
cd ~/repos/usecase02/backend
mvn spring-boot:run

# Terminal 2: Frontend
cd ~/repos/usecase02
npm start
```

### Quick Login Test
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"designer1","password":"password123"}'
```

---

## Contact and Support

- **PR Link:** https://github.com/Sai-Kushal-Nerella-WL/usecase02/pull/4
- **Devin Session:** https://app.devin.ai/sessions/1b0734700d184cd2b37e118a4dde2c86
- **Requested by:** @ganne-sriram

For any issues or questions, please comment on the PR.
