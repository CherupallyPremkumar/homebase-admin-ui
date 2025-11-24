# Backend Integration Guide

Complete guide for integrating the Spring Boot backend with your React frontend.

## 🚀 Quick Start

### 1. Start the Backend

```bash
cd backend

# Option A: Using Maven
mvn spring-boot:run

# Option B: Using the start script (Mac/Linux)
chmod +x start.sh
./start.sh

# Option C: Using Java directly (after building)
mvn clean package
java -jar target/admin-suite-backend-1.0.0.jar
```

Backend will start at `http://localhost:8080`

### 2. Configure Frontend

Create or update `.env` in the frontend root:

```env
# Switch to real API
VITE_USE_MOCK_DATA=false

# Backend URL
VITE_API_URL=http://localhost:8080/api
```

### 3. Start Frontend

```bash
# In the root directory (not in backend/)
npm run dev
```

Frontend will start at `http://localhost:5173`

## ✅ Verification

### Test Backend is Running

```bash
# Health check (if you add actuator)
curl http://localhost:8080/actuator/health

# Test login endpoint
curl -X POST http://localhost:8080/api/admin/login?tenantId=default \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@homedecor.com",
    "password": "admin123"
  }'
```

### Test Frontend Connection

1. Open `http://localhost:5173/login`
2. Login with: `admin@homedecor.com` / `admin123`
3. Check browser Network tab - requests should go to `localhost:8080`
4. Verify you can see products, create/edit items

## 🔄 API Mapping

The frontend API calls map to these backend endpoints:

| Frontend Service Call | Backend Endpoint | Method |
|-----------------------|------------------|--------|
| `productsApi.getAll()` | `/api/products` | GET |
| `productsApi.create()` | `/api/products` | POST |
| `productsApi.update(id)` | `/api/products/{id}` | PUT |
| `productsApi.delete(id)` | `/api/products/{id}` | DELETE |
| `ordersApi.getAll()` | `/api/orders` | GET |
| `ordersApi.updateStatus()` | `/api/orders/{id}/status` | PATCH |
| `categoriesApi.getAll()` | `/api/categories` | GET |
| `tagsApi.getAll()` | `/api/tags` | GET |
| `customersApi.getAll()` | `/api/customers` | GET |
| `dashboardApi.getStats()` | `/api/dashboard/stats` | GET |
| `authApi.login()` | `/api/admin/login` | POST |

## 🔐 Authentication Flow

### Login Process

1. **Frontend sends login request:**
```typescript
POST /api/admin/login?tenantId=default
{
  "email": "admin@homedecor.com",
  "password": "admin123",
  "rememberMe": true
}
```

2. **Backend validates and returns JWT:**
```json
{
  "user": {
    "id": "1",
    "email": "admin@homedecor.com",
    "name": "Admin User",
    "role": "super_admin",
    "tenantId": "default"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "requiresTwoFactor": false,
  "tenantConfig": {
    "id": "default",
    "name": "Home Decor Admin"
  }
}
```

3. **Frontend stores token:**
```typescript
localStorage.setItem('authToken', response.token);
localStorage.setItem('tenantId', response.tenantConfig.id);
```

4. **All subsequent requests include token:**
```typescript
headers: {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  'X-Tenant-ID': 'default'
}
```

## 🏢 Multi-Tenant Usage

### Frontend Tenant Detection

The frontend detects tenant from:
1. URL path: `/tenant1/admin/login`
2. Subdomain: `tenant1.yourdomain.com`
3. Default: `default`

### Backend Tenant Handling

The backend receives tenant via:
1. `X-Tenant-ID` header (preferred)
2. JWT token `tenantId` claim
3. Query parameter for login: `?tenantId=tenant1`

### Testing Different Tenants

**Tenant 1:**
```bash
# Login
curl -X POST http://localhost:8080/api/admin/login?tenantId=tenant1 \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@homedecor.com", "password": "admin123"}'

# Get products
curl http://localhost:8080/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-Tenant-ID: tenant1"
```

**Tenant 2:**
```bash
# Same process with tenantId=tenant2
```

## 📊 Data Isolation

Each tenant has completely isolated data:

```sql
-- Products for tenant1
SELECT * FROM products WHERE tenant_id = 'tenant1';

-- Products for tenant2
SELECT * FROM products WHERE tenant_id = 'tenant2';
```

The backend automatically filters all queries by tenant ID.

## 🔧 Troubleshooting

### CORS Errors

**Symptom:** Browser shows CORS policy error

**Solution:** Verify CORS configuration in `backend/src/main/resources/application.yml`:
```yaml
cors:
  allowed-origins: http://localhost:5173,http://localhost:3000
```

### 401 Unauthorized

**Symptom:** All API calls return 401

**Possible Causes:**
1. JWT token expired (24 hour default)
2. Token not included in Authorization header
3. X-Tenant-ID header missing

**Solution:**
- Logout and login again
- Check browser Network tab → Headers
- Verify token format: `Bearer YOUR_TOKEN`

### 403 Forbidden

**Symptom:** API returns 403 for certain operations

**Cause:** Role-based access control

**Solution:** Login with correct role:
- Product/Category create/edit/delete: `SUPER_ADMIN` or `EDITOR`
- Settings/Users: `SUPER_ADMIN` only

### Empty Data

**Symptom:** API returns empty arrays `[]`

**Possible Causes:**
1. Wrong tenant ID
2. Database not initialized
3. Tenant ID mismatch

**Solution:**
- Check X-Tenant-ID header matches login tenant
- Restart backend to reinitialize sample data
- Check backend logs for tenant context

### Connection Refused

**Symptom:** `ERR_CONNECTION_REFUSED`

**Cause:** Backend not running

**Solution:**
```bash
cd backend
mvn spring-boot:run
```

## 🗄️ Database Access

### H2 Console (Development)

1. Open: `http://localhost:8080/h2-console`
2. Settings:
   - JDBC URL: `jdbc:h2:mem:homebase_admin`
   - Username: `sa`
   - Password: _(empty)_
3. Click "Connect"

### View Data

```sql
-- Admin users
SELECT * FROM admin_users;

-- Products by tenant
SELECT * FROM products WHERE tenant_id = 'default';

-- Orders
SELECT * FROM orders;

-- Categories
SELECT * FROM categories;
```

## 🔄 Switching Databases

### To PostgreSQL

1. **Install PostgreSQL**

2. **Create database:**
```sql
CREATE DATABASE homebase_admin;
```

3. **Update `application.yml`:**
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/homebase_admin
    username: your_username
    password: your_password
    driver-class-name: org.postgresql.Driver
  jpa:
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
```

4. **Restart backend** - tables will be created automatically

## 📝 API Examples

### Complete Product CRUD

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:8080/api/admin/login?tenantId=default \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@homedecor.com","password":"admin123"}' \
  | jq -r '.token')

# 2. Get all products
curl http://localhost:8080/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-ID: default"

# 3. Create product
curl -X POST http://localhost:8080/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-ID: default" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "description": "Test product",
    "price": 29.99,
    "stock": 10,
    "category": "Test",
    "tags": ["new"],
    "rating": 4.0,
    "featured": false
  }'

# 4. Update product (replace {id} with actual ID)
curl -X PUT http://localhost:8080/api/products/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-ID: default" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Product",
    "price": 39.99,
    "stock": 15
  }'

# 5. Delete product
curl -X DELETE http://localhost:8080/api/products/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-ID: default"
```

## 🎯 Best Practices

1. **Always include both headers:**
   - `Authorization: Bearer {token}`
   - `X-Tenant-ID: {tenantId}`

2. **Handle token expiration:**
   - Check for 401 responses
   - Redirect to login
   - Refresh token if implemented

3. **Error handling:**
   - Backend returns consistent error format
   - Display user-friendly messages
   - Log errors for debugging

4. **Security:**
   - Never expose JWT secret
   - Use HTTPS in production
   - Implement refresh tokens
   - Add rate limiting

## 📞 Support

If you encounter issues:

1. Check backend logs in terminal
2. Check browser console for errors
3. Verify all environment variables are set
4. Ensure both frontend and backend are running
5. Test API endpoints with curl/Postman first

## 🚀 Production Deployment

### Backend
```bash
# Build production JAR
mvn clean package -DskipTests

# Run with production profile
java -jar target/admin-suite-backend-1.0.0.jar \
  --spring.profiles.active=prod \
  --jwt.secret=$JWT_SECRET \
  --spring.datasource.url=$DATABASE_URL
```

### Frontend
```bash
# Build for production
npm run build

# Deploy dist/ folder to your hosting
```

Remember to update CORS origins and API URLs for production!
