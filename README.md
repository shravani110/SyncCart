# 🛒 SyncCart — Real-Time Collaborative Shopping System

[![Spring Boot 3](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java 17](https://img.shields.io/badge/Java-17%2B-orange.svg)](https://www.oracle.com/java/)
[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![STOMP WebSockets](https://img.shields.io/badge/WebSockets-STOMP%20%2F%20SockJS-purple.svg)](https://stomp.github.io/)
[![Database](https://img.shields.io/badge/Database-MySQL%20%2F%20H2%20In--Memory-blue.svg)](https://www.h2database.com)

**SyncCart** is a modern, full-stack collaborative e-commerce platform that allows groups (roommates, families, event organizers, or party planners) to shop together in real time. Multiple users join a shared shopping room, add and manage items simultaneously with instantaneous live updates powered by Spring WebSockets (STOMP), monitor group spending against a shared budget progress bar, review member contributions, and seamlessly split/checkout their group order.

---

## 🌟 Key Features

### 1. 🔐 User Authentication & Security
- **JWT-Based Authentication**: Secure stateless token issuance and verification.
- **BCrypt Password Hashing**: Passwords stored securely using salt-hashed encryption.
- **Form Validation**: Clean validation on user registration and sign-in.
- **1-Click Demo Accounts**: Pre-configured buttons to instantly test as Host or Member in separate tabs.

### 2. 🛍️ Pre-Seeded Product Catalog
- **Diverse Sample Products**: Curated items across **Electronics**, **Groceries & Gourmet**, **Home & Living**, and **Lifestyle & Fashion**.
- **Search & Filter**: Real-time keyword search and category filtering with instant client-side feedback.
- **Item Meta**: Includes name, high-resolution photography, category badge, customer rating, stock level, and price.

### 3. 👥 Collaborative Rooms & Role-Based Access Control (RBAC)
- **Unique 6-Character Room Codes**: Cryptographically secure, human-friendly room codes (e.g. `SYNC99`).
- **Host Permissions**:
  - Sets and adjusts the shared room budget limit at any time.
  - Can remove any member from the room.
  - Can clear the entire cart.
  - Only the Host can finalize the order and proceed through mock checkout.
- **Member Permissions**:
  - Join rooms using the 6-character room code.
  - Add items and adjust quantities for their own additions.
  - Remove items they personally added.
- **Active Presence**: Visual avatar stack displaying active room members and host crown badges.

### 4. ⚡ Real-Time Synchronized Cart (WebSockets + STOMP)
- **Instant Synchronization**: Every addition, quantity change, item deletion, budget edit, or member join/leave broadcasts live to `/topic/room/{roomCode}`.
- **Zero Page Refresh**: All active participants in the room see items appear, change, or disappear simultaneously.
- **Item Provenance**: Clear badges and avatars displaying which user added each product.
- **Live Notifications**: Toast banners alert members in real-time when another shopper modifies the cart.

### 5. 📊 Shared Budget Tracking & Split Calculation
- **Multi-Color Live Progress Bar**:
  - 🟢 **< 75%**: Emerald (Safe Zone)
  - 🟡 **75% – 99%**: Amber (Approaching Limit)
  - 🔴 **≥ 100%**: Rose / Pulsing (Budget Exceeded Warning)
- **Exceeded Alert Banner**: Displays warning with exact overage amount.
- **Member Contribution Breakdown**: Calculates individual subtotal, items count, and percentage of current cart per member.
- **Equal Split Target**: Automatically calculates `Total / Member Count` to benchmark against individual consumption.

### 6. 💳 Order Summary & Mock Checkout
- **Review Summary**: Detailed overview of items grouped with added-by member tags.
- **Flexible Group Payment**:
  - *Smart Split Pay*: Each member pays their exact additions.
  - *Equal 50/50 Split*: Total divided equally across participants.
  - *Host Pays All*: Single invoice paid by the Host.
- **Order Confirmation**: Order number generation (`SYNC-XXXXXX`), timestamp, status, and confetti celebration.

---

## 🏗️ Architecture & Tech Stack

```
SyncCart/
├── backend/                  # Java 17 + Spring Boot 3
│   ├── src/main/java/com/synccart/
│   │   ├── config/           # Security, JWT, WebSockets STOMP, DataInitializer
│   │   ├── controller/       # REST & WebSocket MessageMapping Controllers
│   │   ├── dto/              # Request / Response Transfer Objects
│   │   ├── model/            # JPA Entities (User, Product, ShoppingRoom, CartItem, Order...)
│   │   ├── repository/       # Spring Data JPA Repositories
│   │   └── service/          # Business logic & WebSocket Broadcast Service
│   ├── src/main/resources/
│   │   ├── application.properties         # Master config (H2 active by default)
│   │   ├── application-h2.properties      # Zero-setup in-memory database
│   │   └── application-mysql.properties   # Production MySQL database
│   ├── pom.xml
│   ├── mvnw & mvnw.cmd       # Maven Wrapper included
├── frontend/                 # React 19 + Vite + Tailwind CSS
│   ├── src/
│   │   ├── api/              # Axios HTTP client & API endpoints
│   │   ├── components/       # BudgetProgressBar, CartItemRow, ProductCard, MemberSplit...
│   │   ├── context/          # AuthContext & RoomContext (STOMP WebSockets)
│   │   ├── hooks/            # useWebSocket STOMP client hook
│   │   ├── pages/            # Home, Products, Room, Checkout, OrderConfirmation, Login
│   │   └── utils/            # Currency and Date formatting utilities
│   ├── package.json
│   ├── vite.config.js        # Vite + Tailwind + Proxy setup
│   └── tailwind.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Java**: OpenJDK 17 or higher (`java -version`)
- **Node.js**: v18+ or v20+ (`node -v`, `npm -v`)
- **Maven**: (Optional — the included `mvnw` wrapper handles this automatically)
- **MySQL**: (Optional — H2 in-memory mode works out of the box with zero setup)

---

### 1. Backend Setup & Run

Open a terminal in the `backend/` directory:

```bash
cd backend
```

#### Run with Zero Setup (Default: H2 In-Memory)
```bash
# On Windows:
.\mvnw.cmd spring-boot:run

# On Linux/macOS:
./mvnw spring-boot:run
```
The server will start at **`http://localhost:8080`**.
- H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:synccartdb`, User: `sa`, Password: *(empty)*)

#### Run with MySQL (Optional)
1. Ensure MySQL is running on port 3306 and create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS synccart;
   ```
2. Configure credentials in `backend/src/main/resources/application-mysql.properties`.
3. Launch with the MySQL profile:
   ```bash
   .\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=mysql
   ```

---

### 2. Frontend Setup & Run

Open a separate terminal in the `frontend/` directory:

```bash
cd frontend
npm install
npm run dev
```

The web application will open at: **`http://localhost:5173`**.

---

## 👥 Pre-Seeded Demo Accounts & Rooms

For testing real-time synchronization across multiple browser tabs:

| Username | Password | Role | Description |
| :--- | :--- | :--- | :--- |
| **`alice`** | `password123` | Host | Creator of the pre-seeded demo room `SYNC99` |
| **`bob`** | `password123` | Member | Joined member in demo room `SYNC99` |
| **`charlie`**| `password123` | Member | Additional test shopper |
| **`diana`**  | `password123` | Member | Additional test shopper |

> **Pre-Seeded Demo Room Code:** **`SYNC99`**
> - **Budget Limit:** $500.00
> - **Host:** Alice
> - **Member:** Bob

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |

### Products (`/api/products`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Get products (optional `query` and `category` filters) |
| `GET` | `/api/products/categories` | Get all unique product categories |
| `GET` | `/api/products/{id}` | Get product details by ID |

### Shopping Rooms (`/api/rooms`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/rooms` | Create a new shopping room (User becomes Host) |
| `POST` | `/api/rooms/join` | Join room via 6-character room code |
| `GET` | `/api/rooms/{roomCode}` | Get live room details (budget, cart, members, splits) |
| `PATCH`| `/api/rooms/{roomCode}/budget` | Update shared budget (*Host Only*) |
| `DELETE`| `/api/rooms/{roomCode}/members/{userId}` | Remove member (*Host Only*) or leave room |
| `GET` | `/api/rooms/my-rooms` | List active rooms for user |

### Cart Management (`/api/rooms/{roomCode}/cart`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/rooms/{roomCode}/cart` | Add item to shared room cart |
| `PATCH`| `/api/rooms/{roomCode}/cart/{cartItemId}` | Update item quantity (*Item Owner or Host*) |
| `DELETE`| `/api/rooms/{roomCode}/cart/{cartItemId}` | Remove item from cart (*Item Owner or Host*) |
| `DELETE`| `/api/rooms/{roomCode}/cart` | Clear entire room cart (*Host Only*) |

### Orders & Checkout (`/api`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/rooms/{roomCode}/checkout` | Finalize group checkout (*Host Only*) |
| `GET` | `/api/orders/{orderNumber}` | Get order confirmation receipt |
| `GET` | `/api/orders/my-orders` | Get past orders for authenticated user |

---

## ⚡ WebSocket / STOMP Channels

- **Handshake Endpoint:** `http://localhost:8080/ws-synccart` (SockJS enabled)
- **Subscription Topic:** `/topic/room/{roomCode}`
- **Message Types Broadcasted:**
  - `ITEM_ADDED`: Item added by a member.
  - `ITEM_UPDATED`: Quantity modified.
  - `ITEM_REMOVED`: Item deleted from cart.
  - `BUDGET_UPDATED`: Host adjusted the shared budget limit.
  - `MEMBER_JOINED`: New member entered the room.
  - `MEMBER_REMOVED`: Member left or was removed.
  - `CART_CLEARED`: Cart emptied by Host.
  - `CHECKOUT_COMPLETED`: Host finalized the order.

---

## 🧪 Testing Real-Time Sync Step-by-Step

1. Open `http://localhost:5173` in a **Standard Browser Window**.
2. Click **"Sign In"** and click **"Alice (Host)"** quick login.
3. Open a second **Incognito / Private Browser Window** to `http://localhost:5173`.
4. Click **"Sign In"** and click **"Bob (Member)"** quick login.
5. In both windows, navigate to Room **`SYNC99`** (or create a new room in Alice's window and join with the 6-character code in Bob's window).
6. **Watch Real-Time Sync in Action**:
   - In Bob's window, go to **Products** and click **"Add to Room Cart"** on an item.
   - Switch to Alice's window: **The item appears instantly with Bob's name badge, and the budget progress bar increases dynamically!**
   - In Alice's window, click **"Adjust Budget"** and change the budget. Bob's window updates immediately.
   - In Alice's window, click **"Proceed to Checkout"** and confirm. Both windows receive the checkout completion and updated order receipt!

---

## 📦 Pushing to a New GitHub Repository

```bash
# Initialize git repository
git init

# Add all files (respecting .gitignore)
git add .

# Initial commit
git commit -m "Initial commit: Complete SyncCart Full Stack Application"

# Link to your new GitHub repository
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/SyncCart.git

# Push
git push -u origin main
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
