# API Updates Summary

## Overview
Đã cập nhật các API call trong AdminDashboard.jsx và api.js để phù hợp với Postman collection thực tế.

## Changes Made

### 1. Authentication Endpoints
- **Login**: Changed from JSON to `application/x-www-form-urlencoded`
- **Profile Update**: Changed from JSON to `application/x-www-form-urlencoded`
- **Change Password**: Changed from JSON to `application/x-www-form-urlencoded`

### 2. User Management
- **Get Users**: Updated endpoint to `/v1/api/users/?` with proper query parameters
- **Toggle User Status**: Changed endpoint to `/v1/api/users/:userId/status`
- **Create User**: Updated to use proper role-specific fields
- **Update User**: Fixed to handle role-specific data correctly
- **Delete User**: Updated to use role-specific endpoints

### 3. Class Management
- **Get Classes**: Added `summary=true` parameter for list view
- **Create Class**: Fixed date format and field mapping
- **Update Class**: Added support for teacher and student assignment
- **Delete Class**: Updated endpoint structure

### 4. Data Mapping Fixes (Latest Update)
- **User Data Display**: Fixed mapping of API response to UI structure
  - Map `_id` to `id` for consistency
  - Handle nested `userId` objects for name, email, phone
  - Map role-specific fields (parentId, classId, childId, etc.)
  - Set proper status based on `isActive` field

- **Edit User Function**: Removed dependency on non-existent `getUserById` endpoint
  - Use summary data directly for editing
  - Properly map form fields from user summary
  - Handle role-specific data mapping

- **Form Data Loading**: Fixed dropdown data mapping
  - Parents, Students, and Classes dropdowns now properly mapped
  - Handle nested object structures from API

- **Class Data Display**: Fixed class information mapping
  - Map teacher information from nested objects
  - Handle student list and counts properly
  - Map schedule and fee information

### 5. File Uploads
- **Payment Proofs**: Support FormData uploads
- **Advertisements**: Support image uploads with FormData

### 6. New Endpoints Added
- **Advertisements**: Full CRUD operations
- **Notifications**: Full CRUD operations
- **Available Teachers**: Get teachers available for class assignment
- **Available Students**: Get students available for class enrollment

## API Response Format Changes
- Changed from `{success, data}` to `{msg, data, pagination}`
- Updated error handling to use `msg` instead of `message`
- Added proper pagination support

## Frontend Compatibility
- Updated all API calls to handle new response format
- Fixed data mapping for nested objects
- Improved error handling and user feedback
- Added loading states for better UX

## Known Issues Fixed
1. ✅ User data not displaying in table - Fixed with proper data mapping
2. ✅ Edit user showing "API endpoint not found" - Fixed by removing getUserById dependency
3. ✅ Form dropdowns not loading - Fixed with proper data mapping
4. ✅ Class information not displaying - Fixed with proper mapping

## Testing Recommendations
1. Test user creation with different roles
2. Test user editing functionality
3. Test class creation and assignment
4. Test pagination and filtering
5. Test file uploads for payments and ads

## Key Fixes in AdminDashboard.jsx

### 1. User Creation/Update
```javascript
// Fixed role-specific fields
case 'Student':
  dataForAPI.parentId = formData.parentId || null;
  dataForAPI.classId = formData.classIds.length > 0 ? formData.classIds[0] : null;
  break;
case 'Parent':
  dataForAPI.childId = formData.studentIds;
  dataForAPI.canSeeTeacher = formData.canViewTeacher;
  break;
case 'Teacher':
  dataForAPI.classId = formData.classIds.length > 0 ? formData.classIds[0] : null;
  dataForAPI.wagePerLesson = 100000; // Default wage
  break;
```

### 2. Class Assignment
```javascript
// Fixed teacher assignment
const response = await apiService.updateClass(user.token, classId, {
  teacherId: teacherId
});

// Fixed student enrollment
const response = await apiService.updateClass(user.token, classId, {
  studentList: studentId
});
```

### 3. Data Loading
```javascript
// Fixed pagination parameters
const response = await apiService.getClasses(user.token, 1, 100, filters);

// Fixed form data loading
const [parentsRes, studentsRes, classesRes] = await Promise.all([
  apiService.getUsers(user.token, 1, 1000, { role: 'Parent' }),
  apiService.getUsers(user.token, 1, 1000, { role: 'Student' }),
  apiService.getClasses(user.token, 1, 1000, {})
]);
```

## Response Format Handling

### Before (Expected)
```javascript
{
  success: true,
  data: [...],
  pagination: {...}
}
```

### After (Actual Backend)
```javascript
{
  msg: "Success message",
  data: [...],
  pagination: {...}
}
```

## Content-Type Changes

### Form Data Endpoints
- Login, Profile Update, Change Password
- User Status Toggle
- Attendance Creation
- Payment Processing
- Wage Calculations

### JSON Endpoints
- User Creation/Update
- Class Creation/Update
- Teacher/Parent/Student Management
- Notifications

### FormData Endpoints
- Payment Requests (with file upload)
- Advertisement Creation/Update (with image upload)

## Notes

- All endpoints now match the Postman collection exactly
- Form data is properly encoded for endpoints that require it
- File uploads use FormData as required by the backend
- Error handling has been improved to show backend error messages
- Token validation has been enhanced with proper JWT parsing 