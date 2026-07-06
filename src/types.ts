export interface Product {
  id: string;
  _id?: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  category: string; // cakes | bread
  image: string;
  rating: number;
  prepTime_ar: string;
  prepTime_en: string;
  allergens_ar: string;
  allergens_en: string;
  featured: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  token?: string;
}

export interface OrderItem {
  productId: string;
  name_en: string;
  name_ar: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  _id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  contactPhone: string;
  notes?: string;
  deliveryType: "delivery" | "pickup";
  status: "pending" | "baking" | "out_for_delivery" | "delivered" | "cancelled";
  createdAt: string;
}

export interface Reservation {
  id: string;
  _id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  date: string;
  time: string;
  guests: number;
  contactPhone: string;
  specialRequests?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface CustomCakeOrder {
  id: string;
  _id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  shape: string;
  size: string;
  tiers: string;
  flavor: string;
  frosting: string;
  toppings: string[];
  inscription: string;
  dateNeeded: string;
  phone: string;
  estimatedPrice: number;
  status: "pending" | "quoted" | "design_approved" | "baking" | "ready_for_pickup" | "completed" | "cancelled";
  createdAt: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  text_ar: string;
  text_en: string;
  date: string;
}
