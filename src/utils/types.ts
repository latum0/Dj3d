export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  category: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
}

export interface Order {
  id: string;
  date: string;
  customer: Customer;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export type ProductCategory = 'clothing' | 'electronics' | 'home' | 'beauty' | 'food' | 'other';