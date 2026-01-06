export enum VaiTro {
  CUSTOMER = 'CUSTOMER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  vaiTro: VaiTro;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Product {
  id: string;
  ten: string;
  moTa?: string;
  gia: number;
  soLuong: number;
  hinhAnh?: string[];
  danhMucId: string;
  nguoiBanId: string;
  trangThai: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  ten: string;
  parentId?: string;
}

export interface CartItem {
  id: string;
  sanPhamId: string;
  soLuong: number;
  sanPham: Product;
}

export interface Cart {
  id: string;
  khachHangId: string;
  chiTiets: CartItem[];
}

export interface Order {
  id: string;
  khachHangId: string;
  tongTien: number;
  trangThai: string;
  createdAt: string;
  chiTiets: OrderItem[];
}

export interface OrderItem {
  id: string;
  sanPhamId: string;
  soLuong: number;
  donGia: number;
  sanPham: Product;
}

export interface Review {
  id: string;
  sanPhamId: string;
  khachHangId: string;
  danhGia: number;
  noiDung?: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  donHangId: string;
  khachHangId: string;
  noiDung: string;
  bangChung?: string[];
  trangThai: string;
  createdAt: string;
}
