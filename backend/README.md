# Minimal Authentication Backend — Spring Boot + MySQL + JWT

Production-ready, stateless authentication backend built with **Spring Boot** and **Java 25**, featuring **Spring Security**, **Jakarta Validation**, **Hibernate/JPA**, **MySQL**, **JavaMailSender**, and **JJWT**.

---

## 1. Prerequisites & Environment Setup

* **Java Version**: OpenJDK 25 (or JDK 21+ LTS)
* **Maven Version**: Apache Maven 3.9+ (Wrapper included via `./mvnw`)
* **MySQL Database**: MySQL 8.0+

### Environment Variables

Configure the following environment variables (or create a `.env` file):

| Variable | Description | Default / Example |
|---|---|---|
| `PORT` | Backend server port | `8080` |
| `DATABASE_URL` | MySQL JDBC URL | `jdbc:mysql://localhost:3306/minimal_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC` |
| `DATABASE_USERNAME` | MySQL username | `root` |
| `DATABASE_PASSWORD` | MySQL password | `your_mysql_password` |
| `JWT_SECRET` | 256-bit Hex/Base64 Secret Key | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` |
| `JWT_EXPIRATION` | JWT token validity in milliseconds | `86400000` (24 hours) |
| `MAIL_HOST` | SMTP Host | `smtp.gmail.com` |
| `MAIL_PORT` | SMTP Port | `587` |
| `MAIL_USERNAME` | SMTP Username / Email | `your_email@gmail.com` |
| `MAIL_PASSWORD` | SMTP App Password | `your_app_password` |
| `MAIL_FROM` | Sender email address | `no-reply@minimal.com` |
| `FRONTEND_URL` | Allowed frontend origin for CORS | `http://localhost:3000` |

---

## 2. Running the Backend

### Build and Run locally
```bash
# In the backend directory
./mvnw clean spring-boot:run
```

### Run Automated Tests
```bash
./mvnw test
```

---

## 3. API Documentation

All API responses follow a unified envelope structure:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": "validation error message"
  }
}
```

---

### 1. Register Account
* **Method**: `POST`
* **URL**: `/api/auth/register`
* **Authentication**: None (Public)
* **Purpose**: Registers a new unverified user and emails a secure 6-digit OTP code for account verification.
* **Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!"
}
```
* **Success Response** (HTTP 201 Created):
```json
{
  "success": true,
  "message": "Registration initiated. A 6-digit verification code has been sent to your email."
}
```
* **Possible Errors**:
  * `400 Bad Request`: Validation failure (weak password, invalid email format, passwords do not match).
  * `409 Conflict`: An account with this email already exists and is verified.

---

### 2. Verify Email OTP
* **Method**: `POST`
* **URL**: `/api/auth/verify-email`
* **Authentication**: None (Public)
* **Purpose**: Validates the 6-digit OTP sent to the user's email, marks the user account as verified (`email_verified = true`), and activates the account.
* **Request Body**:
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```
* **Success Response** (HTTP 200 OK):
```json
{
  "success": true,
  "message": "Email verified successfully. You can now sign in.",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "emailVerified": true,
    "role": "ROLE_USER",
    "createdAt": "2026-09-17T21:00:00"
  }
}
```
* **Possible Errors**:
  * `400 Bad Request`: Invalid OTP code, expired OTP, or too many failed attempts.
  * `404 Not Found`: User not found.

---

### 3. Login
* **Method**: `POST`
* **URL**: `/api/auth/login`
* **Authentication**: None (Public)
* **Purpose**: Authenticates the user with email and password, verifies email verification status, and returns a signed JWT token.
* **Request Body**:
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```
* **Success Response** (HTTP 200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "user": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "emailVerified": true,
      "role": "ROLE_USER",
      "createdAt": "2026-09-17T21:00:00"
    }
  }
}
```
* **Possible Errors**:
  * `401 Unauthorized`: Invalid email or password.
  * `403 Forbidden`: Account email is not verified yet.

---

### 4. Forgot Password
* **Method**: `POST`
* **URL**: `/api/auth/forgot-password`
* **Authentication**: None (Public)
* **Purpose**: Sends a 6-digit password reset OTP to the user's email (with expiration and attempt limits).
* **Request Body**:
```json
{
  "email": "john@example.com"
}
```
* **Success Response** (HTTP 200 OK):
```json
{
  "success": true,
  "message": "If an account exists with this email, a password reset code has been sent."
}
```

---

### 5. Verify Password Reset OTP
* **Method**: `POST`
* **URL**: `/api/auth/verify-reset-otp`
* **Authentication**: None (Public)
* **Purpose**: Validates the 6-digit password reset OTP and generates a temporary, single-use password reset token.
* **Request Body**:
```json
{
  "email": "john@example.com",
  "otp": "654321"
}
```
* **Success Response** (HTTP 200 OK):
```json
{
  "success": true,
  "message": "OTP verified successfully.",
  "data": {
    "resetToken": "eyJhbGciOiJIUzI1NiJ9..."
  }
}
```
* **Possible Errors**:
  * `400 Bad Request`: Invalid OTP, expired OTP, or too many failed attempts.

---

### 6. Reset Password
* **Method**: `POST`
* **URL**: `/api/auth/reset-password`
* **Authentication**: None (Public)
* **Purpose**: Updates the user password after verifying the temporary reset token and invalidates the reset session.
* **Request Body**:
```json
{
  "email": "john@example.com",
  "resetToken": "eyJhbGciOiJIUzI1NiJ9...",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```
* **Success Response** (HTTP 200 OK):
```json
{
  "success": true,
  "message": "Password reset successfully. You can now sign in with your new password."
}
```
* **Possible Errors**:
  * `400 Bad Request`: Invalid/expired reset token or password confirmation mismatch.

---

### 7. Resend OTP
* **Method**: `POST`
* **URL**: `/api/auth/resend-otp`
* **Authentication**: None (Public)
* **Purpose**: Resends an OTP for either `ACCOUNT_VERIFICATION` or `PASSWORD_RESET` subject to cooldown (60 seconds) and attempt limitations.
* **Request Body**:
```json
{
  "email": "john@example.com",
  "purpose": "ACCOUNT_VERIFICATION"
}
```
* **Success Response** (HTTP 200 OK):
```json
{
  "success": true,
  "message": "A new verification code has been sent to your email."
}
```
* **Possible Errors**:
  * `429 Too Many Requests`: Cooldown period is still active.

---

### 8. Get Authenticated User Profile
* **Method**: `GET`
* **URL**: `/api/auth/me`
* **Authentication**: `Bearer <JWT_TOKEN>`
* **Purpose**: Retrieves the currently authenticated user's profile information.
* **Success Response** (HTTP 200 OK):
```json
{
  "success": true,
  "message": "User profile fetched successfully",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "emailVerified": true,
    "role": "ROLE_USER",
    "createdAt": "2026-09-17T21:00:00"
  }
}
```
* **Possible Errors**:
  * `401 Unauthorized`: Missing, expired, or invalid JWT token.

---

### 9. Logout
* **Method**: `POST`
* **URL**: `/api/auth/logout`
* **Authentication**: None / Optional Bearer
* **Purpose**: Client-side logout acknowledgment.
* **Success Response** (HTTP 200 OK):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```
