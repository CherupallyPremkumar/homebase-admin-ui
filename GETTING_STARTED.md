# 🚀 Getting Started - Homebase Admin Suite

Complete guide to run the full-stack application (React Frontend + Spring Boot Backend)

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 16+ and npm ([Download](https://nodejs.org/))
- **Java** 17+ ([Download](https://www.oracle.com/java/technologies/downloads/))
- **Maven** 3.6+ ([Download](https://maven.apache.org/download.cgi))

Verify installations:
```bash
node --version   # Should show v16+
npm --version    # Should show 8+
java --version   # Should show 17+
mvn --version    # Should show 3.6+
```

## ⚡ Quick Start (Both Frontend & Backend)

### Option 1: Run Both Services

**Terminal 1 - Backend:**
```bash
cd backend
./start.sh
```

**Terminal 2 - Frontend:**
```bash
# From the root directory
npm run dev
```

### Option 2: Step-by-Step

#### 1️⃣ Start Backend First

```bash
cd backend
mvn spring-boot:run
```

Wait for: `Started HomebaseAdminApplication in X seconds`

Backend runs at: `http://localhost:8080`

#### 2️⃣ Configure Frontend

Create `.env` file in the **root directory** (not in backend/):

```env
# Use real backend instead of mock data
VITE_USE_MOCK_DATA=false

# Point to Spring Boot backend
VITE_API_URL=http://localhost:8080/api
```

#### 3️⃣ Start Frontend

```bash
# From the root directory (where package.json is)
npm install  # First time only
npm run dev
```

Frontend runs at: `http://localhost:5173`

## 🔐 Login & Test

1. **Open browser:** `http://localhost:5173/login`

2. **Login with test credentials:**

   | Role | Email | Password | Access |
   |------|-------|----------|--------|
   | Super Admin | `admin@homedecor.com` | `admin123` | Full access |
   | Editor | `editor@homedecor.com` | `editor123` | Products/Categories |
   | Viewer | `viewer@homedecor.com` | `viewer123` | Read-only |

3. **Test features:**
   - ✅ View dashboard statistics
   - ✅ Browse products, orders, categories
   - ✅ Create/edit products (as Admin or Editor)
   - ✅ Update order status
   - ✅ Manage categories and tags
   - ✅ View customers

## 🏗️ Project Structure

```
homebase-admin-suite/
├── backend/                      # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/homebase/admin/
│   │       ├── controller/       # REST API endpoints
│   │       ├── service/          # Business logic
│   │       ├── repository/       # Database access
│   │       ├── entity/           # JPA entities
│   │       ├── dto/              # Data Transfer Objects
│   │       ├── security/         # JWT & Security config
│   │       └── config/           # App configuration
│   ├── src/main/resources/
│   │   └── application.yml       # Backend settings
│   ├── pom.xml                   # Maven dependencies
│   ├── README.md                 # Backend documentation
│   └── start.sh                  # Quick start script
│
├── src/                          # React Frontend
│   ├── components/               # React components
│   ├── pages/                    # Page components
│   ├── services/                 # API services
│   ├── types/                    # TypeScript types
│   └── contexts/                 # React contexts
│
├── .env                          # Frontend environment (create this!)
├── BACKEND_INTEGRATION.md        # Integration guide
└── GETTING_STARTED.md           # This file
```

## 🔍 Verify Everything Works

### Check Backend Health

```bash
# Test login endpoint
curl -X POST http://localhost:8080/api/admin/login?tenantId=default \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@homedecor.com",
    "password": "admin123"
  }'
```

You should see a JSON response with `user`, `token`, and `tenantConfig`.

### Check Frontend Connection

1. Open browser DevTools (F12)
2. Go to Network tab
3. Login to the app
4. Verify requests go to `localhost:8080/api/*`
5. Check responses are 200 OK

## 🗄️ Access Database (Development)

The backend uses H2 in-memory database.

**H2 Console:** `http://localhost:8080/h2-console`

**Connection Settings:**
- JDBC URL: `jdbc:h2:mem:homebase_admin`
- Username: `sa`
- Password: _(leave empty)_

**Example Queries:**
```sql
-- View all admin users
SELECT * FROM admin_users;

-- View products for default tenant
SELECT * FROM products WHERE tenant_id = 'default';

-- View all orders
SELECT * FROM orders;
```

## 🌐 Multi-Tenant Testing

The system supports multiple tenants with isolated data.

### Test Different Tenants

**Default Tenant:**
- URL: `http://localhost:5173/login`
- Tenant ID: `default`

**Tenant 1:**
- URL: `http://localhost:5173/tenant1/admin/login`
- Tenant ID: `tenant1`
- Theme: Custom colors (red/green)

**Tenant 2:**
- URL: `http://localhost:5173/tenant2/admin/login`
- Tenant ID: `tenant2`
- Theme: Custom colors (blue/purple)

Each tenant has separate:
- Users
- Products
- Orders
- Categories
- Customers

## 🛠️ Common Issues & Solutions

### Issue: "Port 8080 already in use"

**Solution 1:** Stop the process using port 8080
```bash
# Mac/Linux
lsof -ti:8080 | xargs kill -9

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Solution 2:** Change backend port in `backend/src/main/resources/application.yml`:
```yaml
server:
  port: 8081
```

Then update frontend `.env`:
```env
VITE_API_URL=http://localhost:8081/api
```

### Issue: "CORS policy error"

**Symptom:** Browser console shows CORS error

**Solution:** Add your frontend URL to backend CORS config in `application.yml`:
```yaml
cors:
  allowed-origins: http://localhost:5173,http://localhost:3000
```

### Issue: "401 Unauthorized"

**Causes:**
1. JWT token expired (24 hour default)
2. Wrong credentials
3. Backend not running

**Solutions:**
- Logout and login again
- Check credentials match test accounts
- Verify backend is running at `localhost:8080`

### Issue: Frontend still using mock data

**Symptoms:**
- Changes don't persist after refresh
- Backend logs show no API calls

**Solution:** Verify `.env` file exists in **root directory** with:
```env
VITE_USE_MOCK_DATA=false
VITE_API_URL=http://localhost:8080/api
```

Then restart frontend:
```bash
# Stop frontend (Ctrl+C)
npm run dev
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Maven build fails

**Common causes:**
1. Wrong Java version
2. Network issues downloading dependencies

**Solutions:**
```bash
# Check Java version (need 17+)
java -version

# Clear Maven cache and rebuild
rm -rf ~/.m2/repository
cd backend
mvn clean install
```

## 📦 Building for Production

### Backend

```bash
cd backend
mvn clean package -DskipTests

# This creates: target/admin-suite-backend-1.0.0.jar

# Run production build
java -jar target/admin-suite-backend-1.0.0.jar
```

### Frontend

```bash
npm run build

# This creates: dist/ folder

# Deploy dist/ to your hosting service
```

## 🔒 Security Notes

### Development
- H2 database (in-memory, data lost on restart)
- Default JWT secret (change in production!)
- CORS allows localhost origins
- Sample data auto-initialized

### Production
- ⚠️ Change JWT secret to strong random value
- ⚠️ Use PostgreSQL or MySQL (not H2)
- ⚠️ Enable HTTPS only
- ⚠️ Update CORS to production domains
- ⚠️ Use environment variables for secrets
- ⚠️ Disable H2 console
- ⚠️ Enable proper logging and monitoring

## 📚 Additional Documentation

- **Backend Details:** `backend/README.md`
- **API Integration:** `BACKEND_INTEGRATION.md`
- **Frontend API Guide:** `API_INTEGRATION.md`
- **Authentication:** `AUTHENTICATION.md`
- **Multi-Tenant Setup:** `MULTI_TENANT_SETUP.md`

## 🎯 Next Steps

1. ✅ Run backend and frontend
2. ✅ Login with test credentials
3. ✅ Explore the dashboard
4. ✅ Try creating/editing products
5. ✅ Test different user roles
6. ✅ Try different tenants
7. 📖 Read API documentation
8. 🔧 Customize for your needs

## 💡 Tips

- **Two terminals:** Keep backend and frontend running in separate terminals
- **Browser DevTools:** Use Network tab to debug API calls
- **Backend logs:** Watch terminal for error messages
- **H2 Console:** Inspect database directly during development
- **Postman/curl:** Test API endpoints independently

## 🆘 Need Help?

1. Check error messages in:
   - Backend terminal
   - Frontend terminal
   - Browser console (F12)

2. Review documentation:
   - This guide
   - `backend/README.md`
   - `BACKEND_INTEGRATION.md`

3. Common solutions:
   - Restart backend
   - Clear browser cache
   - Delete and reinstall node_modules
   - Verify `.env` file exists and is correct

## ✅ System Check

Run this checklist before starting:

- [ ] Java 17+ installed (`java --version`)
- [ ] Maven installed (`mvn --version`)
- [ ] Node.js 16+ installed (`node --version`)
- [ ] Backend dependencies installed (`cd backend && mvn clean install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] `.env` file created with correct settings
- [ ] Port 8080 is available
- [ ] Port 5173 is available

## 🚀 You're Ready!

Start the backend, start the frontend, and enjoy your multi-tenant admin dashboard!

```bash
# Terminal 1
cd backend && ./start.sh

# Terminal 2  
npm run dev

# Browser
open http://localhost:5173/login
```

Happy coding! 🎉
