// ═══════════════════════════════════════════════════════
//  KitobBozor — Backend API (Node.js + Express)
//  npm install express cors mongoose dotenv jsonwebtoken
// ═══════════════════════════════════════════════════════

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const crypto = require("crypto");
const { notifyNewOrder } = require("./bot");

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.WEBAPP_URL }));
app.use("/covers", express.static("public/covers"));

// ──────────────────────────────────────────────────────
// MongoDB ulanish
// ──────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://avrangzebabdujalilov_db_user:<mPM6jbIxlWQRiDQq>@cluster0.macklne.mongodb.net/bir-ilm-kitob?appName=Cluster0");

const SEED_BOOKS = [
  { title: "O'tkan kunlar", author: "Abdulla Qodiriy", price: 35000, genre: "Roman", description: "O'zbek adabiyotining durdonasi. Otabek va Kumush muhabbati haqida tarixiy roman.", emoji: "📗", badge: "Bestseller", grad: "linear-gradient(135deg,#1a4a2e,#2d8a5a)", image: "https://picsum.photos/seed/birilm-otkan/320/460" },
  { title: "Mehrobdan chayon", author: "Abdulla Qodiriy", price: 32000, genre: "Roman", description: "Anvar va Ra'no muhabbati, mansab va xiyonat to'qnashuvi haqida dramatik roman.", emoji: "📘", grad: "linear-gradient(135deg,#1a2a4a,#2d5a8a)", image: "https://picsum.photos/seed/birilm-mehrob/320/460" },
  { title: "Sariq devni minib", author: "Xudoiberdi To'xtaboyev", price: 28000, genre: "Bolalar", description: "Bolalar uchun sarguzasht hikoya. Quvnoq va ta'limli.", badge: "new", emoji: "📙", grad: "linear-gradient(135deg,#4a2a1a,#8a5a2d)", image: "https://picsum.photos/seed/birilm-sariq/320/460" },
  { title: "Atomic Habits", author: "James Clear", price: 65000, genre: "Motivatsiya", description: "Kichik o'zgarishlar qanday qilib katta natijalar berishi haqida amaliy qo'llanma.", badge: "Yangi", emoji: "📕", grad: "linear-gradient(135deg,#4a1a1a,#8a2d2d)", image: "https://picsum.photos/seed/birilm-atomic/320/460" },
  { title: "Qorajon", author: "Nazar Eshonqul", price: 24000, genre: "Hikoya", description: "Zamonaviy o'zbek nasri namunasi. Oddiy insonlar hayotidan olgan qissalar.", emoji: "📔", grad: "linear-gradient(135deg,#2a1a4a,#5a2d8a)", image: "https://picsum.photos/seed/birilm-qorajon/320/460" },
  { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", price: 72000, genre: "Moliya", description: "Pul haqidagi fikrlashni o'zgartiruvchi eng mashhur moliyaviy kitob.", badge: "Bestseller", emoji: "📒", grad: "linear-gradient(135deg,#1a3a1a,#2d6a2d)", image: "https://picsum.photos/seed/birilm-richdad/320/460" },
  { title: "1984", author: "George Orwell", price: 45000, genre: "Roman", description: "Totalitar jamiyat haqida eng mashhur distopik roman.", emoji: "📓", grad: "linear-gradient(135deg,#1a1a1a,#3a3a3a)", image: "https://picsum.photos/seed/birilm-1984/320/460" },
  { title: "Hobbi", author: "J.R.R. Tolkien", price: 55000, genre: "Fantasy", description: "Bilbo Begginzning ajoyib safari — dunglar, iblislar va ajdar Smaug bilan.", badge: "new", emoji: "📃", grad: "linear-gradient(135deg,#1a3a2a,#2d6a4a)", image: "https://picsum.photos/seed/birilm-hobbi/320/460" },
  { title: "Iqtisodiyot asoslari", author: "N.G. Mansur", price: 38000, genre: "Iqtisod", description: "Iqtisodiyot bo'yicha zamonaviy darslik. Talabalar uchun ideal.", emoji: "📜", grad: "linear-gradient(135deg,#2a2a1a,#6a6a2d)", image: "https://picsum.photos/seed/birilm-iqtisod/320/460" },
  { title: "Kimyo sirlari", author: "U. Nazarov", price: 42000, genre: "Fan", description: "Kimyo fanining asosiy qonunlari va reaksiyalari haqida qiziqarli mazmun.", badge: "new", emoji: "📋", grad: "linear-gradient(135deg,#1a2a3a,#2d4a6a)", image: "https://picsum.photos/seed/birilm-kimyo/320/460" },
];

// ──────────────────────────────────────────────────────
// Schemalar
// ──────────────────────────────────────────────────────
const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  price: Number,
  genre: String,
  description: String,
  image: String, // to'liq URL yoki /covers/kitob.jpg (static)
  emoji: String,
  grad: String, // ixtiyoriy gradient (rasm bo'lmasa)
  badge: String,
  inStock: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema({
  tg_id: { type: Number, unique: true },
  first_name: String,
  username: String,
  cashback_balance: { type: Number, default: 0 },
  total_spent: { type: Number, default: 0 },
  orders_count: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const OrderSchema = new mongoose.Schema({
  order_id: String,
  user_tg_id: Number,
  customer_name: String,
  phone: String,
  address: String,
  items: [
    {
      book_id: mongoose.Schema.Types.ObjectId,
      title: String,
      qty: Number,
      price: Number,
      total: Number,
    },
  ],
  subtotal: Number,
  cashback_used: Number,
  total: Number,
  cashback_earned: Number,
  status: {
    type: String,
    enum: ["pending", "confirmed", "processing", "delivered", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const Book = mongoose.model("Book", BookSchema);
const User = mongoose.model("User", UserSchema);
const Order = mongoose.model("Order", OrderSchema);

mongoose.connection.once("open", async () => {
  try {
    const n = await Book.countDocuments();
    if (n === 0) {
      await Book.insertMany(SEED_BOOKS);
      console.log("📚 MongoDB: boshlang'ich 10 ta kitob (rasmlar bilan) yuklandi");
    }
  } catch (e) {
    console.error("Kitoblar seed xatosi:", e.message);
  }
});

// ──────────────────────────────────────────────────────
// Telegram initData tekshirish (xavfsizlik)
// ──────────────────────────────────────────────────────
function verifyTelegramData(initData) {
  if (process.env.NODE_ENV === "development") return true; // dev da o'tkazib yuboriladi
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get("hash");
    params.delete("hash");
    const dataCheckString = [...params.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join("\n");
    const secretKey = crypto
      .createHmac("sha256", "WebAppData")
      .update(process.env.BOT_TOKEN)
      .digest();
    const computedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");
    return computedHash === hash;
  } catch {
    return false;
  }
}

// Auth middleware
function authMiddleware(req, res, next) {
  const initData = req.headers["x-telegram-init-data"];
  if (!initData || !verifyTelegramData(initData)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const params = new URLSearchParams(initData);
  req.tgUser = JSON.parse(params.get("user") || "{}");
  next();
}

// ──────────────────────────────────────────────────────
// ROUTES: Kitoblar
// ──────────────────────────────────────────────────────
// GET /api/books?genre=Roman&search=qodiriy&minPrice=10000&maxPrice=100000
app.get("/api/books", async (req, res) => {
  try {
    const { genre, search, minPrice, maxPrice } = req.query;
    const filter = { inStock: true };
    if (genre && genre !== "Barchasi") filter.genre = genre;
    if (search) filter.$or = [
      { title: new RegExp(search, "i") },
      { author: new RegExp(search, "i") },
    ];
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: books });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/books/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ error: "Kitob topilmadi" });
  res.json({ success: true, data: book });
});

// ──────────────────────────────────────────────────────
// ROUTES: Foydalanuvchi
// ──────────────────────────────────────────────────────
// POST /api/auth/login — Telegram WebApp initData bilan login
app.post("/api/auth/login", async (req, res) => {
  const { initData } = req.body;
  if (!verifyTelegramData(initData)) {
    return res.status(401).json({ error: "Invalid Telegram data" });
  }
  const params = new URLSearchParams(initData);
  const tgUser = JSON.parse(params.get("user") || "{}");

  let user = await User.findOne({ tg_id: tgUser.id });
  if (!user) {
    user = await User.create({
      tg_id: tgUser.id,
      first_name: tgUser.first_name,
      username: tgUser.username,
    });
  }
  res.json({ success: true, data: user });
});

// GET /api/user/profile
app.get("/api/user/profile", authMiddleware, async (req, res) => {
  const user = await User.findOne({ tg_id: req.tgUser.id });
  if (!user) return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
  res.json({ success: true, data: user });
});

// ──────────────────────────────────────────────────────
// ROUTES: Buyurtmalar
// ──────────────────────────────────────────────────────
// POST /api/orders — yangi buyurtma
app.post("/api/orders", authMiddleware, async (req, res) => {
  try {
    const { customer_name, phone, address, items, use_cashback } = req.body;

    if (!customer_name || !phone || !address || !items?.length) {
      return res.status(400).json({ error: "Barcha maydonlar to'ldirilishi kerak" });
    }

    // Foydalanuvchini topish
    const user = await User.findOne({ tg_id: req.tgUser.id });
    if (!user) return res.status(404).json({ error: "Foydalanuvchi topilmadi" });

    // Narxlarni hisoblash (frontend narxiga ishonmang!)
    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const book = await Book.findById(item.book_id);
      if (!book) return res.status(400).json({ error: `Kitob topilmadi: ${item.book_id}` });
      const itemTotal = book.price * item.qty;
      subtotal += itemTotal;
      orderItems.push({ book_id: book._id, title: book.title, qty: item.qty, price: book.price, total: itemTotal });
    }

    // Cashback hisoblash
    const CASHBACK_RATE = 0.05;
    let cashback_used = 0;
    if (use_cashback && user.cashback_balance > 0) {
      cashback_used = Math.min(user.cashback_balance, subtotal);
    }
    const total = subtotal - cashback_used;
    const cashback_earned = Math.round(total * CASHBACK_RATE);

    // Order ID yaratish
    const order_id = "ORD-" + Date.now().toString().slice(-6);

    // Order saqlash
    const order = await Order.create({
      order_id,
      user_tg_id: req.tgUser.id,
      customer_name,
      phone,
      address,
      items: orderItems,
      subtotal,
      cashback_used,
      total,
      cashback_earned,
    });

    // Foydalanuvchi balansini yangilash
    await User.updateOne(
      { tg_id: req.tgUser.id },
      {
        $inc: {
          cashback_balance: cashback_earned - cashback_used,
          total_spent: total,
          orders_count: 1,
        },
      }
    );

    // Bot orqali xabar yuborish
    await notifyNewOrder({
      order_id,
      tg_user_id: req.tgUser.id,
      customer_name,
      phone,
      address,
      items: orderItems,
      total,
      cashback_earned,
      cashback_used,
    });

    res.json({ success: true, data: { order_id, total, cashback_earned } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders — foydalanuvchi buyurtmalari
app.get("/api/orders", authMiddleware, async (req, res) => {
  const orders = await Order.find({ user_tg_id: req.tgUser.id }).sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
});

// ──────────────────────────────────────────────────────
// ADMIN ROUTES (alohida autentifikatsiya kerak)
// ──────────────────────────────────────────────────────
function adminAuth(req, res, next) {
  const key = req.headers["x-admin-key"];
  if (key !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}

// GET /admin/orders
app.get("/admin/orders", adminAuth, async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = status ? { status } : {};
  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  const total = await Order.countDocuments(filter);
  res.json({ success: true, data: orders, total, page: Number(page) });
});

// PATCH /admin/orders/:id/status
app.patch("/admin/orders/:id/status", adminAuth, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["pending", "confirmed", "processing", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Noto'g'ri status" });
  }
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return res.status(404).json({ error: "Buyurtma topilmadi" });
  res.json({ success: true, data: order });
});

// Admin: kitob qo'shish
app.post("/admin/books", adminAuth, async (req, res) => {
  const book = await Book.create(req.body);
  res.json({ success: true, data: book });
});

// Admin: kitob tahrirlash
app.put("/admin/books/:id", adminAuth, async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: book });
});

// ──────────────────────────────────────────────────────
// Health check
// ──────────────────────────────────────────────────────
app.get("/health", (req, res) => res.json({ ok: true, service: "KitobBozor API" }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server: http://localhost:${PORT}`));
