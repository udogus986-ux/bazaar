# 🛒 Bazaar — Full Stack E-Commerce Platform

> A modern, full-featured e-commerce application built with React, Node.js, PostgreSQL and deployed on Railway.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-131415?style=for-the-badge&logo=railway&logoColor=white)

---

## ✨ Features

### 🛍️ Customer
- Browse and search products with category filtering
- Animated product cards with hover effects
- Product detail page with stock tracking
- Shopping cart with real-time quantity updates
- Multi-step checkout with address management
- Interactive credit card UI with flip animation
- Order history with status tracking
- Dark / Light theme (auto-switches based on system time)

### 👨‍💼 Admin
- Dashboard with sales statistics
- Product management (CRUD)
- Order management with status updates
- Delivery address per order

### 🔐 Auth
- JWT-based authentication
- bcrypt password hashing
- Role-based access control (USER / ADMIN)

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL (Railway) |
| ORM | Prisma |
| Auth | JWT, bcryptjs |
| HTTP Client | Axios |
| Routing | React Router v6 |
| Deploy | Railway |

---

## 📁 Project Structure

```
bazaar/
├── frontend/                 # React + TypeScript
│   └── src/
│       ├── api/              # Axios API calls
│       ├── components/       # Navbar, ProductCard
│       ├── context/          # AuthContext
│       └── pages/            # Home, Cart, Checkout, Orders, Admin...
│
└── backend/                  # Node.js + Express
    └── src/
        ├── controllers/      # auth, product, cart, order, address
        ├── middleware/        # JWT auth, admin guard
        ├── routes/           # API routes
        └── prisma/           # Database schema
```

---

## 🗄️ Database Schema

```
User ──── Order ──── OrderItem ──── Product
  │          │
  │       Address
  │
  └──── CartItem ──── Product
  └──── Address
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Railway account)

### Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Fill in your DATABASE_URL and JWT_SECRET

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm run dev
```

### Environment Variables

**Backend `.env`:**
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (Admin) |
| PUT | `/api/products/:id` | Update product (Admin) |
| DELETE | `/api/products/:id` | Delete product (Admin) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user cart |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/:productId` | Update quantity |
| DELETE | `/api/cart/:productId` | Remove item |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order from cart |
| GET | `/api/orders/my` | Get my orders |
| GET | `/api/orders` | Get all orders (Admin) |
| PUT | `/api/orders/:id/status` | Update status (Admin) |

### Addresses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/addresses` | Get my addresses |
| POST | `/api/addresses` | Add new address |
| PUT | `/api/addresses/:id` | Update address |
| DELETE | `/api/addresses/:id` | Delete address |
| PUT | `/api/addresses/:id/default` | Set as default |

---

## 🎨 Design System

- **Font:** Cormorant Garamond (headings) + DM Sans (body)
- **Theme:** Warm cream tones (light) / Deep charcoal (dark)
- **Accent:** Terracotta red `#C84B31`
- **Gold:** `#C9922A`
- **Animations:** Fade-up, shimmer loading, card flip, floating shapes

---

## 📸 Screenshots

> Add screenshots here after deployment

---

## 👤 Author

Built as part of a full stack developer portfolio.

---

## 📄 License

MIT
