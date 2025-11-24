# Multi-Tenant Admin Dashboard - Setup Guide

## Overview
This admin dashboard now supports multi-tenant architecture, allowing multiple tenants to use the same application with isolated data and custom theming.

## URL Structure

### Tenant-Specific URLs (Recommended)
```
/:tenant/admin/login          - Login page for a specific tenant
/:tenant/admin/dashboard      - Dashboard for a specific tenant
/:tenant/admin/products       - Products page for a specific tenant
/:tenant/admin/orders         - Orders page for a specific tenant
/:tenant/admin/categories     - Categories page for a specific tenant
/:tenant/admin/customers      - Customers page for a specific tenant
/:tenant/admin/profile        - Profile page for a specific tenant
/:tenant/admin/settings       - Settings page for a specific tenant
```

### Legacy URLs (Fallback)
```
/login                        - Default tenant login
/dashboard                    - Default tenant dashboard
/products                     - Default tenant products
```

## Tenant Detection

The system detects tenants in the following priority order:

1. **Subdomain**: `tenant1.myshop.com` → tenant = `tenant1`
2. **URL Path**: `/tenant1/admin/login` → tenant = `tenant1`
3. **Default**: Falls back to `default` tenant

## How It Works

### 1. Login Flow
- User visits `/:tenant/admin/login` or subdomain login
- System detects tenant from URL
- Login API includes tenant ID in request
- On successful login:
  - Tenant ID stored in localStorage
  - Tenant config (theme, logo) applied
  - Redirects to `/:tenant/admin/dashboard`

### 2. Protected Routes
- All admin routes require authentication
- Routes are tenant-aware and include tenant prefix
- Sidebar navigation automatically uses tenant-specific paths
- Logout redirects to tenant-specific login page

### 3. API Calls
- All API calls include `X-Tenant-ID` header
- Tenant ID retrieved from localStorage
- Backend can use this header to filter data by tenant

### 4. Session Management
- Auth token and tenant ID stored separately
- Session timeout redirects to tenant-specific login
- Logout clears both auth token and tenant info

## Mock Tenant Configurations

Located in `src/services/auth.ts`:

```typescript
const MOCK_TENANTS = {
  tenant1: {
    id: 'tenant1',
    name: 'Tenant 1 Store',
    subdomain: 'tenant1',
    logoUrl: '...',
    primaryColor: '340 75% 55%',
    secondaryColor: '142 30% 55%',
  },
  tenant2: {
    id: 'tenant2',
    name: 'Tenant 2 Shop',
    subdomain: 'tenant2',
    logoUrl: '...',
    primaryColor: '220 75% 55%',
    secondaryColor: '280 60% 55%',
  },
  default: {
    id: 'default',
    name: 'Home Decor Admin',
    subdomain: 'default',
  },
};
```

## Dynamic Theming

Tenant-specific themes are automatically applied on login:

```typescript
// Applied via CSS custom properties
root.style.setProperty('--tenant-primary', config.primaryColor);
root.style.setProperty('--tenant-secondary', config.secondaryColor);
```

## Testing Multi-Tenant Setup

### Testing Different Tenants

1. **Tenant 1**:
   - Visit: `/tenant1/admin/login`
   - Login with any test credentials
   - See tenant1-specific theme

2. **Tenant 2**:
   - Visit: `/tenant2/admin/login`
   - Login with any test credentials
   - See tenant2-specific theme

3. **Default Tenant**:
   - Visit: `/login` or `/default/admin/login`
   - Login with any test credentials
   - See default theme

### Test Credentials
```
Super Admin: admin@homedecor.com / admin123
Editor (2FA): editor@homedecor.com / editor123
Viewer: viewer@homedecor.com / viewer123
```

## Backend Integration

### Required API Changes

1. **Login Endpoint**:
```
POST /api/admin/login?tenantId={tenantId}
Body: { email, password, rememberMe }
Response: { user, token, tenantConfig }
```

2. **All Other Endpoints**:
```
Headers: 
  - Authorization: Bearer {token}
  - X-Tenant-ID: {tenantId}
```

3. **Database Schema**:
- Add `tenant_id` column to all tables
- Filter all queries by tenant_id
- Ensure RLS policies include tenant checks

### Example Backend Filter (Spring Boot)
```java
@PreAuthorize("hasAuthority('TENANT_' + #tenantId)")
public List<Product> getProducts(
    @RequestHeader("X-Tenant-ID") String tenantId
) {
    return productRepository.findByTenantId(tenantId);
}
```

## File Structure

### New/Updated Files
- `src/utils/tenant.ts` - Tenant detection and utilities
- `src/hooks/useTenantNavigation.ts` - Tenant-aware navigation hook
- `src/types/auth.ts` - Added TenantConfig type
- `src/contexts/AuthContext.tsx` - Tenant state management
- `src/components/auth/ProtectedRoute.tsx` - Tenant-aware redirects
- `src/components/layout/Sidebar.tsx` - Tenant-aware navigation
- `src/services/auth.ts` - Tenant-aware login API
- `src/services/api.ts` - Added X-Tenant-ID header
- `public/_redirects` - SPA fallback routing

## Navigation Utilities

### useTenantNavigation Hook
```typescript
import { useTenantNavigation } from '@/hooks/useTenantNavigation';

const MyComponent = () => {
  const { navigate, getTenantPath, tenant } = useTenantNavigation();

  // Navigate with tenant awareness
  navigate('products'); // Goes to /:tenant/admin/products
  
  // Get tenant-aware path
  const path = getTenantPath('orders'); // Returns /:tenant/admin/orders
  
  // Current tenant ID
  console.log(tenant); // e.g., 'tenant1'
};
```

## Security Considerations

1. **Client-Side Tenant Isolation**: Tenant ID is stored client-side for routing
2. **Server-Side Validation**: Backend MUST validate tenant access for each request
3. **Token Security**: Tokens should be tenant-specific and validated server-side
4. **RLS Policies**: Implement Row-Level Security for database isolation
5. **API Headers**: Always include and validate `X-Tenant-ID` header

## Troubleshooting

### Issue: 404 After Login
**Solution**: Check that routes are defined with `/:tenant/admin/*` pattern

### Issue: Wrong Tenant Data Shown
**Solution**: Verify `X-Tenant-ID` header is sent with all API calls

### Issue: Sidebar Links Broken
**Solution**: Ensure Sidebar uses tenant-aware paths from useParams()

### Issue: Logout Redirects to Wrong Page
**Solution**: Check AuthContext logout function includes tenant in redirect

### Issue: Page Reload Shows 404
**Solution**: Ensure `public/_redirects` file exists with `/* /index.html 200`

## Future Enhancements

1. **Tenant Registration**: Add self-service tenant signup
2. **Custom Domains**: Support custom domain mapping per tenant
3. **Tenant Admin**: Allow tenants to manage their own settings
4. **Usage Analytics**: Track per-tenant usage and metrics
5. **Billing Integration**: Add tenant-specific billing via Stripe
6. **White Labeling**: Full customization of branding per tenant
