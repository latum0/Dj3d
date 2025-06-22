import { Product, Order } from './types';

// This is a mock API module that would normally interact with a backend
// For now, it just uses local storage via the useLocalStorage hook in the App component

// Product API functions
export const fetchProducts = async (): Promise<Product[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    setTimeout(() => resolve(products), 500); // Simulate network delay
  });
};

export const createProduct = async (product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
  // In a real app, this would be an API call
  const newProduct = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  
  return new Promise((resolve) => {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const updatedProducts = [...products, newProduct];
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setTimeout(() => resolve(newProduct), 500);
  });
};

export const updateProduct = async (product: Product): Promise<Product> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const updatedProducts = products.map((p: Product) => p.id === product.id ? product : p);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setTimeout(() => resolve(product), 500);
  });
};

export const deleteProduct = async (id: string): Promise<void> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const updatedProducts = products.filter((p: Product) => p.id !== id);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setTimeout(() => resolve(), 500);
  });
};

// Order API functions
export const fetchOrders = async (): Promise<Order[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    setTimeout(() => resolve(orders), 500);
  });
};

export const updateOrderStatus = async (id: string, status: string): Promise<Order> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrder = orders.find((o: Order) => o.id === id);
    
    if (updatedOrder) {
      updatedOrder.status = status as any;
      const updatedOrders = orders.map((o: Order) => o.id === id ? updatedOrder : o);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setTimeout(() => resolve(updatedOrder), 500);
    } else {
      throw new Error('Order not found');
    }
  });
};

// Analytics API functions
export const fetchSalesStats = async (period: 'daily' | 'weekly' | 'monthly'): Promise<any> => {
  // In a real app, this would be an API call that returns sales statistics
  return new Promise((resolve) => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // Calculate total revenue
    const revenue = orders.reduce((sum: number, order: Order) => sum + order.total, 0);
    
    // Calculate other stats based on the period
    let periodRevenue = 0;
    const now = new Date();
    
    switch (period) {
      case 'daily':
        periodRevenue = orders
          .filter((order: Order) => {
            const orderDate = new Date(order.date);
            return orderDate.toDateString() === now.toDateString();
          })
          .reduce((sum: number, order: Order) => sum + order.total, 0);
        break;
      
      case 'weekly':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        
        periodRevenue = orders
          .filter((order: Order) => {
            const orderDate = new Date(order.date);
            return orderDate >= weekStart;
          })
          .reduce((sum: number, order: Order) => sum + order.total, 0);
        break;
      
      case 'monthly':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        periodRevenue = orders
          .filter((order: Order) => {
            const orderDate = new Date(order.date);
            return orderDate >= monthStart;
          })
          .reduce((sum: number, order: Order) => sum + order.total, 0);
        break;
    }
    
    setTimeout(() => resolve({
      totalRevenue: revenue,
      periodRevenue,
      orderCount: orders.length,
    }), 500);
  });
};