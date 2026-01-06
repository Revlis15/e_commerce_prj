# E-Commerce Platform

Modern full-stack e-commerce platform with NestJS backend and React frontend featuring a sleek, professional UI.

## Features

### Customer Features
- Browse products with advanced filtering and search
- Shopping cart with real-time updates
- Secure checkout with multiple payment methods
- Order tracking and history
- Product reviews and ratings
- Complaint submission and tracking

### Seller Features
- Product catalog management
- Order management and fulfillment
- Dashboard with sales analytics
- Inventory tracking
- Order status updates

### Admin Features
- User management and seller approval
- Complaint resolution system
- System-wide analytics dashboard
- Product moderation

## Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeORM** - Database ORM
- **PostgreSQL** - Relational database
- **JWT** - Authentication
- **Docker** - Containerization

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Material-UI (MUI)** - Component library
- **Vite** - Build tool and dev server
- **Zustand** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client

## Prerequisites

Before running the project, ensure you have:

- **Docker** and **Docker Compose** installed
  - [Install Docker Desktop](https://www.docker.com/products/docker-desktop) (includes Docker Compose)
- **Node.js** 18+ and **npm** installed
  - [Install Node.js](https://nodejs.org/)
- **Git** installed (for cloning)
- At least **2GB free RAM**
- Available ports: **3000**, **5173**, **5432**

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd e_commerce_prj
```

### 2. Start Backend and Database

```bash
# Start PostgreSQL and Backend API using Docker
docker-compose up -d

# Wait for services to be ready (about 10-15 seconds)
sleep 15

# Verify containers are running
docker ps
```

You should see:
- `ecommerce_postgres` - Status: Up (healthy)
- `ecommerce_backend` - Status: Up

### 3. Initialize Database (First Time Only)

```bash
# Run the database initialization script
docker exec -i ecommerce_postgres psql -U postgres -d ecommerce_db < init-db.sql

# Verify tables were created
docker exec ecommerce_postgres psql -U postgres -d ecommerce_db -c "\dt"
```

### 4. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 5. Start Frontend Development Server

```bash
npm run dev
```

The frontend will start on **http://localhost:5173**

### 6. Access the Application

Open your browser and go to:
```
http://localhost:5173
```

## Test Accounts

The system comes with pre-configured test accounts for each role:

### Customer Account
- **Email:** `customer@example.com`
- **Password:** `password123`
- **Access:** Browse products, add to cart, place orders, file complaints

### Seller Account
- **Email:** `seller@example.com`
- **Password:** `password123`
- **Access:** Manage products, view orders, update order status

### Admin Account
- **Email:** `admin@example.com`
- **Password:** `password123`
- **Access:** User management, complaint resolution, system overview

## Application URLs

- **Frontend (New UI):** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Database:** localhost:5432 (PostgreSQL)

## Managing the Application

### Starting the Application

```bash
# Terminal 1: Start backend and database
docker-compose up -d

# Terminal 2: Start frontend
cd frontend
npm run dev
```

### Stopping the Application

```bash
# Stop frontend (Press Ctrl+C in the terminal running npm run dev)

# Stop backend and database
docker-compose down
```

### Viewing Logs

```bash
# Backend logs
docker logs -f ecommerce_backend

# Database logs
docker logs -f ecommerce_postgres

# All Docker services
docker-compose logs -f
```

### Restarting Services

```bash
# Restart backend
docker-compose restart backend

# Restart database
docker-compose restart postgres

# Restart all Docker services
docker-compose restart
```

## Complete Reset

If you need to start fresh with a clean database:

```bash
# Stop and remove all containers and volumes
docker-compose down -v

# Rebuild and start
docker-compose up -d

# Wait for services
sleep 15

# Re-initialize database
docker exec -i ecommerce_postgres psql -U postgres -d ecommerce_db < init-db.sql
```

## Troubleshooting

### Issue: Backend returns "Connection refused" or "Connection reset"

**Cause:** PostgreSQL is not running or not ready

**Solution:**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# If not running, start it
docker-compose up -d postgres
sleep 10

# Restart backend
docker-compose restart backend
```

### Issue: Frontend shows "Network Error" or API calls fail

**Cause:** Backend is not running or Vite proxy is misconfigured

**Solution:**
```bash
# Check backend is running
docker ps | grep backend
curl http://localhost:3000

# If backend is down, restart it
docker-compose restart backend

# Restart frontend dev server
# Press Ctrl+C and run: npm run dev
```

### Issue: Port already in use

**Cause:** Another process is using the required port

**Solution:**
```bash
# Check what's using the port
# On Linux/Mac:
sudo lsof -i :5173  # Frontend
sudo lsof -i :3000  # Backend
sudo lsof -i :5432  # Database

# On Windows (PowerShell):
netstat -ano | findstr :5173
netstat -ano | findstr :3000
netstat -ano | findstr :5432

# Kill the process or change the port in vite.config.ts or docker-compose.yml
```

### Issue: "Cannot find module" errors in frontend

**Cause:** Dependencies not installed or node_modules corrupted

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: Database tables not found

**Cause:** Database initialization script not executed

**Solution:**
```bash
# Re-run initialization script
docker exec -i ecommerce_postgres psql -U postgres -d ecommerce_db < init-db.sql

# Verify tables exist
docker exec ecommerce_postgres psql -U postgres -d ecommerce_db -c "\dt"
```

### Issue: Seller cannot add products

**Cause:** Seller account needs admin approval

**Solution:**
```bash
# Approve all sellers
docker exec ecommerce_postgres psql -U postgres -d ecommerce_db \
  -c "UPDATE nguoi_ban SET trang_thai_kiem_duyet = true;"
```

### Issue: Empty categories dropdown when adding product

**Cause:** Database not initialized with default categories

**Solution:**
```bash
# Re-initialize database (includes default categories)
docker exec -i ecommerce_postgres psql -U postgres -d ecommerce_db < init-db.sql
```

## Setting Up on a New Device

Follow these steps to set up the project on a new device:

### 1. Install Prerequisites

**On Windows:**
- Install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
- Install [Node.js LTS](https://nodejs.org/)
- Install [Git for Windows](https://git-scm.com/download/win)

**On macOS:**
- Install [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
- Install [Node.js LTS](https://nodejs.org/)
- Git is usually pre-installed, or install via: `brew install git`

**On Linux:**
- Install Docker: `sudo apt-get install docker.io docker-compose` (Ubuntu/Debian)
- Install Node.js: `sudo apt-get install nodejs npm`
- Git is usually pre-installed

### 2. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd e_commerce_prj

# Start backend services
docker-compose up -d
sleep 15

# Initialize database
docker exec -i ecommerce_postgres psql -U postgres -d ecommerce_db < init-db.sql

# Install frontend dependencies
cd frontend
npm install

# Start frontend
npm run dev
```

### 3. Verify Setup

```bash
# Check Docker containers
docker ps

# Test backend API
curl http://localhost:3000

# Open frontend in browser
# Navigate to: http://localhost:5173
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new account
- `POST /auth/login` - Login and get JWT token
- `GET /auth/profile` - Get current user profile

### Products
- `GET /products` - Get all products (public)
- `GET /products/:id` - Get product details
- `POST /products` - Create product (seller only)
- `PUT /products/:id` - Update product (seller only)
- `DELETE /products/:id` - Delete product (seller only)
- `GET /products/my-products` - Get seller's products

### Categories
- `GET /categories` - Get all categories
- `POST /categories` - Create category (admin only)

### Cart
- `GET /cart` - Get current user's cart
- `POST /cart` - Add item to cart
- `PUT /cart/:id` - Update cart item quantity
- `DELETE /cart/:id` - Remove item from cart

### Orders
- `POST /orders` - Create order from cart
- `GET /orders` - Get user's orders
- `GET /orders/:id` - Get order details
- `PUT /orders/:id/status` - Update order status (seller only)

### Complaints
- `POST /complaints` - File a complaint (customer)
- `GET /complaints/my-complaints` - Get user's complaints
- `GET /complaints` - Get all complaints (admin)
- `PUT /complaints/:id/status` - Update complaint status (admin)

### Reviews
- `POST /reviews` - Create product review
- `GET /reviews/product/:id` - Get product reviews

## Project Structure

```
e_commerce_prj/
├── backend/                    # NestJS backend
│   ├── src/
│   │   ├── modules/           # Feature modules
│   │   │   ├── auth/         # Authentication
│   │   │   ├── products/     # Product management
│   │   │   ├── categories/   # Category management
│   │   │   ├── cart/         # Shopping cart
│   │   │   ├── orders/       # Order processing
│   │   │   ├── payments/     # Payment handling
│   │   │   ├── reviews/      # Product reviews
│   │   │   └── complaints/   # Complaint system
│   │   ├── common/           # Shared code
│   │   │   ├── entities/     # Database entities
│   │   │   ├── guards/       # Auth guards
│   │   │   └── decorators/   # Custom decorators
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── pages/            # Page components
│   │   │   ├── auth/         # Login, Register
│   │   │   ├── public/       # Home, Products, Product Detail
│   │   │   ├── customer/     # Cart, Orders, Complaints
│   │   │   ├── seller/       # Dashboard, Product Management, Orders
│   │   │   └── admin/        # Dashboard, Users, Complaints
│   │   ├── components/       # Reusable components
│   │   │   ├── layout/       # Header, Footer, Layout
│   │   │   ├── common/       # Shared components
│   │   │   └── product/      # Product-related components
│   │   ├── services/         # API service layer
│   │   ├── store/            # Zustand state management
│   │   ├── types/            # TypeScript type definitions
│   │   ├── utils/            # Helper functions
│   │   ├── constants/        # App constants
│   │   ├── theme/            # MUI custom theme
│   │   ├── App.tsx           # Main app component
│   │   └── main.tsx          # Entry point
│   ├── vite.config.ts        # Vite configuration
│   └── package.json
│
├── project_guideline/         # Project documentation
│   ├── database_schema_backend_design.md
│   ├── use_case.md
│   └── frontend_ui_ux_design.md
│
├── docker-compose.yml         # Docker services configuration
├── init-db.sql               # Database initialization script
└── README.md                 # This file
```

## Development Workflow

### Making Changes

**Backend Development:**
```bash
# Backend runs in Docker with hot-reload
# After code changes, the backend automatically restarts

# View logs to see changes
docker logs -f ecommerce_backend
```

**Frontend Development:**
```bash
# Frontend runs with Vite hot-reload
# Changes are reflected immediately in the browser

# If you modify vite.config.ts, restart the dev server:
# Ctrl+C, then: npm run dev
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build

# Output will be in frontend/dist/
# Serve with any static file server
```

**Backend:**
```bash
# Already containerized with Docker
# Production deployment uses docker-compose
```

## Database Schema

Key database tables:

- `tai_khoan` - User accounts
- `khach_hang` - Customer profiles
- `nguoi_ban` - Seller profiles
- `admin` - Admin profiles
- `san_pham` - Products
- `danh_muc` - Product categories
- `gio_hang` - Shopping carts
- `chi_tiet_gio_hang` - Cart items
- `don_hang` - Orders
- `chi_tiet_don_hang` - Order items
- `thanh_toan` - Payments
- `review` - Product reviews
- `khieu_nai` - Customer complaints

## Environment Variables

### Backend (configured in docker-compose.yml)

```env
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=ecommerce_db
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
```

### Frontend (configured in vite.config.ts)

The Vite dev server proxies `/api` requests to `http://localhost:3000` automatically.

## Testing the Application

### 1. Customer Flow

1. Navigate to http://localhost:5173
2. Click "Register" and create a customer account, or login with:
   - Email: `customer@example.com`
   - Password: `password123`
3. Browse products at http://localhost:5173/products
4. Click on a product to view details
5. Add items to cart
6. View cart and proceed to checkout
7. Place an order
8. View order history at http://localhost:5173/orders
9. Click on an order to view details and track status

### 2. Seller Flow

1. Login with:
   - Email: `seller@example.com`
   - Password: `password123`
2. Navigate to "My Products"
3. Click "Add Product" to create a new product
4. Fill in product details and submit
5. Edit or delete products from the list
6. Navigate to "Orders" to view customer orders
7. Click on an order to view details
8. Update order status (PENDING → PROCESSING → SHIPPING → DELIVERED)

### 3. Admin Flow

1. Login with:
   - Email: `admin@example.com`
   - Password: `password123`
2. View dashboard with system statistics
3. Navigate to "Users" to manage user accounts
4. Approve pending sellers
5. Navigate to "Complaints" to view and resolve customer issues
6. Update complaint status (PENDING → IN_PROGRESS → RESOLVED/REJECTED)

## API Testing with cURL

```bash
# Register a new account
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","matKhau":"password123","vaiTro":"CUSTOMER"}'

# Login and get token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@example.com","matKhau":"password123"}'

# Get all products
curl http://localhost:3000/products

# Get categories
curl http://localhost:3000/categories

# Get product by ID (replace {id} with actual product ID)
curl http://localhost:3000/products/{id}
```

## Quick Reference Commands

```bash
# Start everything
docker-compose up -d && cd frontend && npm run dev

# Stop everything
docker-compose down

# View logs
docker logs -f ecommerce_backend
docker logs -f ecommerce_postgres

# Access database CLI
docker exec -it ecommerce_postgres psql -U postgres -d ecommerce_db

# Check container status
docker ps

# Restart backend
docker-compose restart backend

# Complete reset
docker-compose down -v && docker-compose up -d && sleep 15 && \
  docker exec -i ecommerce_postgres psql -U postgres -d ecommerce_db < init-db.sql
```

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review application logs: `docker logs ecommerce_backend`
3. Verify all services are running: `docker ps`

## License

MIT License - This project is developed for academic demonstration purposes.

## Contributors

Developed as an e-commerce platform demonstration project.
