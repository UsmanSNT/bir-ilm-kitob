// ═══════════════════════════════════════════════════════
//  KitobBozor — Telegram Bot (Node.js + Telegraf v4)
//  npm install telegraf dotenv
// ═══════════════════════════════════════════════════════

require('dotenv').config();
const { Telegraf, Markup, session } = require('telegraf');

const BOT_TOKEN  = process.env.BOT_TOKEN;   // @BotFather dan olingan token
const ADMIN_ID   = process.env.ADMIN_ID;    // Admin Telegram ID (raqam)
const WEBAPP_URL = process.env.WEBAPP_URL;  // https://yourdomain.com

const bot = new Telegraf(BOT_TOKEN);
bot.use(session());

// ──────────────────────────────────────────────────────
// /start
// ──────────────────────────────────────────────────────
bot.start(async (ctx) => {
  const name = ctx.from.first_name || "Do'stim";
  await ctx.replyWithMarkdown(
    `📚 *Assalomu alaykum, ${name}!*\n\n` +
    `*KitobBozor*ga xush kelibsiz! 🎉\n\n` +
    `📖 Eng sara kitoblar bir joyda\n` +
    `💰 Har xariddan *5% cashback*\n` +
    `🚚 Bepul yetkazib berish\n\n` +
    `Quyidagi tugmani bosing 👇`,
    Markup.inlineKeyboard([
      [Markup.button.webApp("🛍️ Do'konga kirish", WEBAPP_URL)],
      [
        Markup.button.callback("📦 Buyurtmalarim", "my_orders"),
        Markup.button.callback("💰 Cashback", "my_cashback"),
      ],
      [Markup.button.callback("❓ Yordam", "help")],
    ])
  );
});

// ──────────────────────────────────────────────────────
// Callback queries
// ──────────────────────────────────────────────────────
bot.action("my_orders", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.replyWithMarkdown(
    `📦 *Sizning buyurtmalaringiz:*\n\n` +
    `1️⃣ #ORD-2341 — O'tkan kunlar + 1984\n   ✅ Yetkazildi | 80,000 so'm\n\n` +
    `2️⃣ #ORD-2298 — Rich Dad Poor Dad\n   ✅ Yetkazildi | 72,000 so'm\n\n` +
    `3️⃣ #ORD-2187 — Atomic Habits + Hobbi\n   ⏳ Kutilmoqda | 120,000 so'm`,
    Markup.inlineKeyboard([[Markup.button.webApp("📱 WebApp ochish", WEBAPP_URL)]])
  );
});

bot.action("my_cashback", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.replyWithMarkdown(
    `💰 *Cashback balansingiz:*\n\n` +
    `🟡 Mavjud: *12,500 so'm*\n` +
    `📈 Jami yig'ilgan: *25,000 so'm*\n` +
    `🔥 Daraja: *Silver 🥈*\n\n` +
    `_Har xariddan 5% cashback qaytadi._`
  );
});

bot.action("help", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.replyWithMarkdown(
    `❓ *KitobBozor — Yordam*\n\n` +
    `1. "Do'konga kirish" tugmasini bosing\n` +
    `2. Kitobni tanlang → Savatga qo'shing\n` +
    `3. Ma'lumotlarni kiriting\n` +
    `4. Buyurtma bering!\n\n` +
    `📞 Yordam: @support_username`
  );
});

// ──────────────────────────────────────────────────────
// Admin: status o'zgartirish
// ──────────────────────────────────────────────────────
bot.action(/confirm_(.+)/, async (ctx) => {
  const id = ctx.match[1];
  await ctx.answerCbQuery("✅ Tasdiqlandi!");
  await ctx.reply(`✅ Buyurtma #${id} tasdiqlandi!`);
  // TODO: DB da statusni 'confirmed' ga o'zgartiring
  // TODO: Foydalanuvchiga xabar yuboring
});

bot.action(/deliver_(.+)/, async (ctx) => {
  const id = ctx.match[1];
  await ctx.answerCbQuery("🚚 Yetkazildi!");
  await ctx.reply(`🚚 Buyurtma #${id} yetkazildi!`);
  // TODO: DB da statusni 'delivered' ga o'zgartiring
});

bot.action(/cancel_(.+)/, async (ctx) => {
  const id = ctx.match[1];
  await ctx.answerCbQuery("❌ Bekor qilindi");
  await ctx.reply(`❌ Buyurtma #${id} bekor qilindi.`);
});

// ──────────────────────────────────────────────────────
// Yangi buyurtma kelganda chaqiriladigan funksiya
// Express API dan chaqiriladi
// ──────────────────────────────────────────────────────
async function notifyNewOrder(order) {
  const fmt = (n) => new Intl.NumberFormat("uz-UZ").format(n);

  // Foydalanuvchiga tasdiq
  await bot.telegram.sendMessage(
    order.tg_user_id,
    `✅ *Buyurtmangiz qabul qilindi!*\n\n` +
    `📋 Buyurtma *#${order.order_id}*\n\n` +
    order.items.map((i) => `📖 ${i.title} × ${i.qty}`).join("\n") +
    `\n\n💵 *Jami: ${fmt(order.total)} so'm*\n` +
    `📍 Manzil: ${order.address}\n\n` +
    `⏳ Tez orada yetkazib beramiz!\n` +
    `💰 +${fmt(order.cashback_earned)} cashback hisoblandi 🎉`,
    { parse_mode: "Markdown" }
  );

  // Adminga xabar
  await bot.telegram.sendMessage(
    ADMIN_ID,
    `🔔 *YANGI BUYURTMA!*\n\n` +
    `🆔 #${order.order_id}\n` +
    `👤 ${order.customer_name}\n` +
    `📱 ${order.phone}\n` +
    `📍 ${order.address}\n\n` +
    `📦 Kitoblar:\n` +
    order.items.map((i) => `  • ${i.title} × ${i.qty}`).join("\n") +
    `\n\n💵 Jami: ${fmt(order.total)} so'm`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback("✅ Tasdiqlash", `confirm_${order.order_id}`),
          Markup.button.callback("❌ Bekor", `cancel_${order.order_id}`),
        ],
        [Markup.button.callback("🚚 Yetkazildi", `deliver_${order.order_id}`)],
      ]),
    }
  );
}

bot.on("message", async (ctx) => {
  await ctx.reply(
    "Xarid uchun do'konni oching:",
    Markup.inlineKeyboard([[Markup.button.webApp("🛍️ KitobBozor", WEBAPP_URL)]])
  );
});

bot.launch().then(() => console.log("🤖 Bot ishga tushdi!"));
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

module.exports = { notifyNewOrder };
