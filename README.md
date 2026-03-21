# 📚 KitobBozor — Telegram Mini App + Bot

## Fayl tuzilmasi
```
bookstore-webapp.html  ← Frontend (Telegram WebApp)
bot.js                 ← Telegram Bot (Telegraf.js)
server.js              ← Backend API (Express + MongoDB)
README.md              ← Ushbu hujjat
```

## O'rnatish
```bash
npm init -y
npm install telegraf express cors mongoose dotenv
```

## .env fayli
```
BOT_TOKEN=YOUR_BOT_TOKEN
ADMIN_ID=YOUR_TELEGRAM_ID
WEBAPP_URL=https://yourdomain.com
MONGODB_URI=mongodb+srv://...
ADMIN_SECRET_KEY=your_secret
PORT=3001
```

## Ishga tushirish
```bash
node server.js   # API (3001-port)
node bot.js      # Telegram bot
```
# bookstore-webapp.html → Vercel/Netlify ga joylang

## API Endpointlar
- GET  /api/books          — Kitoblar (filter: genre, search)
- POST /api/auth/login     — Telegram login
- GET  /api/user/profile   — Profil + cashback
- POST /api/orders         — Buyurtma berish
- GET  /api/orders         — Buyurtmalar tarixi
- GET  /admin/orders       — Admin: barcha buyurtmalar
- PATCH /admin/orders/:id/status — Status o'zgartirish

## Cashback tizimi
- Har xariddan 5% qaytadi
- Keyingi xaridda ishlatish mumkin
- Daraja: Bronze / Silver / Gold

## Kelajakda to'lov tizimi
Click.uz yoki Payme integratsiya uchun /api/payment/create endpoint tayyor qoldirilgan.
