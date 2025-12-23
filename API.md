# LeaveOne API Documentation

## Authentication

All API endpoints (except `/api/auth/*`) require authentication via session cookie.

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "EMPLOYEE"
  }
}
```

### Logout
```http
POST /api/auth/logout
```

### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

## Leaves

### List Leaves
```http
GET /api/leaves
```

**Query Parameters:**
- `status` (optional): Filter by status (PENDING, APPROVED, REJECTED, CANCELLED)
- `startDate` (optional): Filter by start date (ISO 8601)
- `endDate` (optional): Filter by end date (ISO 8601)

**Response:**
```json
[
  {
    "id": "leave_id",
    "userId": "user_id",
    "leaveTypeId": "type_id",
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-01-20T00:00:00.000Z",
    "totalDays": 5,
    "status": "APPROVED",
    "comment": "Vacances",
    "leaveType": {
      "name": "Congés payés",
      "color": "#3b82f6"
    },
    "approver": {
      "name": "Manager Name"
    }
  }
]
```

### Create Leave Request
```http
POST /api/leaves
Content-Type: application/json

{
  "leaveTypeId": "type_id",
  "startDate": "2024-01-15T00:00:00.000Z",
  "endDate": "2024-01-20T00:00:00.000Z",
  "halfDayStart": false,
  "halfDayEnd": false,
  "comment": "Vacances d'été",
  "documentUrl": "https://example.com/doc.pdf"
}
```

**Response:**
```json
{
  "id": "leave_id",
  "status": "PENDING",
  "totalDays": 5,
  ...
}
```

### Approve/Reject Leave
```http
POST /api/leaves/[id]/approve
Content-Type: application/json

{
  "action": "approve" | "reject",
  "reason": "Required for reject action"
}
```

**Response:**
```json
{
  "success": true
}
```

### Export Leaves (CSV)
```http
GET /api/leaves/export
```

**Query Parameters:**
- `status` (optional): Filter by status
- `startDate` (optional): Filter by start date
- `endDate` (optional): Filter by end date

**Response:** CSV file download

**Note:** Only available to MANAGER and ADMIN roles.

## Users

### List Users (Admin Only)
```http
GET /api/users
```

**Response:**
```json
[
  {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "EMPLOYEE",
    "managerId": "manager_id",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Create User (Admin Only)
```http
POST /api/users
Content-Type: application/json

{
  "email": "new.user@example.com",
  "name": "New User",
  "password": "SecurePassword123!",
  "role": "EMPLOYEE",
  "managerId": "manager_id"
}
```

### Update User (Admin Only)
```http
PATCH /api/users/[id]
Content-Type: application/json

{
  "name": "Updated Name",
  "role": "MANAGER",
  "isActive": false
}
```

### Delete User (Admin Only)
```http
DELETE /api/users/[id]
```

### Import Users (CSV/XLSX) (Admin Only)
```http
POST /api/users/import
Content-Type: multipart/form-data

file: users.csv
```

**CSV Format:**
```csv
email,name,role,manager_email
john@example.com,John Doe,EMPLOYEE,manager@example.com
```

## Leave Balances

### Get User Balance
```http
GET /api/users/[userId]/balance
```

**Response:**
```json
[
  {
    "id": "balance_id",
    "leaveTypeId": "type_id",
    "year": 2024,
    "allocated": 25,
    "used": 5,
    "pending": 3,
    "remaining": 17,
    "carryOver": 0,
    "leaveType": {
      "name": "Congés payés",
      "code": "CP"
    }
  }
]
```

## Leave Types

### List Leave Types
```http
GET /api/leave-types
```

**Response:**
```json
[
  {
    "id": "type_id",
    "name": "Congés payés",
    "code": "CP",
    "color": "#3b82f6",
    "icon": "🏖️",
    "maxDaysPerYear": 25,
    "requiresApproval": true,
    "carryOverAllowed": true,
    "carryOverMaxDays": 5
  }
]
```

### Create Leave Type (Admin Only)
```http
POST /api/leave-types
Content-Type: application/json

{
  "name": "RTT",
  "code": "RTT",
  "color": "#10b981",
  "icon": "🎯",
  "maxDaysPerYear": 10,
  "requiresApproval": true,
  "carryOverAllowed": false
}
```

## Company Settings

### Get Company Settings (Admin Only)
```http
GET /api/company/settings
```

**Response:**
```json
{
  "id": "company_id",
  "name": "Company Name",
  "contactEmail": "contact@company.com",
  "workingDays": [1, 2, 3, 4, 5],
  "notificationNewRequestEmail": true,
  "notificationPendingReminder": true,
  "defaultTheme": "system"
}
```

### Update Company Settings (Admin Only)
```http
PATCH /api/company/settings
Content-Type: application/json

{
  "name": "Updated Company Name",
  "workingDays": [1, 2, 3, 4, 5],
  "notificationNewRequestEmail": false
}
```

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "errors": {
    "field": "Field-specific error message"
  }
}
```

### Common Error Codes

- `UNAUTHENTICATED` (401): Not logged in
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid input data
- `CONFLICT` (409): Duplicate entry
- `RATE_LIMIT_EXCEEDED` (429): Too many requests

### Rate Limits

- Authentication endpoints: 5 requests/minute
- Standard API endpoints: 100 requests/minute
- Read operations: 200 requests/minute
- Write operations: 30 requests/minute
- Sensitive operations: 10 requests/hour

## Webhooks (Future)

Coming soon: webhooks for leave approval, rejection, and balance updates.

## Pagination (Future)

Coming soon: pagination support for list endpoints.

Example:
```http
GET /api/leaves?page=2&limit=20&sortBy=startDate&sortOrder=desc
```
