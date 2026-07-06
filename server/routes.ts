import { Router, Request, Response, NextFunction } from "express";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { db } from "./db.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-change-this-in-production";

// Middleware to authenticate JWT tokens
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: "admin" | "user";
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  try {
    const decoded = jsonwebtoken.verify(token, JWT_SECRET) as AuthenticatedRequest["user"];
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Middleware to check if user is admin
export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ error: "Administrator rights required" });
    return;
  }
  next();
};

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

// Register
router.post("/auth/register", (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const users = db.getCollection("users");
    const existing = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }

    // First user registered becomes admin
    const role = users.length === 0 ? "admin" : "user";
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString()
    };

    const saved = db.saveToCollection("users", newUser);
    const token = jsonwebtoken.sign(
      { id: saved.id, email: saved.email, name: saved.name, role: saved.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: { id: saved.id, name: saved.name, email: saved.email, role: saved.role }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Registration failed" });
  }
});

// Login
router.post("/auth/login", (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const users = db.getCollection("users");
    const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const isValid = bcryptjs.compareSync(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = jsonwebtoken.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Login failed" });
  }
});

// Check Current User Profile
router.get("/auth/me", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: req.user });
});

// ==========================================
// PRODUCTS ENDPOINTS
// ==========================================

// Get all products
router.get("/products", (req: Request, res: Response) => {
  const products = db.getCollection("products");
  res.json(products);
});

// Create product (Admin)
router.post("/products", authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name_ar, name_en, description_ar, description_en, price, category, image, prepTime_ar, prepTime_en, allergens_ar, allergens_en, featured } = req.body;
    
    if (!name_ar || !name_en || !price || !category) {
      res.status(400).json({ error: "Name, price, and category are required" });
      return;
    }

    const newProduct = {
      name_ar,
      name_en,
      description_ar: description_ar || "",
      description_en: description_en || "",
      price: parseFloat(price),
      category,
      image: image || "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
      rating: 5.0,
      prepTime_ar: prepTime_ar || "طازج يومياً",
      prepTime_en: prepTime_en || "Fresh Daily",
      allergens_ar: allergens_ar || "",
      allergens_en: allergens_en || "",
      featured: !!featured
    };

    const saved = db.saveToCollection("products", newProduct);
    res.status(201).json(saved);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create product" });
  }
});

// Edit product (Admin)
router.put("/products/:id", authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.price) updates.price = parseFloat(updates.price);
    
    const updated = db.updateInCollection("products", id, updates);
    if (!updated) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update product" });
  }
});

// Delete product (Admin)
router.delete("/products/:id", authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const success = db.deleteFromCollection("products", id);
    if (!success) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete product" });
  }
});

// ==========================================
// ORDERS ENDPOINTS
// ==========================================

// Get user orders (or all if admin)
router.get("/orders", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const orders = db.getCollection("orders");
    if (req.user?.role === "admin") {
      res.json(orders);
    } else {
      const userOrders = orders.filter((o: any) => o.userId === req.user?.id);
      res.json(userOrders);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to retrieve orders" });
  }
});

// Submit order
router.post("/orders", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { items, totalAmount, shippingAddress, contactPhone, notes, deliveryType } = req.body;
    
    if (!items || items.length === 0 || !totalAmount || !shippingAddress || !contactPhone) {
      res.status(400).json({ error: "Missing required order checkout details" });
      return;
    }

    const newOrder = {
      userId: req.user?.id,
      userEmail: req.user?.email,
      userName: req.user?.name,
      items,
      totalAmount,
      shippingAddress,
      contactPhone,
      notes: notes || "",
      deliveryType: deliveryType || "delivery", // delivery, pickup
      status: "pending", // pending, baking, out_for_delivery, delivered, cancelled
      createdAt: new Date().toISOString()
    };

    const saved = db.saveToCollection("orders", newOrder);
    res.status(201).json(saved);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Checkout failed" });
  }
});

// Update order status (Admin)
router.put("/orders/:id", authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      res.status(400).json({ error: "Status is required" });
      return;
    }

    const updated = db.updateInCollection("orders", id, { status });
    if (!updated) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update order status" });
  }
});

// ==========================================
// RESERVATIONS ENDPOINTS
// ==========================================

// Get user reservations (or all if admin)
router.get("/reservations", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const reservations = db.getCollection("reservations");
    if (req.user?.role === "admin") {
      res.json(reservations);
    } else {
      const userReservations = reservations.filter((r: any) => r.userId === req.user?.id);
      res.json(userReservations);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to retrieve reservations" });
  }
});

// Book table
router.post("/reservations", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { date, time, guests, specialRequests, contactPhone } = req.body;
    
    if (!date || !time || !guests || !contactPhone) {
      res.status(400).json({ error: "All reservation fields are required" });
      return;
    }

    const newReservation = {
      userId: req.user?.id,
      userEmail: req.user?.email,
      userName: req.user?.name,
      date,
      time,
      guests: parseInt(guests),
      contactPhone,
      specialRequests: specialRequests || "",
      status: "pending", // pending, confirmed, cancelled
      createdAt: new Date().toISOString()
    };

    const saved = db.saveToCollection("reservations", newReservation);
    res.status(201).json(saved);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Booking failed" });
  }
});

// Update reservation status (Admin)
router.put("/reservations/:id", authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      res.status(400).json({ error: "Status is required" });
      return;
    }

    const updated = db.updateInCollection("reservations", id, { status });
    if (!updated) {
      res.status(404).json({ error: "Reservation not found" });
      return;
    }
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update reservation" });
  }
});

// ==========================================
// CUSTOM CAKE ORDERS ENDPOINTS
// ==========================================

// Get user custom cakes (or all if admin)
router.get("/custom-cakes", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const cakes = db.getCollection("customCakes");
    if (req.user?.role === "admin") {
      res.json(cakes);
    } else {
      const userCakes = cakes.filter((c: any) => c.userId === req.user?.id);
      res.json(userCakes);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to retrieve custom cake orders" });
  }
});

// Place custom cake order
router.post("/custom-cakes", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { shape, size, tiers, flavor, frosting, toppings, inscription, dateNeeded, phone, estimatedPrice } = req.body;
    
    if (!shape || !size || !tiers || !flavor || !frosting || !dateNeeded || !phone) {
      res.status(400).json({ error: "Missing required specifications for custom cake builder" });
      return;
    }

    const newCustomCake = {
      userId: req.user?.id,
      userEmail: req.user?.email,
      userName: req.user?.name,
      shape,
      size,
      tiers,
      flavor,
      frosting,
      toppings: toppings || [],
      inscription: inscription || "",
      dateNeeded,
      phone,
      estimatedPrice,
      status: "pending", // pending, quoted, design_approved, baking, ready_for_pickup, completed, cancelled
      createdAt: new Date().toISOString()
    };

    const saved = db.saveToCollection("customCakes", newCustomCake);
    res.status(201).json(saved);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to submit custom cake order" });
  }
});

// Update custom cake status (Admin)
router.put("/custom-cakes/:id", authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, finalPrice } = req.body;
    
    if (!status) {
      res.status(400).json({ error: "Status is required" });
      return;
    }

    const updates: any = { status };
    if (finalPrice !== undefined) updates.estimatedPrice = parseFloat(finalPrice);

    const updated = db.updateInCollection("customCakes", id, updates);
    if (!updated) {
      res.status(404).json({ error: "Custom cake order not found" });
      return;
    }
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update custom cake status" });
  }
});

// ==========================================
// REVIEWS ENDPOINTS
// ==========================================

// Get all general customer reviews
router.get("/reviews", (req: Request, res: Response) => {
  const reviews = db.getCollection("reviews");
  res.json(reviews);
});

// Post a review
router.post("/reviews", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { rating, text_ar, text_en } = req.body;
    if (!rating || (!text_ar && !text_en)) {
      res.status(400).json({ error: "Rating and feedback text are required" });
      return;
    }

    const newReview = {
      userName: req.user?.name || "عميل سعيد",
      rating: parseInt(rating),
      text_ar: text_ar || text_en,
      text_en: text_en || text_ar,
      date: new Date().toISOString().split("T")[0]
    };

    const saved = db.saveToCollection("reviews", newReview);
    res.status(201).json(saved);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to submit review" });
  }
});

export default router;
