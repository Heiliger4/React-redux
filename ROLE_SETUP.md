# Role-Based Access Control Setup Guide

## Overview

This application implements a complete role-based access control system using Clerk authentication with three user roles:

- **Guest**: Read-only access to view songs
- **User**: Can create songs and edit/delete their own songs
- **Admin**: Full access to all songs and user management

## Setup Instructions

### 1. Clerk Configuration

#### Frontend Setup (Already Done)
- ✅ Clerk React SDK installed
- ✅ Environment variables configured
- ✅ ClerkProvider wrapped around app

#### Backend Setup
1. **Install Clerk Backend SDK**:
   ```bash
   cd backend
   npm install @clerk/backend
   ```

2. **Configure Environment Variables**:
   Create `.env` in the backend directory:
   ```env
   CLERK_JWT_KEY=your_clerk_jwt_key_here
   CLERK_ISSUER_URL=https://clerk.accounts.dev
   MONGO_URI=your_mongodb_connection_string
   ```

3. **Get Clerk JWT Key**:
   - Go to your Clerk Dashboard
   - Navigate to JWT Templates
   - Create a new template or use the default
   - Copy the signing key and add it to `CLERK_JWT_KEY`

### 2. User Role Management

#### Setting User Roles in Clerk
1. **Access Clerk Dashboard**
2. **Navigate to Users**
3. **Select a user**
4. **Edit Public Metadata**:
   ```json
   {
     "role": "admin"
   }
   ```
   or
   ```json
   {
     "role": "user"
   }
   ```

#### Default Role
- New users automatically get `role: "user"` if no role is specified
- Only manually set `role: "admin"` for administrators

### 3. Database Schema Updates

The Song model now includes:
```javascript
ownerId: {
  type: String,
  required: true,
  index: true,
}
```

### 4. API Endpoints

#### Public Endpoints (No Auth Required)
- `GET /api/songs` - List all songs
- `GET /api/songs/:id` - Get specific song

#### Protected Endpoints (Auth Required)
- `POST /api/songs` - Create song (User/Admin)
- `PUT /api/songs/:id` - Update song (Owner/Admin)
- `DELETE /api/songs/:id` - Delete song (Owner/Admin)

#### Admin-Only Endpoints
- `GET /api/users` - List users
- `PATCH /api/users/:userId/role` - Update user role
- `DELETE /api/users/:userId` - Delete user

### 5. Frontend Features

#### Role-Based UI
- **Guest**: Welcome screen with sign-in/sign-up
- **User**: Can add songs, edit/delete own songs
- **Admin**: Full access + admin dashboard

#### Admin Dashboard
- User management interface
- Role assignment
- User deletion
- Accessible via "Admin" button in header

### 6. Testing the System

#### Test Scenarios

1. **Guest Access**:
   - Visit without signing in
   - Should see welcome screen
   - Cannot add/edit/delete songs

2. **User Access**:
   - Sign in as regular user
   - Can add new songs
   - Can only edit/delete own songs
   - Cannot access admin features

3. **Admin Access**:
   - Sign in as admin
   - Can add songs
   - Can edit/delete any song
   - Can access admin dashboard
   - Can manage users

#### Testing Steps
1. Create two test users in Clerk
2. Set one as "user" and one as "admin"
3. Test each role's permissions
4. Verify song ownership restrictions

### 7. Security Features

#### Backend Security
- JWT token verification
- Role-based authorization
- Song ownership validation
- Admin-only endpoints

#### Frontend Security
- Role-based UI rendering
- Protected route components
- Authentication state management

### 8. Environment Variables

#### Frontend (.env.local)
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

#### Backend (.env)
```env
CLERK_JWT_KEY=your_clerk_jwt_key_here
CLERK_ISSUER_URL=https://clerk.accounts.dev
MONGO_URI=your_mongodb_connection_string
```

### 9. Running the Application

#### Development
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run dev
```

#### Production
```bash
# Build frontend
cd frontend
npm run build

# Start backend
cd backend
npm start
```

### 10. Troubleshooting

#### Common Issues

1. **Authentication Errors**:
   - Check Clerk JWT key configuration
   - Verify environment variables
   - Ensure token is being sent in requests

2. **Role Not Working**:
   - Verify user metadata in Clerk dashboard
   - Check role assignment in public metadata
   - Clear browser cache and re-authenticate

3. **Permission Denied**:
   - Verify user role matches required permissions
   - Check song ownership for edit/delete operations
   - Ensure admin role is properly set

#### Debug Steps
1. Check browser console for errors
2. Verify API responses
3. Check Clerk dashboard for user configuration
4. Test with different user roles

## Implementation Notes

- The system uses Clerk's public metadata for role storage
- JWT tokens are automatically included in API requests
- Role checks happen both on frontend and backend
- Song ownership is enforced at the database level
- Admin dashboard is currently using mock data (ready for Clerk API integration)

## Next Steps

1. Implement actual Clerk API calls in admin dashboard
2. Add user activity logging
3. Implement role-based audit trails
4. Add bulk operations for admins
5. Enhance security with rate limiting 