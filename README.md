# MINIMAL – Contemporary Luxury E‑commerce Platform

**MINIMAL** is a full‑stack, high‑end e‑commerce platform designed for contemporary luxury fashion and tailored apparel. It combines a sophisticated **Next.js 16** frontend featuring editorial aesthetics with a robust **Spring Boot 4 (Java 25)** backend. Customers can discover collections, manage carts and favorites, place orders with Stripe payment processing, track deliveries, and manage their personal accounts seamlessly.

---

## ✨ Key Features

- **🔐 Authentication & Security** – JWT‑based authentication, 6‑digit email OTP verification for registration, secure password reset workflow, profile updates, avatar uploads, and soft account deletion.
- **👗 Product Catalog & Filtering** – Dynamic product catalog with category, gender, query search, and price/popularity sorting. Detailed product view with multi‑image galleries, size/color selectors, and customer review submission.
- **🛍️ Cart & Multi‑Step Checkout** – Persistent shopping cart with guest‑to‑authenticated sync, address validation, Stripe checkout integration, and instant order generation.
- **❤️ Favorites & Wishlist** – Fast, synchronized favorites collection allowing users to save and manage preferred styles across devices.
- **📦 Order Tracking & History** – Real‑time order lookup via unique order tracking numbers, full customer order history, and status progression (`PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
- **👑 Comprehensive Admin Dashboard** – Role‑based administration portal (`ROLE_ADMIN`) featuring real‑time sales statistics, product catalog management (with direct image uploads), complete order status fulfillment, and user access management (block/unblock/delete).
- **🎨 Editorial Design & Fluid UX** – Built with Next.js 16 (App Router), React 19, Tailwind CSS 4, Framer Motion animations, and bespoke typography (*Plus Jakarta Sans* & *Cormorant Garamond*).

---

## 🧱 Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS 4, PostCSS
- **Animations & Icons:** Framer Motion, Lucide React
- **Payments:** Stripe Elements (`@stripe/react-stripe-js`, `@stripe/stripe-js`)
- **Notifications:** React Toastify
- **Language:** TypeScript 5
- **State Management:** React Context API (Auth, User, Product, Cart, Favorite, Checkout)

### Backend
- **Framework:** Spring Boot 4.1.1
- **Language:** Java 25
- **Security:** Spring Security & JJWT (JSON Web Token 0.12.6)
- **Database / ORM:** MySQL 8+ & Spring Data JPA / Hibernate
- **Email Service:** Spring Boot Starter Mail (JavaMailSender / SMTP)
- **Validation:** Jakarta Bean Validation (Hibernate Validator)
- **Build Tool:** Maven (with Maven Wrapper `mvnw`)
- **Productivity:** Project Lombok

### Database & Storage
- **Database:** MySQL
- **In-Memory Testing:** H2 Database (with H2 Console)
- **Media Storage:** Local multipart file storage for product images and user avatars (`uploads/`)

---

## 📂 Project Structure

```
minimal/
├── README.md
│
├── frontend/                        # Next.js 16 Application
│   ├── app/                         # App Router pages & layouts
│   │   ├── _components/             # Homepage components (Hero, CollectionGrid, etc.)
│   │   ├── about/                   # About brand page
│   │   ├── admin/                   # Admin dashboard (products, orders, users)
│   │   ├── cart/                    # Cart overview & quantity management
│   │   ├── contact/                 # Customer support & inquiry page
│   │   ├── favorites/               # Wishlist & saved items
│   │   ├── login/                   # Authentication (Login, Register, OTP, Reset)
│   │   ├── men/                     # Men's collection page
│   │   ├── orders/                  # Order history & order tracking
│   │   ├── payment/                 # Payment gateway & Stripe processing
│   │   ├── products/                # Product details & reviews
│   │   ├── profile/                 # User profile settings & avatar upload
│   │   ├── settings/                # Account preferences & security
│   │   ├── shipping/                # Checkout delivery address step
│   │   ├── shop/                    # Full catalog with search & filters
│   │   └── women/                   # Women's collection page
│   ├── components/                  # Global shared UI components (Header, Footer, Toast)
│   ├── context/                     # Global state context providers
│   ├── interfaces/                  # TypeScript data contracts & models
│   ├── router/                      # Route guards & protection logic
│   ├── services/                    # API client layer (Auth, Product, Cart, Order, User)
│   ├── public/                      # Static assets & icons
│   ├── package.json
│   └── tsconfig.json
│
└── backend/                         # Spring Boot Application
    ├── pom.xml                      # Maven dependencies & build configuration
    ├── mvnw / mvnw.cmd              # Maven Wrapper binaries
    ├── uploads/                     # Uploaded product images & user avatars
    └── src/
        ├── main/
        │   ├── java/com/example/minimal/
        │   │   ├── MinimalApplication.java   # Main Spring Boot entry point
        │   │   ├── config/                   # CORS, Security & Web configuration
        │   │   ├── controller/               # REST API controllers
        │   │   ├── dto/                      # Data Transfer Objects & request models
        │   │   ├── exception/                # Global exception handling & API errors
        │   │   ├── model/                    # JPA Entities (User, Product, Order, Cart, etc.)
        │   │   ├── repository/               # Spring Data JPA repositories
        │   │   ├── security/                 # JWT filter, UserDetailsService & token provider
        │   │   └── service/                  # Business logic services
        │   └── resources/
        │       └── application.properties    # Server & datasource configuration
        └── test/                             # Unit and integration test suites
```

---

## 🚀 Getting Started

Follow these steps to run the complete MINIMAL platform locally.

### Prerequisites

Ensure you have installed:
- **Node.js**: v18.18+ or v20+ (with `npm`)
- **Java JDK**: 25 (or compatible LTS JDK configured for project build)
- **MySQL Server**: v8.0+ running locally (or via Docker)

---

### 1. Database Setup

Create a MySQL database named `minimal_db`:

```sql
CREATE DATABASE minimal_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### 2. Backend Configuration & Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create the environment configuration file:**
   Copy `.env.example` to `.env` (or configure `src/main/resources/application.properties`):
   ```bash
   cp .env.example .env
   ```

3. **Configure the environment variables in `backend/.env`:**
   ```ini
   # Server Port
   PORT=8080

   # Database Configuration (MySQL)
   DATABASE_URL=jdbc:mysql://localhost:3306/minimal_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   DATABASE_USERNAME=root
   DATABASE_PASSWORD=your_mysql_password

   # JWT Configuration
   JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
   JWT_EXPIRATION=86400000

   # Mail Configuration (SMTP for OTPs)
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your_email@gmail.com
   MAIL_PASSWORD=your_email_app_password
   MAIL_FROM=no-reply@minimal.com

   # Allowed Frontend Origin
   FRONTEND_URL=http://localhost:3000
   ```

4. **Build and start the Spring Boot backend:**
   - **On Linux / macOS:**
     ```bash
     ./mvnw spring-boot:run
     ```
   - **On Windows:**
     ```powershell
     .\mvnw.cmd spring-boot:run
     ```

   The backend will start at: `http://localhost:8080`

---

### 3. Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Configure the frontend environment:**
   Create `.env.local` in `frontend/`:
   ```ini
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

4. **Start the Next.js development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser and visit:**
   ```
   http://localhost:3000
   ```

---

## 📡 API Endpoints (Backend)

All REST endpoints return standardized JSON wrapped in `ApiResponse<T>` format.

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user & dispatch 6-digit OTP | Public |
| POST | `/api/auth/verify-email` | Verify email with OTP code | Public |
| POST | `/api/auth/login` | Authenticate user & return JWT token | Public |
| POST | `/api/auth/forgot-password` | Request password reset OTP | Public |
| POST | `/api/auth/verify-reset-otp` | Validate reset OTP & receive temporary reset token | Public |
| POST | `/api/auth/reset-password` | Reset password using valid reset token | Public |
| POST | `/api/auth/resend-otp` | Resend verification OTP code | Public |
| GET | `/api/auth/me` | Fetch currently authenticated user | Authenticated |
| POST | `/api/auth/logout` | Invalidate user session | Authenticated |

---

### 👗 Products (`/api/products`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/products` | Get products with search, category, gender & sorting | Public |
| GET | `/api/products/{id}` | Get product details by ID | Public |
| GET | `/api/products/slug/{slug}` | Get product details by URL slug | Public |
| GET | `/api/products/{id}/reviews` | Fetch reviews for a specific product | Public |
| POST | `/api/products/{id}/reviews` | Submit product review & rating (1-5 stars) | Authenticated |

---

### 🛒 Cart (`/api/cart`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/cart` | Get current user's active shopping cart | Authenticated |
| POST | `/api/cart/add` | Add item variant (size/color/quantity) to cart | Authenticated |
| PUT | `/api/cart/item/{itemId}` | Update quantity of a specific cart item | Authenticated |
| DELETE | `/api/cart/item/{itemId}` | Remove item from cart | Authenticated |
| DELETE | `/api/cart/clear` | Clear all items from cart | Authenticated |
| POST | `/api/cart/sync` | Sync local guest cart items upon login | Authenticated |

---

### ❤️ Favorites / Wishlist (`/api/favorites`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/favorites` | Get list of user's favorited products | Authenticated |
| GET | `/api/favorites/ids` | Get array of favorited product IDs | Authenticated |
| POST | `/api/favorites/{productId}` | Add product to favorites | Authenticated |
| DELETE | `/api/favorites/{productId}` | Remove product from favorites | Authenticated |
| POST | `/api/favorites/{productId}/toggle` | Toggle favorite state for a product | Authenticated |
| GET | `/api/favorites/check/{productId}` | Check if product is favorited | Authenticated |

---

### 📦 Orders (`/api/orders`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/orders` | Place a new order with shipping & payment info | Authenticated / Guest |
| GET | `/api/orders` | List order history for authenticated user | Authenticated |
| GET | `/api/orders/{id}` | Get detailed order summary by order ID | Authenticated |
| GET | `/api/orders/track/{orderNumber}` | Public order tracking by tracking code | Public |

---

### 👤 User Account (`/api/user`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/user/profile` | Retrieve user profile data | Authenticated |
| PUT | `/api/user/profile` | Update profile information | Authenticated |
| POST | `/api/user/upload-avatar` | Upload user profile picture | Authenticated |
| PUT | `/api/user/change-password` | Update account password | Authenticated |
| POST | `/api/user/delete-account` | Soft-delete / deactivate account | Authenticated |

---

### 👑 Admin Management (`/api/admin`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/products` | Retrieve all products (including draft/inactive) | Admin |
| POST | `/api/admin/products` | Create a new product | Admin |
| POST | `/api/admin/products/upload-image` | Upload product media asset | Admin |
| PUT | `/api/admin/products/{id}` | Update product details | Admin |
| DELETE | `/api/admin/products/{id}` | Delete product | Admin |
| GET | `/api/orders/admin` | List all orders across all customers | Admin |
| PUT | `/api/orders/{id}/status` | Update order status (`SHIPPED`, `DELIVERED`, etc.) | Admin |
| DELETE | `/api/orders/{id}` | Delete order record | Admin |
| GET | `/api/admin/users` | List all registered users | Admin |
| GET | `/api/admin/users/{id}` | Get user details by ID | Admin |
| PUT | `/api/admin/users/{id}` | Update user role and status | Admin |
| PUT | `/api/admin/users/{id}/block` | Toggle user blocked/active status | Admin |
| DELETE | `/api/admin/users/{id}` | Delete user account | Admin |

---

## 🔧 Development Tips

- **Default Ports**:
  - Frontend: `http://localhost:3000`
  - Backend: `http://localhost:8080`
- **Static Media Uploads**:
  - Files uploaded via `/api/admin/products/upload-image` and `/api/user/upload-avatar` are stored in `backend/uploads/` and served statically.
- **Granting Admin Privileges**:
  - In MySQL, update the target user's role:
    ```sql
    UPDATE users SET role = 'ROLE_ADMIN' WHERE email = 'admin@minimal.com';
    ```
- **SMTP Emails in Development**:
  - To test OTPs without real SMTP delivery, you can use local SMTP catchers (like MailHog or Mailpit) or verify generated OTPs directly from the database `otps` table.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/luxury-feature`).
3. Commit your changes (`git commit -m 'Add luxury feature'`).
4. Push to the branch (`git push origin feature/luxury-feature`).
5. Open a Pull Request.

---


## 👤 Author

**Name:** Puvanakopis  
**GitHub:** [@puvanakopis](https://github.com/puvanakopis)  
**LinkedIn:** [Puvanakopis](https://www.linkedin.com/in/puvanakopis/)  
**Email:** puvanakopis@gmail.com

---

MINIMAL – Redefining Contemporary Luxury Fashion ✨

