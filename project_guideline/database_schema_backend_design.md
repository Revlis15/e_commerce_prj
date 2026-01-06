# Database Schema & Backend Design

## 1. Overview
This document defines the **database schema** and **backend architecture** for the E-commerce System, strictly derived from the provided system analysis and design document. The goal is to ensure implementation fidelity while remaining production-ready.

---

## 2. Database Design

### 2.1 Design Principles
- Relational model (PostgreSQL)
- 3NF normalization
- Clear separation of user roles
- Referential integrity via foreign keys
- Auditability via timestamps

---

### 2.2 Entity Relationship Summary
Core entities:
- TaiKhoan (Account)
- KhachHang (Customer)
- NguoiBan (Seller)
- Admin
- SanPham (Product)
- DanhMuc (Category)
- GioHang (Cart)
- ChiTietGioHang (CartItem)
- DonHang (Order)
- ChiTietDonHang (OrderItem)
- ThanhToan (Payment)
- Review
- KhieuNai (Complaint)

---

### 2.3 Table Definitions

#### 2.3.1 TaiKhoan
```sql
TaiKhoan (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  mat_khau_hash TEXT NOT NULL,
  vai_tro ENUM('CUSTOMER','SELLER','ADMIN') NOT NULL,
  trang_thai BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

---

#### 2.3.2 KhachHang
```sql
KhachHang (
  id UUID PRIMARY KEY,
  tai_khoan_id UUID REFERENCES TaiKhoan(id),
  ho_ten VARCHAR(255),
  so_dien_thoai VARCHAR(20),
  dia_chi TEXT,
  created_at TIMESTAMP
)
```

---

#### 2.3.3 NguoiBan
```sql
NguoiBan (
  id UUID PRIMARY KEY,
  tai_khoan_id UUID REFERENCES TaiKhoan(id),
  ten_cua_hang VARCHAR(255),
  mo_ta TEXT,
  trang_thai_kiem_duyet BOOLEAN,
  created_at TIMESTAMP
)
```

---

#### 2.3.4 Admin
```sql
Admin (
  id UUID PRIMARY KEY,
  tai_khoan_id UUID REFERENCES TaiKhoan(id),
  created_at TIMESTAMP
)
```

---

#### 2.3.5 DanhMuc
```sql
DanhMuc (
  id UUID PRIMARY KEY,
  ten VARCHAR(255),
  parent_id UUID REFERENCES DanhMuc(id)
)
```

---

#### 2.3.6 SanPham
```sql
SanPham (
  id UUID PRIMARY KEY,
  nguoi_ban_id UUID REFERENCES NguoiBan(id),
  danh_muc_id UUID REFERENCES DanhMuc(id),
  ten VARCHAR(255),
  mo_ta TEXT,
  gia NUMERIC(15,2),
  so_luong INT,
  hinh_anh JSONB,
  trang_thai BOOLEAN,
  created_at TIMESTAMP
)
```

---

#### 2.3.7 GioHang
```sql
GioHang (
  id UUID PRIMARY KEY,
  khach_hang_id UUID REFERENCES KhachHang(id),
  created_at TIMESTAMP
)
```

#### 2.3.8 ChiTietGioHang
```sql
ChiTietGioHang (
  id UUID PRIMARY KEY,
  gio_hang_id UUID REFERENCES GioHang(id),
  san_pham_id UUID REFERENCES SanPham(id),
  so_luong INT
)
```

---

#### 2.3.9 DonHang
```sql
DonHang (
  id UUID PRIMARY KEY,
  khach_hang_id UUID REFERENCES KhachHang(id),
  tong_tien NUMERIC(15,2),
  trang_thai VARCHAR(50),
  created_at TIMESTAMP
)
```

#### 2.3.10 ChiTietDonHang
```sql
ChiTietDonHang (
  id UUID PRIMARY KEY,
  don_hang_id UUID REFERENCES DonHang(id),
  san_pham_id UUID REFERENCES SanPham(id),
  so_luong INT,
  don_gia NUMERIC(15,2)
)
```

---

#### 2.3.11 ThanhToan
```sql
ThanhToan (
  id UUID PRIMARY KEY,
  don_hang_id UUID REFERENCES DonHang(id),
  phuong_thuc VARCHAR(50),
  trang_thai VARCHAR(50),
  tong_tien NUMERIC(15,2),
  created_at TIMESTAMP
)
```

---

#### 2.3.12 Review
```sql
Review (
  id UUID PRIMARY KEY,
  san_pham_id UUID REFERENCES SanPham(id),
  khach_hang_id UUID REFERENCES KhachHang(id),
  danh_gia INT CHECK (danh_gia BETWEEN 1 AND 5),
  noi_dung TEXT,
  created_at TIMESTAMP
)
```

---

#### 2.3.13 KhieuNai
```sql
KhieuNai (
  id UUID PRIMARY KEY,
  don_hang_id UUID REFERENCES DonHang(id),
  khach_hang_id UUID REFERENCES KhachHang(id),
  noi_dung TEXT,
  bang_chung JSONB,
  trang_thai VARCHAR(50),
  created_at TIMESTAMP
)
```

---

## 3. Backend Architecture

### 3.1 Architectural Style
- Modular Monolith (NestJS)
- Layered architecture: Controller → Service → Repository
- DTO + Validation Pipes

---

### 3.2 Backend Modules

| Module | Responsibility |
|------|---------------|
| Auth | Login, Register, JWT |
| Users | Customer / Seller / Admin management |
| Products | CRUD, Search |
| Categories | Product classification |
| Cart | Shopping cart logic |
| Orders | Order lifecycle |
| Payments | Payment processing |
| Reviews | Product reviews |
| Complaints | Dispute handling |

---

### 3.3 Example Module Structure
```
backend/src/modules/products
  ├── product.controller.ts
  ├── product.service.ts
  ├── product.repository.ts
  ├── product.entity.ts
  └── dto/
```

---

### 3.4 Security Design
- JWT authentication
- Role-based access control (RBAC)
- Input validation & sanitization
- Rate limiting

---

## 4. Notes for Implementation
- Use Prisma/TypeORM migrations
- Index frequently queried fields (product name, category)
- Use Redis for cart caching
- Store images in S3/MinIO

---

## 5. Next Steps
1. Generate ERD diagram (SVG)
2. Generate OpenAPI spec
3. Implement Auth & Product modules
4. Setup Docker Compose demo

---

**Status:** Ready for implementation

