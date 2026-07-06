import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ar" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Nav & General
    app_name: "مخبز الخباز الذهبي",
    home: "الرئيسية",
    about: "من نحن",
    menu: "قائمة المنتجات",
    cakes: "الكعك الفاخر",
    bread: "الخبز والمعجنات",
    custom_cake: "صمم كعكتك",
    booking: "حجز طاولة",
    delivery: "التوصيل والطلب",
    contact: "اتصل بنا",
    dashboard: "لوحة التحكم",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    logout: "تسجيل الخروج",
    welcome: "مرحباً بكم في مخبزنا الحرفي",
    cart: "عربة التسوق",
    wishlist: "المفضلة",
    currency: "دولار",
    items: "عناصر",
    empty_cart: "عربة التسوق فارغة حالياً.",
    empty_wishlist: "المفضلة فارغة حالياً.",
    add_to_cart: "أضف إلى العربة",
    add_to_wishlist: "أضف للمفضلة",
    remove: "إزالة",
    checkout: "إتمام الطلب",
    close: "إغلاق",
    save: "حفظ",
    cancel: "إلغاء",
    loading: "جاري التحميل...",
    success: "تم بنجاح!",
    error: "حدث خطأ ما",
    phone: "رقم الهاتف",
    address: "العنوان",
    notes: "ملاحظات خاصة",
    actions: "الإجراءات",
    status: "الحالة",
    date: "التاريخ",

    // Home Page
    hero_title: "نخبز بحب، لنصنع السعادة يومياً",
    hero_subtitle: "مخبز الخباز الذهبي يقدم لك أشهى المعجنات والخبز الحرفي المصنوع يدوياً بأجود المكونات الطبيعية على مدار اليوم.",
    view_menu: "عرض القائمة كاملة",
    book_table: "احجز طاولتك الآن",
    our_categories: "أقسامنا المميزة",
    featured_products: "مختاراتنا المفضلة لكم",
    why_us: "لماذا يفضلنا الجميع؟",
    why_us_desc: "التميز في التفاصيل والمكونات الطبيعية 100% الطازجة كل صباح.",
    fresh_daily: "طازج يومياً",
    fresh_daily_desc: "نبدأ العجن والخبز قبل شروق الشمس لنضمن لك منتجات دافئة وهشة كل يوم.",
    premium_ingredients: "مكونات ممتازة",
    premium_ingredients_desc: "نستخدم زبدة بلجيكية فاخرة، وشوكولاتة بلجيكية، ودقيق عضوي نقي وخالي من الإضافات.",
    craftsmanship: "مهارة حرفية",
    craftsmanship_desc: "خبازونا يمتلكون عقوداً من الخبرة في صياغة المعجنات والخبز الإيطالي والفرنسي الكلاسيكي.",
    reviews_title: "آراء عملاء مخبزنا السعيدين",
    reviews_subtitle: "شهادات حقيقية من الأشخاص الذين يعشقون نكهاتنا الحرفية الطازجة.",
    write_review: "شاركنا رأيك وتجربتك",
    submit_review: "إرسال التقييم",

    // About Page
    about_story_title: "قصتنا وعشقنا للخبز",
    about_story_p1: "تأسس مخبز الخباز الذهبي من شغف عميق بالتقاليد الحرفية العريقة لإنتاج معجنات وخبز استثنائي. بدأت رحلتنا بموقد صغير ووصفة عائلية منقولة عبر الأجيال، واليوم نحن فخورون بمشاركة هذا العشق معكم.",
    about_story_p2: "نحن نؤمن بأن الخبز الجيد يتطلب الوقت، الصبر، والالتزام بأفضل المكونات. هذا هو السبب في أننا نقوم بتخمير الخبز الطبيعي لدينا لمدة 36 ساعة كاملة للحصول على نكهة وقشرة لا تضاهى.",
    meet_chefs: "طاقم الخبازين والطهاة لدينا",
    chef_1_title: "رئيس الطهاة والخبازين",
    chef_2_title: "شيف المعجنات والكعك",
    chef_3_title: "أخصائي خبز العجين المخمر",
    standards_title: "معايير الجودة المتميزة لدينا",
    standard_1: "لا نستخدم نكهات أو ملونات صناعية أبداً.",
    standard_2: "جميع الكعك يتم تصميمه وتزيينه يدوياً بعناية فائقة.",
    standard_3: "ندعم المزارع المحلية ونستخدم منتجاتها الموسمية الطازجة.",

    // Cake Builder (Custom Cake Orders)
    cake_builder_title: "صانع الكعك الحرفي الخاص بك",
    cake_builder_subtitle: "اختر المواصفات، النكهة، والحجم، وسيقوم خبازونا المهرة بتحويل كعكة أحلامك إلى حقيقة لذيذة ومبهرة.",
    cake_shape: "شكل الكعكة",
    cake_size: "الحجم (القطر)",
    cake_tiers: "عدد الطبقات",
    cake_flavor: "نكهة الكعكة الأساسية",
    cake_frosting: "نوع التزيين الخارجي (Frosting)",
    cake_toppings: "الإضافات العلوية والتزيين",
    cake_inscription: "الكتابة على الكعكة (مثال: عيد ميلاد سعيد)",
    delivery_date: "تاريخ الاستلام المطلوب",
    estimated_cost: "التكلفة التقديرية الفورية",
    builder_submit: "إرسال طلب الكعكة المخصصة",
    shape_round: "دائري كلاسيكي",
    shape_square: "مربع حديث",
    shape_heart: "قلب رومانسي",
    size_small: "صغير (6-8 أشخاص)",
    size_medium: "متوسط (12-16 شخصاً)",
    size_large: "كبير (20-25 شخصاً)",
    tiers_1: "طبقة واحدة",
    tiers_2: "طبقتين مميزتين",
    tiers_3: "3 طبقات فاخرة (للمناسبات الكبرى)",
    flavor_vanilla: "الفانيليا المدغشقرية الفاخرة",
    flavor_chocolate: "الشوكولاتة البلجيكية الغنية",
    flavor_redvelvet: "ريد فيلفيت كلاسيكي",
    flavor_pistachio: "فستق حلبي بالهيل والورد",
    frosting_buttercream: "كريمة الزبدة السويسرية الناعمة",
    frosting_creamcheese: "كريمة الجبن المخملية الغنية",
    frosting_ganache: "جناش الشوكولاتة الداكنة الكثيفة",
    topping_berries: "فواكه وتوت بري طازج",
    topping_macarons: "قطع الماكارون الملونة",
    topping_goldleaf: "رقاقات الذهب عيار 24 الصالحة للأكل",
    topping_flowers: "ورد طبيعي منسق صالح للأكل",
    topping_sprinkles: "حبوب حلوى ملونة وشوكولاتة مقرمشة",

    // Booking Page
    booking_title: "احجز طاولة في صالتنا الدافئة",
    booking_subtitle: "استمتع بقهوتنا المختصة الطازجة ومعجناتنا الساخنة مباشرة من الفرن في أجواء هادئة ومريحة.",
    num_guests: "عدد الضيوف والزوار",
    select_date: "اختر التاريخ المفضل",
    select_time: "اختر التوقيت المناسب",
    special_requests: "طلبات أو ترتيبات خاصة (مثل: احتفال ذكرى سنوية)",
    submit_booking: "تأكيد حجز الطاولة",
    booking_success: "تهانينا! تم إرسال طلب الحجز الخاص بك بنجاح وجاري مراجعته وتأكيده.",

    // Delivery & Checkout
    delivery_title: "خدمة التوصيل والطلب السريع",
    delivery_subtitle: "احصل على معجناتك الدافئة والخبز المقرمش والحلويات مباشرة إلى عتبة دارك بأعلى سرعة وجودة.",
    checkout_form_title: "تفاصيل عنوان الشحن والاتصال",
    checkout_phone_placeholder: "مثال: +966 50 000 0000",
    checkout_address_placeholder: "المدينة، الحي، اسم الشارع، رقم المبنى والشقة",
    order_notes_placeholder: "أي توجيهات خاصة للسائق أو خبازينا...",
    order_summary: "ملخص الفاتورة والطلب",
    subtotal: "المجموع الفرعي",
    delivery_fee: "رسوم التوصيل",
    total: "المجموع الكلي المتبقي للطلب",
    place_order: "إتمام الطلب والدفع نقداً عند الاستلام",
    delivery_success: "شكراً لك! تم تسجيل طلبك بنجاح. سيقوم فريقنا بالبدء في التجهيز فوراً.",
    delivery_type: "نوع الاستلام",
    delivery_type_home: "توصيل للمنزل",
    delivery_type_pickup: "استلام شخصي من المفرع",

    // Contact Page
    contact_title: "يسعدنا دائماً تواصلكم معنا",
    contact_subtitle: "لديك استفسار، رغبة في حجز حفل خاص، أو ملاحظة؟ فريقنا يسعد بمساعدتك طوال الوقت.",
    contact_info: "معلومات الاتصال والفروع",
    contact_address: "شارع التخصصي، تقاطع العروبة، الرياض، المملكة العربية السعودية",
    contact_phone_label: "رقم الهاتف المباشر",
    contact_email_label: "البريد الإلكتروني للإدارة",
    opening_hours: "أوقات عمل الأفران والصالة",
    weekdays: "السبت - الخميس: 6:00 صباحاً - 11:30 مساءً",
    friday: "الجمعة: 1:00 ظهراً - Midnight",
    contact_form_title: "أرسل رسالة مباشرة إلينا",
    contact_name: "الاسم الكامل",
    contact_email: "البريد الإلكتروني",
    contact_subject: "الموضوع",
    contact_message: "نص الرسالة أو الاستفسار التفصيلي",
    submit_message: "إرسال الرسالة الآن",
    message_success: "تم إرسال رسالتك بنجاح! سيقوم فريق خدمة العملاء بالتواصل معك خلال 24 ساعة.",

    // Authentication Page
    auth_title: "مرحباً بك في مجتمع الخباز الذهبي",
    auth_subtitle: "سجل الآن لتتبع طلباتك، وإدارة حجوزاتك، والحصول على عروض حصرية طوال العام.",
    email: "البريد الإلكتروني للمستخدم",
    password: "كلمة المرور السرية",
    name: "الاسم بالكامل",
    have_account: "لديك حساب بالفعل؟ سجل دخولك",
    no_account: "ليس لديك حساب؟ سجل حساباً جديداً",

    // Admin & Dashboard
    admin_title: "بوابة التحكم والإدارة الشاملة للمخبز",
    admin_subtitle: "إدارة المنتجات، الطلبات، حجوزات الصالة، وطلبات الكعك المخصص مع إحصائيات الأداء الحية.",
    tab_products: "إدارة المأكولات والمنتجات",
    tab_orders: "طلبات الشراء والزبائن",
    tab_reservations: "حجوزات الطاولات",
    tab_custom_cakes: "طلبات الكعك المخصص",
    add_new_product: "إضافة صنف جديد للقائمة",
    prod_name_ar: "اسم المنتج بالعربية",
    prod_name_en: "اسم المنتج بالإنجليزية",
    prod_desc_ar: "الوصف بالعربية",
    prod_desc_en: "الوصف بالإنجليزية",
    prod_price: "السعر بالدولار",
    prod_category: "القسم (cakes / bread)",
    prod_image: "رابط الصورة (URL)",
    prod_prep_ar: "وقت التحضير بالعربية",
    prod_prep_en: "وقت التحضير بالإنجليزية",
    prod_allergens_ar: "مسببات الحساسية بالعربية",
    prod_allergens_en: "مسببات الحساسية بالإنجليزية",
    prod_featured: "عرض كمنتج مميز في الرئيسية",
    total_sales: "إجمالي المبيعات المحققة",
    total_orders: "عدد الطلبات المستلمة",
    total_bookings: "عدد الحجوزات المؤكدة",
    total_custom_cakes: "طلبات الكعك المخصصة",
    sales_analytics: "تحليلات الأداء والمبيعات حية",
    product_list: "قائمة المنتجات الحالية في المتجر",
    no_orders: "لا يوجد طلبات مسجلة بعد.",
    no_reservations: "لا توجد حجوزات مسجلة حالياً.",
    no_custom: "لا توجد طلبات كعك مخصصة.",
    update_status: "تحديث الحالة الحالية",
    customer: "الزبون",
    items_count: "عدد العناصر",
    total_amount: "المبلغ الكلي",
    
    // Status badges translation
    status_pending: "معلق بانتظار المراجعة",
    status_baking: "جاري الخبز والتحضير 🥖",
    status_out_for_delivery: "خرج للتوصيل مع السائق 🛵",
    status_delivered: "تم التوصيل بنجاح ✅",
    status_cancelled: "ملغي ❌",
    status_confirmed: "تم التأكيد والموافقة ✅",
    status_quoted: "تم إرسال عرض السعر",
    status_design_approved: "تم اعتماد التصميم",
    status_ready_for_pickup: "جاهز للاستلام من المخبز 🧺",
    status_completed: "اكتمل بنجاح 🎉",
  },
  en: {
    // Nav & General
    app_name: "Golden Crust Bakery",
    home: "Home",
    about: "About",
    menu: "Menu",
    cakes: "Signature Cakes",
    bread: "Breads & Pastries",
    custom_cake: "Design Your Cake",
    booking: "Book a Table",
    delivery: "Delivery & Order",
    contact: "Contact Us",
    dashboard: "Admin Panel",
    login: "Login",
    register: "Register",
    logout: "Logout",
    welcome: "Welcome to Our Artisanal Bakery",
    cart: "Shopping Cart",
    wishlist: "Wishlist",
    currency: "USD",
    items: "items",
    empty_cart: "Your shopping cart is currently empty.",
    empty_wishlist: "Your wishlist is currently empty.",
    add_to_cart: "Add to Cart",
    add_to_wishlist: "Add to Wishlist",
    remove: "Remove",
    checkout: "Checkout",
    close: "Close",
    save: "Save",
    cancel: "Cancel",
    loading: "Loading...",
    success: "Successful!",
    error: "Something went wrong",
    phone: "Phone Number",
    address: "Address",
    notes: "Special Notes",
    actions: "Actions",
    status: "Status",
    date: "Date",

    // Home Page
    hero_title: "Baked with Love, Crafted for Happiness",
    hero_subtitle: "Golden Crust Bakery offers delicious handmade artisanal breads and pastries prepared daily using the finest natural premium ingredients.",
    view_menu: "View Full Menu",
    book_table: "Book Your Table Now",
    our_categories: "Our Categories",
    featured_products: "Our Chef's Special Selections",
    why_us: "Why Choose Us?",
    why_us_desc: "Perfection in every detail and 100% natural organic ingredients baked fresh every morning.",
    fresh_daily: "Freshly Baked Daily",
    fresh_daily_desc: "We start kneading and baking long before sunrise to guarantee warm, crispy, and fresh delights daily.",
    premium_ingredients: "Premium Ingredients",
    premium_ingredients_desc: "We use luxurious Belgian butter, premium dark chocolate, and organic pure unbleached flour.",
    craftsmanship: "Artisanal Mastery",
    craftsmanship_desc: "Our skilled bakers hold decades of experience crafting classic French, Italian, and oriental pastries.",
    reviews_title: "From Our Happy Customers",
    reviews_subtitle: "Real stories from people who appreciate our warm, fresh artisanal flavors.",
    write_review: "Write a Review",
    submit_review: "Submit Review",

    // About Page
    about_story_title: "Our Story & Baking Passion",
    about_story_p1: "Golden Crust Bakery was born out of a profound love for traditional baking crafts. Our journey began with a tiny stone oven and a timeless family recipe. Today, we are proud to share this dedication with our community.",
    about_story_p2: "We believe true, good bread requires patience and commitment. That is why our signature country sourdough is naturally fermented for a full 36 hours, securing an extraordinary crust and exceptional depth of flavor.",
    meet_chefs: "Meet Our Talented Bakers & Chefs",
    chef_1_title: "Master Head Baker",
    chef_2_title: "Pastry & Cake Artist",
    chef_3_title: "Sourdough Specialist",
    standards_title: "Our Uncompromised Quality Standards",
    standard_1: "No artificial flavors, preservatives, or colorings, ever.",
    standard_2: "Every single signature cake is meticulously hand-crafted and styled.",
    standard_3: "We support local farms and source fresh, seasonal organic produce.",

    // Cake Builder (Custom Cake Orders)
    cake_builder_title: "Artisanal Custom Cake Builder",
    cake_builder_subtitle: "Choose your specifications, flavor profile, and size, and our master bakers will turn your dream cake into a delicious, gorgeous reality.",
    cake_shape: "Cake Shape",
    cake_size: "Cake Size (Diameter)",
    cake_tiers: "Number of Tiers",
    cake_flavor: "Core Cake Flavor",
    cake_frosting: "External Frosting Type",
    cake_toppings: "Premium Toppings & Decor",
    cake_inscription: "Written Message on Cake (e.g. Happy Birthday)",
    delivery_date: "Requested Delivery Date",
    estimated_cost: "Instant Estimated Price",
    builder_submit: "Submit Custom Cake Request",
    shape_round: "Classic Round",
    shape_square: "Modern Square",
    shape_heart: "Romantic Heart",
    size_small: "Small (Feeds 6-8)",
    size_medium: "Medium (Feeds 12-16)",
    size_large: "Large (Feeds 20-25)",
    tiers_1: "Single Tier",
    tiers_2: "2 Distinct Tiers",
    tiers_3: "3 Grand Tiers (Large Events)",
    flavor_vanilla: "Madagascar Bourbon Vanilla",
    flavor_chocolate: "Rich Decadent Belgian Chocolate",
    flavor_redvelvet: "Traditional Red Velvet",
    flavor_pistachio: "Pistachio with Cardamom & Rose",
    frosting_buttercream: "Silky Swiss Meringue Buttercream",
    frosting_creamcheese: "Rich Velvet Cream Cheese",
    frosting_ganache: "Dense Dark Chocolate Ganache",
    topping_berries: "Fresh Local Berries & Strawberries",
    topping_macarons: "Assorted French Macarons",
    topping_goldleaf: "Edible 24K Gold Leaf Flakes",
    topping_flowers: "Fresh Hand-Picked Edible Flowers",
    topping_sprinkles: "Confetti Sprinkles & Chocolate Pearls",

    // Booking Page
    booking_title: "Reserve a Table in Our Cozy Salon",
    booking_subtitle: "Enjoy our freshly brewed specialty coffee and warm pastries straight from the oven in a cozy, relaxed setting.",
    num_guests: "Number of Guests",
    select_date: "Select Date",
    select_time: "Select Time Slot",
    special_requests: "Special Requests or Arrangements (e.g., Anniversary decoration)",
    submit_booking: "Confirm Table Reservation",
    booking_success: "Congratulations! Your reservation has been submitted. Our team is reviewing it for immediate confirmation.",

    // Delivery & Checkout
    delivery_title: "Fast Delivery & Easy Checkout",
    delivery_subtitle: "Receive warm freshly baked pastries and crispy breads delivered right to your doorstep in pristine condition.",
    checkout_form_title: "Delivery Details & Contact Info",
    checkout_phone_placeholder: "e.g., +966 50 000 0000",
    checkout_address_placeholder: "City, District, Street Name, Building & Apartment Number",
    order_notes_placeholder: "Any special instructions for our bakers or the driver...",
    order_summary: "Order Invoice Summary",
    subtotal: "Subtotal",
    delivery_fee: "Delivery Fee",
    total: "Total Order Amount",
    place_order: "Submit Order (Cash on Delivery)",
    delivery_success: "Thank you! Your order was placed successfully. Our bakers are preparing your warm goods now.",
    delivery_type: "Delivery Type",
    delivery_type_home: "Home Delivery",
    delivery_type_pickup: "In-Store Pickup",

    // Contact Page
    contact_title: "We'd Love to Hear From You",
    contact_subtitle: "Have a question, planning a custom corporate catering, or want to say hello? Our team is always here.",
    contact_info: "Our Location & Contact Info",
    contact_address: "Takhassusi St, Al Urubah Intersection, Riyadh, Saudi Arabia",
    contact_phone_label: "Direct Phone Line",
    contact_email_label: "Admin Email",
    opening_hours: "Our Opening Hours",
    weekdays: "Saturday - Thursday: 6:00 AM - 11:30 PM",
    friday: "Friday: 1:00 PM - Midnight",
    contact_form_title: "Send Us a Direct Message",
    contact_name: "Full Name",
    contact_email: "Email Address",
    contact_subject: "Subject",
    contact_message: "Detailed Message or Inquiry",
    submit_message: "Send Message Now",
    message_success: "Your message has been sent! Our support team will get in touch with you within 24 hours.",

    // Authentication Page
    auth_title: "Join the Golden Crust Family",
    auth_subtitle: "Create an account to track your orders, manage table bookings, and receive special culinary rewards.",
    email: "Email Address",
    password: "Password",
    name: "Full Name",
    have_account: "Already have an account? Login here",
    no_account: "Don't have an account? Sign up here",

    // Admin & Dashboard
    admin_title: "Bakery Administrative Dashboard",
    admin_subtitle: "Manage inventory, sales, tables, and bespoke custom cake reservations in real-time.",
    tab_products: "Menu Products",
    tab_orders: "Purchase Orders",
    tab_reservations: "Table Bookings",
    tab_custom_cakes: "Custom Cakes",
    add_new_product: "Add New Product to Menu",
    prod_name_ar: "Product Name (Arabic)",
    prod_name_en: "Product Name (English)",
    prod_desc_ar: "Description (Arabic)",
    prod_desc_en: "Description (English)",
    prod_price: "Price in USD",
    prod_category: "Category (cakes / bread)",
    prod_image: "Image URL",
    prod_prep_ar: "Prep Time (Arabic)",
    prod_prep_en: "Prep Time (English)",
    prod_allergens_ar: "Allergens (Arabic)",
    prod_allergens_en: "Allergens (English)",
    prod_featured: "Featured Product (Show on Home)",
    total_sales: "Total Gross Revenue",
    total_orders: "Total Orders Count",
    total_bookings: "Confirmed Table Bookings",
    total_custom_cakes: "Bespoke Custom Cakes",
    sales_analytics: "Sales & Performance Analytics",
    product_list: "Current Live Store Catalog",
    no_orders: "No purchase orders registered yet.",
    no_reservations: "No reservations found.",
    no_custom: "No custom cake requests found.",
    update_status: "Update Status",
    customer: "Customer",
    items_count: "Items",
    total_amount: "Total Price",

    // Status badges translation
    status_pending: "Pending Review",
    status_baking: "Baking & Prep 🥖",
    status_out_for_delivery: "Out for Delivery 🛵",
    status_delivered: "Delivered Successfully ✅",
    status_cancelled: "Cancelled ❌",
    status_confirmed: "Confirmed ✅",
    status_quoted: "Quoted Price Sent",
    status_design_approved: "Design Approved",
    status_ready_for_pickup: "Ready for Pickup 🧺",
    status_completed: "Completed Successfully 🎉",
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Arabic is default, load from localStorage if previously set
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("app_lang") as Language;
    return saved === "en" ? "en" : "ar";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app_lang", lang);
  };

  const isRtl = language === "ar";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
  }, [language, isRtl]);

  const t = (key: string): string => {
    const translation = translations[language][key];
    if (translation === undefined) {
      // Fallback to English if not found, or just the key
      return translations["en"][key] || key;
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
