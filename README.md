# 🛒 SyncCart

SyncCart is a real-time collaborative shopping platform where users create shared shopping rooms, add items synchronously via WebSockets, track a group budget, and split payments.

---

## 🛠️ Tech Stack

- **Backend**: Java 17, Spring Boot 3, Spring WebSocket (STOMP), Spring Security (JWT), Spring Data JPA, H2 / MySQL
- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti

---

## 🚀 Quick Start

### 1. Backend
```bash
cd backend
./mvnw spring-boot:run
```
Backend runs at `http://localhost:8080`.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

---

## 👥 Demo Accounts

| Username | Password | Role |
| :--- | :--- | :--- |
| `alice` | `password123` | Host |
| `bob` | `password123` | Member |
| `charlie` | `password123` | Member |
| `diana` | `password123` | Member |

- **Demo Room Code**: `SYNC99`
