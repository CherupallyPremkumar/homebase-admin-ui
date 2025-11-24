# Admin Dashboard - API Integration Guide

## Overview

This admin dashboard is configured to work with both **mock data** (for testing) and a **real Spring Boot backend**.

## Switching Between Mock and Real API

### Using Mock Data (Default)

By default, the dashboard uses mock data for testing. No backend setup is required.

### Connecting to Spring Boot Backend

1. Create a `.env` file in the project root:

```env
# Set to 'false' to use real API
VITE_USE_MOCK_DATA=false

# Your Spring Boot backend URL
VITE_API_URL=http://localhost:8080/api
```

2. Ensure your Spring Boot backend is running and accessible

3. The dashboard will automatically switch to using real API calls

## Multi-Tenant Support

All API calls include the `X-Tenant-ID` header for multi-brand support. The tenant ID is retrieved from `localStorage`:

```typescript
localStorage.setItem('tenantId', 'your-tenant-id');
```

## Authentication

API calls include an `Authorization` header with a Bearer token from `localStorage`:

```typescript
localStorage.setItem('authToken', 'your-jwt-token');
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/status` - Update order status

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Tags
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create new tag
- `DELETE /api/tags/:id` - Delete tag

### Customers
- `GET /api/customers` - Get all customers

### Profile
- `GET /api/profile` - Get admin profile
- `PUT /api/profile` - Update admin profile
- `POST /api/profile/avatar` - Upload profile avatar (multipart/form-data)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Request/Response Format

All requests (except file uploads) use JSON format with `Content-Type: application/json`.

### Example Product Request

```json
POST /api/products
{
  "name": "Handwoven Basket",
  "description": "Beautiful handwoven basket",
  "price": 45.99,
  "stock": 15,
  "imageUrl": "https://example.com/image.jpg",
  "category": "Storage",
  "tags": ["handmade", "natural"],
  "featured": true,
  "rating": 4.5
}
```

### Example Response

```json
{
  "id": "1",
  "name": "Handwoven Basket",
  "description": "Beautiful handwoven basket",
  "price": 45.99,
  "stock": 15,
  "imageUrl": "https://example.com/image.jpg",
  "category": "Storage",
  "tags": ["handmade", "natural"],
  "featured": true,
  "rating": 4.5,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

## Error Handling

The API service automatically handles errors and displays user-friendly notifications:

- **Success notifications**: Auto-dismiss after 4 seconds
- **Error notifications**: Auto-dismiss after 5 seconds
- **Loading states**: Shown during API calls

## Notifications System

The dashboard uses a centralized notification service (`src/services/notification.ts`):

```typescript
import { notification } from '@/services/notification';

// Success notification
notification.success('Product added', 'The product has been added successfully');

// Error notification
notification.error('Failed to save', 'Please try again later');

// Info notification
notification.info('Processing', 'Your request is being processed');

// Warning notification
notification.warning('Low stock', 'Some products are running low');

// Loading notification
const loadingId = notification.loading('Uploading...');
// ... later
notification.dismiss(loadingId);
```

## TypeScript Types

All DTOs and types are defined in:
- `src/types/index.ts` - Main entities (Product, Order, Category, etc.)
- `src/types/profile.ts` - Profile-related types

## Mock Data

Mock data is stored in `src/services/api.ts` and is mutable to simulate real CRUD operations. When using mock mode:

- Changes persist during the session
- Data resets on page refresh
- API delays are simulated (300ms)

## Development Tips

1. **Testing with Mock Data**: Leave `VITE_USE_MOCK_DATA` unset or set to `true`
2. **Backend Integration**: Set `VITE_USE_MOCK_DATA=false` in `.env`
3. **CORS**: Ensure your Spring Boot backend has CORS configured for frontend origin
4. **Image Uploads**: The profile avatar upload uses `FormData` for multipart requests

## File Structure

```
src/
├── services/
│   ├── api.ts              # Main API service with mock/real switching
│   └── notification.ts     # Centralized notification service
├── types/
│   ├── index.ts           # Main entity types
│   └── profile.ts         # Profile types
└── pages/
    ├── Dashboard.tsx
    ├── Products.tsx
    ├── Orders.tsx
    ├── Categories.tsx
    ├── Customers.tsx
    ├── Profile.tsx
    └── Settings.tsx
```
