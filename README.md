# 🏠 RentNest API

RentNest API is a RESTful backend service built with Express.js, TypeScript, Prisma ORM, and Prisma Postgres. It provides a complete property rental management system with secure authentication, role-based authorization, property management, rental request handling, Stripe payment integration, review management, and admin functionalities.

---

# 🚀 Live API

https://rent-nest-a4.vercel.app/

---

# 🧩 ER Diagram

https://drawsql.app/teams/rafi-ahmmed/diagrams/rentnest

---

# ✨ Features

- 🔐 JWT Authentication & Authorization
- 👤 Role-based Access Control (User/Tenant, Landlord & Admin)
- 🏠 Property Management (CRUD)
- 🔍 Property Filter
- 📅 Rental Request Management
- ✅ Rental Approval Workflow
- 💳 Stripe Checkout Payment Integration
- 🔔 Stripe Webhook Handling
- 💰 Payment History Management
- ⭐ Property Reviews & Ratings
- 🛡 Global Error Handling
- 🔒 Password Hashing with Bcrypt
- ⚡ Prisma ORM with

---

# 🛠 Technologies Used

### Backend

- Node.js
- Express.js
- TypeScript

### Database

- Prisma Postgres
- Prisma ORM

### Authentication

- JWT (Access Token)
- BcryptJS

### Payment

- Stripe Checkout
- Stripe Webhooks

### Other Tools

- Prisma Client
- Cookie Parser
- CORS
- HTTP Status
- Chalk
- Dotenv

### Deployment

- Vercel

---

# 📌 API Endpoints

## Authentication

| Method | Endpoint          | Description                    |
| ------ | ----------------- | ------------------------------ |
| POST   | `/api/auth/login` | Login user                     |
| GET    | `/api/auth/me`    | Get authenticated user profile |

---

## Users

| Method | Endpoint        | Description         |
| ------ | --------------- | ------------------- |
| POST   | `/api/register` | Register a new user |

---

## Properties (Public)

| Method | Endpoint              | Description                 |
| ------ | --------------------- | --------------------------- |
| GET    | `/api/properties`     | Get all properties          |
| GET    | `/api/properties/:id` | Get property details        |
| GET    | `/api/categories`     | Get all property categories |

---

## Landlord

### Property Management

| Method | Endpoint                       | Description           |
| ------ | ------------------------------ | --------------------- |
| POST   | `/api/landlord/properties`     | Create a new property |
| PUT    | `/api/landlord/properties/:id` | Update a property     |
| DELETE | `/api/landlord/properties/:id` | Delete a property     |

### Rental Requests

| Method | Endpoint                     | Description                                     |
| ------ | ---------------------------- | ----------------------------------------------- |
| GET    | `/api/landlord/requests`     | Get all rental requests for landlord properties |
| PATCH  | `/api/landlord/requests/:id` | Approve or reject a rental request              |

---

## Rental Requests

| Method | Endpoint           | Description                              |
| ------ | ------------------ | ---------------------------------------- |
| POST   | `/api/rentals`     | Create a rental request                  |
| GET    | `/api/rentals`     | Get authenticated user's rental requests |
| GET    | `/api/rentals/:id` | Get rental request details               |

---

## Payments

| Method | Endpoint                | Description                              |
| ------ | ----------------------- | ---------------------------------------- |
| POST   | `/api/payments`         | Create Stripe Checkout Session           |
| POST   | `/api/payments/webhook` | Stripe Webhook endpoint                  |
| GET    | `/api/payments`         | Get authenticated user's payment history |
| GET    | `/api/payments/:id`     | Get payment details                      |
| GET    | `/api/payments/success` | Payment success callback                 |
| GET    | `/api/payments/failed`  | Payment failed callback                  |

---

## Reviews

| Method | Endpoint       | Description              |
| ------ | -------------- | ------------------------ |
| POST   | `/api/reviews` | Submit a property review |

---

## Admin

| Method | Endpoint                | Description                     |
| ------ | ----------------------- | ------------------------------- |
| POST   | `/api/admin/categories` | Create a new property category  |
| GET    | `/api/admin/users`      | Get all users                   |
| PATCH  | `/api/admin/users/:id`  | Update user status (Active/Ban) |
| GET    | `/api/admin/properties` | Get all properties              |
| GET    | `/api/admin/rentals`    | Get all rental requests         |

---

# 👨‍💻 Author

**Rafi Ahmmed Siyam**
