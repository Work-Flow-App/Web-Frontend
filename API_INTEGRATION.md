# API Integration Guide

## Environment Setup

The frontend connects to the backend API using environment variables.

### Environment Files

- `.env` - Main environment file (gitignored)
- `.env.development` - Development environment
- `.env.production` - Production environment
- `.env.example` - Template for other developers

### Environment Variables

```env
VITE_API_BASE_URL=https://api.dev.workfloow.app
VITE_API_TIMEOUT=30000
```

## Usage

### Import API Services

```typescript
import { authService, UserRole } from './services/api';
```

### Authentication

#### Sign Up

```typescript
const response = await authService.signup({
  username: 'johndoe',
  email: 'john@example.com',
  password: 'password123',
  role: UserRole.WORKER, // or UserRole.COMPANY
});

// Access tokens stored automatically
console.log(response.data.accessToken);
console.log(response.data.refreshToken);
```

#### Login

```typescript
const response = await authService.login({
  email: 'john@example.com',
  password: 'password123',
});
```

#### Logout

```typescript
await authService.logout();
```

#### Check Authentication

```typescript
const isAuth = authService.isAuthenticated();
```

### API Client

For custom API calls:

```typescript
import { apiClient } from './services/api';

// GET request
const response = await apiClient.get('/api/v1/users');

// POST request
const response = await apiClient.post('/api/v1/jobs', {
  title: 'New Job',
  description: 'Job description',
});

// PUT request
const response = await apiClient.put('/api/v1/jobs/123', {
  title: 'Updated Job',
});

// DELETE request
const response = await apiClient.delete('/api/v1/jobs/123');
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/signup` - Sign up new user
- `POST /api/v1/auth/login` - Login existing user
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/refresh` - Refresh access token

**Note:** User role is extracted from the JWT token payload, not from a separate endpoint.

## User Roles

The backend uses two different role formats:

### Signup/Registration (without prefix)
- `COMPANY` - For companies posting jobs
- `WORKER` - For workers finding jobs

### JWT Token (with ROLE_ prefix)
- `ROLE_COMPANY` - Company role in JWT token
- `ROLE_WORKER` - Worker role in JWT token

**Note:** When signing up, use `"COMPANY"` or `"WORKER"`. The JWT token will contain `"ROLE_COMPANY"` or `"ROLE_WORKER"`.

## Token Management

Tokens are automatically stored in localStorage:
- `auth_token` - Access token (sent in Authorization header)
- `refresh_token` - Refresh token

## Error Handling

The API client throws errors with the following structure:

```typescript
interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
```

Handle errors in try-catch blocks:

```typescript
try {
  await authService.signup(data);
} catch (error) {
  if (error && typeof error === 'object' && 'message' in error) {
    console.error((error as { message: string }).message);
  }
}
```

## Signup Form

The signup form includes:
- Username field
- Email field
- Password field
- Confirm Password field
- Role selection (Company or Worker) via radio buttons

All fields are validated with react-hook-form.
