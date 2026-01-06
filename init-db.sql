-- Create Enums
CREATE TYPE vai_tro_enum AS ENUM ('CUSTOMER', 'SELLER', 'ADMIN');
CREATE TYPE phuong_thuc_thanh_toan_enum AS ENUM ('COD', 'BANK_TRANSFER', 'CREDIT_CARD', 'E_WALLET');
CREATE TYPE trang_thai_thanh_toan_enum AS ENUM ('PENDING', 'COMPLETED', 'FAILED');
CREATE TYPE trang_thai_don_hang_enum AS ENUM ('PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED');
CREATE TYPE trang_thai_khieu_nai_enum AS ENUM ('PENDING', 'INVESTIGATING', 'RESOLVED', 'REJECTED');

-- TaiKhoan
CREATE TABLE tai_khoan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  mat_khau_hash TEXT NOT NULL,
  vai_tro vai_tro_enum NOT NULL,
  trang_thai BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- KhachHang
CREATE TABLE khach_hang (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tai_khoan_id UUID REFERENCES tai_khoan(id),
  ho_ten VARCHAR(255),
  so_dien_thoai VARCHAR(20),
  dia_chi TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NguoiBan
CREATE TABLE nguoi_ban (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tai_khoan_id UUID REFERENCES tai_khoan(id),
  ten_cua_hang VARCHAR(255),
  mo_ta TEXT,
  trang_thai_kiem_duyet BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin
CREATE TABLE admin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tai_khoan_id UUID REFERENCES tai_khoan(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DanhMuc
CREATE TABLE danh_muc (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ten VARCHAR(255),
  parent_id UUID REFERENCES danh_muc(id)
);

-- SanPham
CREATE TABLE san_pham (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nguoi_ban_id UUID REFERENCES nguoi_ban(id),
  danh_muc_id UUID REFERENCES danh_muc(id),
  ten VARCHAR(255),
  mo_ta TEXT,
  gia NUMERIC(15,2),
  so_luong INT,
  hinh_anh JSONB,
  trang_thai BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- GioHang
CREATE TABLE gio_hang (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  khach_hang_id UUID REFERENCES khach_hang(id) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ChiTietGioHang
CREATE TABLE chi_tiet_gio_hang (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gio_hang_id UUID REFERENCES gio_hang(id),
  san_pham_id UUID REFERENCES san_pham(id),
  so_luong INT
);

-- DonHang
CREATE TABLE don_hang (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  khach_hang_id UUID REFERENCES khach_hang(id),
  tong_tien NUMERIC(15,2),
  trang_thai VARCHAR(50) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ChiTietDonHang
CREATE TABLE chi_tiet_don_hang (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  don_hang_id UUID REFERENCES don_hang(id),
  san_pham_id UUID REFERENCES san_pham(id),
  so_luong INT,
  don_gia NUMERIC(15,2)
);

-- ThanhToan
CREATE TABLE thanh_toan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  don_hang_id UUID REFERENCES don_hang(id) UNIQUE,
  phuong_thuc VARCHAR(50),
  trang_thai VARCHAR(50) DEFAULT 'PENDING',
  tong_tien NUMERIC(15,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Review
CREATE TABLE review (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  san_pham_id UUID REFERENCES san_pham(id),
  khach_hang_id UUID REFERENCES khach_hang(id),
  danh_gia INT CHECK (danh_gia BETWEEN 1 AND 5),
  noi_dung TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- KhieuNai
CREATE TABLE khieu_nai (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  don_hang_id UUID REFERENCES don_hang(id),
  khach_hang_id UUID REFERENCES khach_hang(id),
  noi_dung TEXT,
  bang_chung JSONB,
  trang_thai VARCHAR(50) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
