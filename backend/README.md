# Turf Booking Backend

A Node.js backend for the Turf Booking application with full authentication system.

## Features

- User authentication (signup, login, logout)
- Email verification with OTP
- Password reset functionality
- JWT-based authentication
- Rate limiting for security
- Input validation with Joi
- MongoDB integration with Mongoose
- Email service integration

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- SMTP email service (Gmail, SendGrid, etc.)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/turf-booking

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Cloudinary Configuration (if using)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe Configuration (if using)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

3. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/verify-reset-token` - Verify reset token
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/resend-otp` - Resend OTP

### Request/Response Format

All endpoints return responses in the following format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting for auth endpoints
- Input validation and sanitization
- Account lockout after failed attempts

## Database Models

### User Model
- firstName, lastName, email, phone
- Password (hashed)
- Role (USER, FACILITY_OWNER, ADMIN)
- Verification status
- Login attempts tracking

### OTP Model
- Email/phone verification codes
- Expiration handling
- Attempt tracking

## Email Service

The application includes a comprehensive email service for:
- OTP verification
- Password reset links
- Account notifications

## Development

To run in development mode with auto-restart:
```bash
npm run dev
```

## Production

For production deployment:
1. Set `NODE_ENV=production`
2. Use strong JWT secrets
3. Configure proper CORS origins
4. Set up SSL/TLS
5. Use environment-specific MongoDB connections
