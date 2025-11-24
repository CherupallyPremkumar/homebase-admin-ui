# Authentication System Documentation

## Overview

Comprehensive admin authentication system with login, 2FA, password reset, session management, and role-based access control.

## Features Implemented

### ✅ Core Authentication
- **Login Page**: Email/password with validation
- **Password Visibility Toggle**: Eye icon to show/hide password
- **Remember Me**: Secure token storage (localStorage vs sessionStorage)
- **Error Handling**: Invalid credentials, empty fields, account lockout
- **Mock Backend**: Ready for Spring Boot integration

### ✅ Two-Factor Authentication (2FA)
- Optional OTP verification after login
- 6-digit code input
- Test code: `123456`
- Session-based flow

### ✅ Password Reset Flow
- Forgot password link
- Email-based reset request
- Mock email sending (logs token to console)
- Success confirmation page

### ✅ Session Management
- **Auto-Logout**: After 30 minutes of inactivity
- **Session Warning**: 5 minutes before expiry (TODO: add modal)
- **Activity Tracking**: Mouse, keyboard, scroll, touch events
- **Session Verification**: Backend session validation

### ✅ Security Features
- **Login Throttling**: Max 5 attempts
- **Account Lockout**: 15 minutes after failed attempts
- **Login Activity Logging**: Timestamp, IP, device info
- **Secure Storage**: Token management (localStorage/sessionStorage)

### ✅ Role-Based Access Control
- **Super Admin**: Full access to all features
- **Editor**: Can manage products and categories
- **Viewer**: Read-only access
- **Protected Routes**: Automatic role verification
- **Role-Based Redirects**: Different dashboards per role

### ✅ Design
- Consistent with dashboard theme (terracotta, sage, cream)
- Fully responsive and mobile-friendly
- Smooth transitions and animations
- Accessible form controls

## Test Credentials

### Super Admin (Full Access)
- **Email**: `admin@homedecor.com`
- **Password**: `admin123`
- **Role**: `super_admin`
- **2FA**: Disabled

### Editor (Products & Categories)
- **Email**: `editor@homedecor.com`
- **Password**: `editor123`
- **Role**: `editor`
- **2FA**: **Enabled** (use code: `123456`)

### Viewer (Read-Only)
- **Email**: `viewer@homedecor.com`
- **Password**: `viewer123`
- **Role**: `viewer`
- **2FA**: Disabled

## Usage

### Login Flow

1. Navigate to `/login`
2. Enter email and password
3. Optionally check "Remember me"
4. Click "Sign In"
5. If 2FA is enabled, enter verification code
6. Redirected to appropriate dashboard based on role

### Logout

Click the profile dropdown (top-right) → Logout

### Password Reset

1. Click "Forgot password?" on login page
2. Enter email address
3. Check console for reset token (in production, email would be sent)
4. Follow reset link

## API Integration

### Switching to Real Backend

Update `src/services/auth.ts`:

```typescript
const USE_MOCK = false; // Change to false
const API_BASE_URL = 'https://your-backend.com/api';
```

### API Endpoints

The system expects these endpoints:

```typescript
POST /api/admin/login
Request: { email, password, rememberMe? }
Response: { user, token, requiresTwoFactor?, sessionId? }

POST /api/admin/verify-2fa
Request: { code, sessionId }
Response: { success }

GET /api/admin/me
Headers: { Authorization: 'Bearer {token}' }
Response: { id, email, name, role, avatarUrl }

POST /api/admin/logout
Headers: { Authorization: 'Bearer {token}' }

POST /api/admin/password-reset
Request: { email }
Response: { message }

POST /api/admin/verify-session
Request: { sessionId }
Response: { valid: boolean }
```

## Protected Routes

Wrap routes with `<ProtectedRoute>`:

```typescript
// Anyone authenticated
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Specific role
<ProtectedRoute requiredRole="super_admin">
  <Settings />
</ProtectedRoute>

// Multiple roles
<ProtectedRoute requiredRole={['super_admin', 'editor']}>
  <Products />
</ProtectedRoute>
```

## Session Management

### Auto-Logout Configuration

Edit `src/contexts/AuthContext.tsx`:

```typescript
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_BEFORE_TIMEOUT = 5 * 60 * 1000; // 5 min warning
```

### Login Attempt Limits

Edit `src/services/auth.ts`:

```typescript
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
```

## Login Activity

View login history:

```typescript
import { authApi } from '@/services/auth';

const activities = authApi.getLoginActivities();
// Returns: [{ timestamp, ipAddress, deviceInfo, success, failureReason? }]
```

## Security Best Practices

### ⚠️ Important Notes

1. **Never store passwords in plain text** - Mock data uses plain text for demo only
2. **Use HTTPS in production** - All auth must be over secure connection
3. **Implement CSRF protection** - Add CSRF tokens to forms
4. **Rate limiting** - Backend should enforce rate limits
5. **Strong passwords** - Implement password strength requirements
6. **Audit logs** - Track all authentication events

### Recommended Additions

- [ ] **reCAPTCHA Integration** - Prevent bot attacks
- [ ] **Session Expiry Modal** - Warn users before auto-logout
- [ ] **Password Strength Meter** - Visual feedback for passwords
- [ ] **Email Verification** - Verify email addresses on signup
- [ ] **Multi-Device Session Management** - View/revoke active sessions
- [ ] **IP Whitelisting** - Restrict admin access to specific IPs

## File Structure

```
src/
├── types/
│   └── auth.ts                 # Auth type definitions
├── services/
│   └── auth.ts                 # Auth API service (mock + real)
├── contexts/
│   └── AuthContext.tsx         # Auth state management
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx  # Route protection
│   └── header/
│       └── ProfileDropdown.tsx # Profile + logout
└── pages/
    ├── Login.tsx               # Login + 2FA page
    └── ForgotPassword.tsx      # Password reset flow
```

## TODO: Backend Integration

1. Replace mock authentication in `src/services/auth.ts`
2. Implement real JWT token validation
3. Set up secure session storage (httpOnly cookies recommended)
4. Add email service for password resets
5. Implement proper 2FA with TOTP (Google Authenticator, Authy)
6. Add refresh token mechanism
7. Implement proper IP detection and geolocation
8. Add comprehensive audit logging
9. Set up rate limiting on backend
10. Implement CAPTCHA for suspicious activity

## Support

For backend integration or security questions, refer to:
- `API_INTEGRATION.md` - Backend API documentation
- Spring Security documentation for JWT implementation
- OWASP Authentication Cheat Sheet
