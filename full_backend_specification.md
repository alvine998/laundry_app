# Full Backend API Specification: Laundry App

This document provides a technical blueprint for implementing an **Express.js** backend with **MySQL** as the primary database. This specification replaces all existing mock data in the mobile app.

---

## 1. Core Architecture

- **Runtime**: Node.js (Express.js)
- **Database**: MySQL
- **Real-time**: Socket.io
- **Auth**: JWT (JSON Web Token)
- **Image Storage**: Local Filesystem (Static Assets via `express.static`)

---

## 2. Database Schema (MySQL)

### 2.1 Users Table

Store both Customers and Partners.

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('customer', 'partner') NOT NULL,
  balance DECIMAL(15, 2) DEFAULT 0.00,
  loyalty_points INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.2 Shops (Partners Detail)

```sql
CREATE TABLE shops (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  shop_name VARCHAR(255) NOT NULL,
  shop_photo VARCHAR(255), -- Store local relative path (e.g., /uploads/shops/1.jpg)
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  rating DECIMAL(2, 1) DEFAULT 0.0,
  is_open BOOLEAN DEFAULT TRUE,
  opening_hours VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 2.3 Addresses (Customer Only)

```sql
CREATE TABLE user_addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  label VARCHAR(50) NOT NULL, -- Rumah, Kantor, etc.
  name VARCHAR(255) NOT NULL, -- Recipient Name
  phone VARCHAR(20) NOT NULL,
  full_address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_default BOOLEAN DEFAULT FALSE,
  icon VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 2.4 Services & Packages

```sql
CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  shop_id INT NOT NULL,
  name VARCHAR(255) NOT NULL, -- Laundry Kiloan, Satuan, etc.
  category VARCHAR(100),
  icon VARCHAR(50),
  color VARCHAR(7),
  FOREIGN KEY (shop_id) REFERENCES shops(id)
);

CREATE TABLE packages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_id INT NOT NULL,
  name VARCHAR(255) NOT NULL, -- Reguler, Express, etc.
  time_estimate VARCHAR(100), -- 2 Hari, 6 Jam, etc.
  price DECIMAL(15, 2) NOT NULL,
  FOREIGN KEY (service_id) REFERENCES services(id)
);
```

### 2.5 Orders Table

```sql
CREATE TABLE orders (
  id VARCHAR(50) PRIMARY KEY, -- e.g., ORD-1678293
  customer_id INT NOT NULL,
  shop_id INT NOT NULL,
  service_info JSON NOT NULL, -- Store snapshot of service/package name & price
  status ENUM('PENDING', 'ACCEPTED', 'PICKING_UP', 'PROCESSING', 'DELIVERING', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
  total_amount DECIMAL(15, 2) NOT NULL,
  actual_weight DECIMAL(5, 2) DEFAULT NULL, -- Updated by partner later
  payment_method ENUM('BALANCE', 'CASH') DEFAULT 'BALANCE',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id),
  FOREIGN KEY (shop_id) REFERENCES shops(id)
);
```

---

## 3. API Documentation

### 3.1 Authentication

- `POST /api/auth/register`: Register as Customer or Partner.
- `POST /api/auth/login`: Issue JWT.
- `POST /api/auth/otp/send`: Send code to email/phone.
- `POST /api/auth/otp/verify`: Verify and activate account.

### 3.2 Recovery / Discovery (Nearby Feature)

**MySQL Geo-Query Logic**:
To find shops within 5km of a user:

```sql
SELECT *, (
  6371 * acos(
    cos(radians(?)) * cos(radians(latitude)) *
    cos(radians(longitude) - radians(?)) +
    sin(radians(?)) * sin(radians(latitude))
  )
) AS distance
FROM shops
HAVING distance < 5
ORDER BY distance;
```

- `GET /api/shops/nearby?lat=...&lon=...`: Search partners within range.
- `GET /api/shops/:id`: Detail shop + available services & packages.

### 3.3 Customer Module

- `GET /api/profile`: User details.
- `GET /api/addresses`: List customer addresses.
- `POST /api/addresses`: Add new address.
- `PATCH /api/addresses/:id`: Update/Set as default.
- `POST /api/orders`: Place a new laundry order.
- `GET /api/orders/history`: Order list.

### 3.4 Partner Module

- `PATCH /api/shop/settings`: Update name, hours, location.
- `GET /api/partner/orders/pending`: New requests.
- `PATCH /api/partner/orders/:id/status`: Update status (e.g., `ACCEPTED`).
- `PATCH /api/partner/orders/:id/weight`: Update actual weight (triggers price recalculation).
- `GET /api/partner/wallet/balance`: View earnings.
- `POST /api/partner/wallet/withdraw`: Request funds.

---

## 4. Image Storage (Static)

**Server Setup**:

```javascript
// Serving locally uploaded images
app.use('/uploads', express.static('uploads'));
```

**Upload logic**:

1.  Receive file via `Multer`.
2.  Save to `/uploads/shops/` or `/uploads/profiles/`.
3.  Store the relative path `/uploads/shops/your-image.jpg` in MySQL.
4.  Mobile app displays image using `http://YOUR_BACKEND_URL/uploads/shops/your-image-timestamps.jpg`.

---

## 5. Real-time Synchronization (Socket.io)

### Event Map Table

| Event               | Direction | Data Payload                       | Trigger Point              |
| :------------------ | :-------- | :--------------------------------- | :------------------------- |
| `order_new`         | S -> P    | `{ orderId, customerName, total }` | Customer places order      |
| `order_accepted`    | S -> C    | `{ orderId, partnerName }`         | Partner accepts order      |
| `courier_searching` | S -> C    | `{ orderId }`                      | Simulation after accepting |
| `status_changed`    | S -> C    | `{ orderId, newStatus }`           | Partner updates status     |
| `wallet_update`     | S -> All  | `{ newBalance }`                   | Payment or Top-up success  |

---

## 6. Security (JWT & RBAC)

1.  **JWT Signing**: Use `id` and `role` in the payload.
2.  **Middleware Proofing**:

```javascript
const verifyRole = role => (req, res, next) => {
  if (req.user.role !== role)
    return res.status(403).json({ error: 'Access Denied' });
  next();
};
```

3.  Apply `verifyRole('partner')` to all shop management and order status update routes.
