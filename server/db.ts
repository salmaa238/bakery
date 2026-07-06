import fs from "fs";
import path from "path";
import mongoose from "mongoose";

const DATA_DIR = path.join(process.cwd(), "server", "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial/default products list
const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    name_ar: "كعكة الريد فيلفيت المخملية",
    name_en: "Red Velvet Dream",
    description_ar: "كعكة كلاسيكية رطبة بطبقات من الكريمة المخملية الفاخرة ونكهة الكاكاو الخفيفة.",
    description_en: "Classic moist red velvet layers filled with luxury cream cheese frosting and a touch of premium cocoa.",
    price: 28.0,
    category: "cakes",
    image: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    prepTime_ar: "24 ساعة",
    prepTime_en: "24 Hours",
    allergens_ar: "الحليب، الغلوتين، البيض",
    allergens_en: "Dairy, Gluten, Eggs",
    featured: true
  },
  {
    id: "prod-2",
    name_ar: "شوكولاتة فادج الغنية",
    name_en: "Chocolate Fudge Decadence",
    description_ar: "كعكة الشوكولاتة الداكنة الغنية بصلصة الفادج اللذيذة والمزينة بقطع الشوكولاتة البلجيكية.",
    description_en: "Rich dark chocolate cake layered with decadent fudge frosting and decorated with Belgian chocolate curls.",
    price: 32.0,
    category: "cakes",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    prepTime_ar: "12 ساعة",
    prepTime_en: "12 Hours",
    allergens_ar: "الحليب، الغلوتين، البيض",
    allergens_en: "Dairy, Gluten, Eggs",
    featured: true
  },
  {
    id: "prod-3",
    name_ar: "كعكة الفستق والزعفران الفاخرة",
    name_en: "Premium Pistachio Saffron",
    description_ar: "مزيج ملكي من الفستق الحلبي المطحون والزعفران الأصيل مع حشوة الكريمة الخفيفة.",
    description_en: "A royal blend of ground pistachios and authentic saffron layers with a light cardamom-infused cream.",
    price: 35.0,
    category: "cakes",
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    prepTime_ar: "24 ساعة",
    prepTime_en: "24 Hours",
    allergens_ar: "المكسرات، الحليب، الغلوتين",
    allergens_en: "Nuts, Dairy, Gluten",
    featured: true
  },
  {
    id: "prod-4",
    name_ar: "سيمفونية الفراولة والكريمة",
    name_en: "Strawberry Cream Symphony",
    description_ar: "كعكة إسفنجية خفيفة مغطاة بالفراولة الطازجة والكريمة المخفوقة الغنية.",
    description_en: "Light and airy sponge cake filled with fresh local strawberries and organic whipped cream.",
    price: 26.0,
    category: "cakes",
    image: "https://images.unsplash.com/photo-1464305795204-6f5bdf7f81b1?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    prepTime_ar: "6 ساعات",
    prepTime_en: "6 Hours",
    allergens_ar: "الحليب، البيض، الغلوتين",
    allergens_en: "Dairy, Eggs, Gluten",
    featured: false
  },
  {
    id: "prod-5",
    name_ar: "خبز العجين المخمر الحرفي",
    name_en: "Artisanal Sourdough Bread",
    description_ar: "خبز ريف كلاسيكي مخمر طبيعياً لمدة 36 ساعة لقشرة مقرمشة ولب طري ومثالي.",
    description_en: "Classic country sourdough bread naturally fermented for 36 hours for a crispy crust and soft, airy crumb.",
    price: 8.0,
    category: "bread",
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    prepTime_ar: "طازج يومياً",
    prepTime_en: "Fresh Daily",
    allergens_ar: "الغلوتين",
    allergens_en: "Gluten",
    featured: true
  },
  {
    id: "prod-6",
    name_ar: "كرواسون الزبدة الذهبي",
    name_en: "Golden Butter Croissant",
    description_ar: "كرواسون فرنسي هش غني بالزبدة الطبيعية الفاخرة ومحمص بلون ذهبي مثالي.",
    description_en: "Flaky, multi-layered French pastry baked with premium organic butter to a perfect golden finish.",
    price: 4.0,
    category: "bread",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    prepTime_ar: "طازج يومياً",
    prepTime_en: "Fresh Daily",
    allergens_ar: "الحليب، الغلوتين",
    allergens_en: "Dairy, Gluten",
    featured: true
  },
  {
    id: "prod-7",
    name_ar: "دانش البقلاوة بالفستق",
    name_en: "Pistachio Baklava Danish",
    description_ar: "معجنات دانش مقرمشة تدمج بين طياتها الفستق الحلبي المطحون والعسل الطبيعي بنكهة الشرق.",
    description_en: "Exquisite Danish pastry featuring a fusion of ground pistachio, honey, and orange blossom water.",
    price: 6.0,
    category: "bread",
    image: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    prepTime_ar: "طازج يومياً",
    prepTime_en: "Fresh Daily",
    allergens_ar: "المكسرات، الحليب، الغلوتين",
    allergens_en: "Nuts, Dairy, Gluten",
    featured: true
  },
  {
    id: "prod-8",
    name_ar: "لفائف القرفة والهيل الدافئة",
    name_en: "Warm Cinnamon Cardamom Swirl",
    description_ar: "لفائف هشة غنية بالقرفة العطرية ولمسة من الهيل الشرقي، مغطاة بطبقة من السكر الناعم.",
    description_en: "Soft swirled pastry filled with aromatic cinnamon and a hint of warm cardamom, glazed with sweet icing.",
    price: 5.0,
    category: "bread",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    prepTime_ar: "طازج يومياً",
    prepTime_en: "Fresh Daily",
    allergens_ar: "الحليب، الغلوتين",
    allergens_en: "Dairy, Gluten",
    featured: false
  }
];

// Read local database
const readDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: [],
      products: DEFAULT_PRODUCTS,
      orders: [],
      reservations: [],
      customCakes: [],
      reviews: [
        {
          id: "rev-1",
          userName: "سارة أحمد",
          rating: 5,
          text_ar: "كعكة الريد فيلفيت كانت مذهلة ورطبة جداً! الجميع في الحفلة أحبوها وسأطلب بالتأكيد مرة أخرى.",
          text_en: "The Red Velvet cake was absolutely stunning and so moist! Everyone loved it at the party.",
          date: "2026-06-28"
        },
        {
          id: "rev-2",
          userName: "طارق خالد",
          rating: 5,
          text_ar: "خبز العجين المخمر رائع وله قشرة مقرمشة مثالية. أفضل مخبز في المدينة بلا منازع.",
          text_en: "Sourdough bread is wonderful with a perfect crispy crust. Best bakery in town hands down.",
          date: "2026-07-02"
        },
        {
          id: "rev-3",
          userName: "Mona Wilson",
          rating: 4,
          text_ar: "كرواسون الزبدة خفيف وهش للغاية ومحمص بشكل رائع. نكهة الزبدة مميزة جداً.",
          text_en: "The butter croissants are super light, flaky, and beautifully baked. Highly recommend.",
          date: "2026-07-05"
        }
      ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database file, resetting to default:", err);
    return { users: [], products: DEFAULT_PRODUCTS, orders: [], reservations: [], customCakes: [], reviews: [] };
  }
};

// Write local database
const writeDB = (data: any) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
};

// Unified database operations wrapper (Local file JSON based)
export const db = {
  getCollection: (name: "users" | "products" | "orders" | "reservations" | "customCakes" | "reviews") => {
    const data = readDB();
    return data[name] || [];
  },
  
  saveToCollection: (name: "users" | "products" | "orders" | "reservations" | "customCakes" | "reviews", item: any) => {
    const data = readDB();
    if (!data[name]) data[name] = [];
    
    // Check if item has ID, if not create one
    if (!item.id && !item._id) {
      item.id = `${name.substring(0, 3)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    
    data[name].push(item);
    writeDB(data);
    return item;
  },

  updateInCollection: (name: "users" | "products" | "orders" | "reservations" | "customCakes" | "reviews", id: string, updates: any) => {
    const data = readDB();
    if (!data[name]) return null;
    
    const index = data[name].findIndex((x: any) => x.id === id || x._id === id);
    if (index === -1) return null;
    
    data[name][index] = { ...data[name][index], ...updates };
    writeDB(data);
    return data[name][index];
  },

  deleteFromCollection: (name: "users" | "products" | "orders" | "reservations" | "customCakes" | "reviews", id: string) => {
    const data = readDB();
    if (!data[name]) return false;
    
    const initialLen = data[name].length;
    data[name] = data[name].filter((x: any) => x.id !== id && x._id !== id);
    writeDB(data);
    return data[name].length < initialLen;
  }
};

// Connect to real MongoDB if URI is supplied
export const connectMongoDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log("ℹ️ No MONGODB_URI found in environment. Utilizing premium local JSON database adapter.");
    return false;
  }
  try {
    await mongoose.connect(uri);
    console.log("✅ Successfully connected to MongoDB Cloud Cluster via Mongoose.");
    return true;
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB, falling back to local JSON database. Error:", error);
    return false;
  }
};
