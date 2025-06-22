import { Product, Order, ProductCategory, SalesData } from './types';

// Seed products data
export const seedProducts: Product[] = [
  {
    id: '1',
    title: 'Premium Cotton T-Shirt',
    description: 'High-quality cotton t-shirt, perfect for everyday wear.',
    price: 24.99,
    images: ['https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    stock: 150,
    category: 'clothing',
    status: 'active',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Wireless Bluetooth Headphones',
    description: 'Noise-cancelling headphones with 24-hour battery life.',
    price: 129.99,
    images: ['https://images.pexels.com/photos/3394666/pexels-photo-3394666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    stock: 75,
    category: 'electronics',
    status: 'active',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 ceramic coffee mugs in assorted colors.',
    price: 34.99,
    images: ['https://images.pexels.com/photos/1566308/pexels-photo-1566308.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    stock: 100,
    category: 'home',
    status: 'active',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Organic Face Moisturizer',
    description: 'All-natural face moisturizer for all skin types.',
    price: 49.99,
    images: ['https://images.pexels.com/photos/3321416/pexels-photo-3321416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    stock: 30,
    category: 'beauty',
    status: 'active',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    title: 'Chef\'s Professional Knife Set',
    description: 'Professional-grade knife set with 8 pieces and wooden block.',
    price: 199.99,
    images: ['https://images.pexels.com/photos/3214157/pexels-photo-3214157.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    stock: 25,
    category: 'home',
    status: 'active',
    createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    title: 'Smart Watch with Fitness Tracking',
    description: 'Advanced fitness tracking with heart rate monitoring and GPS.',
    price: 159.99,
    images: ['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    stock: 50,
    category: 'electronics',
    status: 'active',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Generate seed orders
export const seedOrders: Order[] = [
  {
    id: 'ORD-1001',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    customer: {
      id: 'CUST-101',
      name: 'John Doe',
      email: 'john.doe@example.com',
      address: '123 Main St, New York, NY 10001',
      phone: '(555) 123-4567',
    },
    items: [
      {
        productId: '1',
        title: 'Premium Cotton T-Shirt',
        price: 24.99,
        quantity: 2,
        image: seedProducts[0].images[0],
      },
      {
        productId: '3',
        title: 'Ceramic Coffee Mug Set',
        price: 34.99,
        quantity: 1,
        image: seedProducts[2].images[0],
      },
    ],
    total: 84.97,
    status: 'delivered',
  },
  {
    id: 'ORD-1002',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    customer: {
      id: 'CUST-102',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      address: '456 Broadway, New York, NY 10002',
      phone: '(555) 987-6543',
    },
    items: [
      {
        productId: '2',
        title: 'Wireless Bluetooth Headphones',
        price: 129.99,
        quantity: 1,
        image: seedProducts[1].images[0],
      },
    ],
    total: 129.99,
    status: 'shipped',
  },
  {
    id: 'ORD-1003',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    customer: {
      id: 'CUST-103',
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      address: '789 Park Ave, New York, NY 10003',
      phone: '(555) 456-7890',
    },
    items: [
      {
        productId: '4',
        title: 'Organic Face Moisturizer',
        price: 49.99,
        quantity: 1,
        image: seedProducts[3].images[0],
      },
      {
        productId: '6',
        title: 'Smart Watch with Fitness Tracking',
        price: 159.99,
        quantity: 1,
        image: seedProducts[5].images[0],
      },
    ],
    total: 209.98,
    status: 'processing',
  },
  {
    id: 'ORD-1004',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    customer: {
      id: 'CUST-104',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      address: '321 5th Ave, New York, NY 10004',
      phone: '(555) 567-8901',
    },
    items: [
      {
        productId: '5',
        title: 'Chef\'s Professional Knife Set',
        price: 199.99,
        quantity: 1,
        image: seedProducts[4].images[0],
      },
    ],
    total: 199.99,
    status: 'delivered',
  },
  {
    id: 'ORD-1005',
    date: new Date().toISOString(),
    customer: {
      id: 'CUST-105',
      name: 'Michael Wilson',
      email: 'michael.wilson@example.com',
      address: '654 Oak St, New York, NY 10005',
      phone: '(555) 234-5678',
    },
    items: [
      {
        productId: '1',
        title: 'Premium Cotton T-Shirt',
        price: 24.99,
        quantity: 1,
        image: seedProducts[0].images[0],
      },
      {
        productId: '2',
        title: 'Wireless Bluetooth Headphones',
        price: 129.99,
        quantity: 1,
        image: seedProducts[1].images[0],
      },
      {
        productId: '3',
        title: 'Ceramic Coffee Mug Set',
        price: 34.99,
        quantity: 1,
        image: seedProducts[2].images[0],
      },
    ],
    total: 189.97,
    status: 'pending',
  },
];

// Generate sales data for the past 30 days
export const generateSalesData = (): SalesData[] => {
  const data: SalesData[] = [];
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate some random sales data - more recent days have higher probability of more sales
    const probability = (30 - i) / 30; // Higher probability for more recent days
    const orders = Math.floor(Math.random() * 5 + 1 + probability * 5); // 1-10 orders
    const avgOrderValue = Math.random() * 100 + 50; // $50-$150 per order
    const revenue = Math.round(orders * avgOrderValue * 100) / 100;
    
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: revenue,
      orders: orders
    });
  }
  
  return data;
};

export const salesData = generateSalesData();

// Generate categories with count
export const getProductCategoryCounts = (products: Product[]) => {
  const categories: Record<string, number> = {};
  
  products.forEach(product => {
    if (categories[product.category]) {
      categories[product.category]++;
    } else {
      categories[product.category] = 1;
    }
  });
  
  return Object.entries(categories).map(([name, count]) => ({ name, count }));
};