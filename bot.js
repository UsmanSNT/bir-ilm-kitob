// ═══════════════════════════════════════════════════════
//  Bir Ilm Kitob — Telegram Bot
//  npm install telegraf
// ═══════════════════════════════════════════════════════

const { Telegraf, Markup } = require("telegraf");

const BOT_TOKEN  = "6267861891:AAF0EjKPTa7e4ediOVNCgGbGn8bJIwDzeDw";
const ADMIN_ID   = 917583027;
const WEBAPP_URL = "https://bir-ilm-kitob.vercel.app";

const bot = new Telegraf(BOT_TOKEN);

// ──────────────────────────────────────────────────────
// /start — Asosiy menyu
// ──────────────────────────────────────────────────────
bot.start(async (ctx) => {
  const name = ctx.from.first_name || "Do'stim";
  await ctx.replyWithMarkdown(
    `📚 *Assalomu alaykum, ${name}!*\n\n` +
    `*Bir Ilm Kitob* do'koniga xush kelibsiz! 🎉\n\n` +
    `📖 *Bizda nima bor?*\n` +
    `• O'zbek va xorijiy kitoblar\n` +
    `• Darsliklar va qo'llanmalar\n` +
    `• Bolalar adabiyoti\n` +
    `• Motivatsion kitoblar\n\n` +
    `💰 Har xariddan *5% cashback*\n` +
    `🚚 *Bepul* yetkazib berish\n` +
    `✅ Tez va ishonchli xizmat\n\n` +
    `👇 Quyidagi tugmani bosib xarid boshlang!`,
    Markup.inlineKeyboard([
      [Markup.button.webApp("🛍️  Do'konga kirish", WEBAPP_URL)],
      [
        Markup.button.callback("📦 Buyurtmalarim", "my_orders"),
        Markup.button.callback("💰 Cashback", "my_cashback"),
      ],
      [
        Markup.button.callback("ℹ️ Bot haqida", "about"),
        Markup.button.callback("❓ Yordam", "help"),
      ],
    ])
  );
});

// ──────────────────────────────────────────────────────
// /about — Bot haqida
// ──────────────────────────────────────────────────────
bot.command("about", async (ctx) => {
  await ctx.replyWithMarkdown(
    `ℹ️ *Bir Ilm Kitob — Bot haqida*\n\n` +
    `🤖 *Bot nomi:* Bir Ilm Kitob Bot\n` +
    `🏪 *Do'kon:* Bir Ilm Kitob\n` +
    `🌐 *Sayt:* [bir-ilm-kitob.vercel.app](${WEBAPP_URL})\n\n` +
    `📌 *Imkoniyatlar:*\n` +
    `• Online kitob xarid qilish\n` +
    `• Savat va buyurtma tizimi\n` +
    `• Cashback tizimi (5%)\n` +
    `• Buyurtma holati kuzatish\n` +
    `• Shaxsiy dashboard\n\n` +
    `⚙️ *Versiya:* 1.0.0\n` +
    `📅 *Ishga tushgan:* 2025-yil\n\n` +
    `_Barcha huquqlar himoyalangan © Bir Ilm Kitob_`
  );
});

// ──────────────────────────────────────────────────────
// /help — Yordam
// ──────────────────────────────────────────────────────
bot.command("help", async (ctx) => {
  await ctx.replyWithMarkdown(
    `❓ *Yordam — Qo'llanma*\n\n` +
    `*📱 Qanday xarid qilish mumkin?*\n` +
    `1️⃣ "Do'konga kirish" tugmasini bosing\n` +
    `2️⃣ Kitobni tanlang\n` +
    `3️⃣ Savatga qo'shing\n` +
    `4️⃣ Ma'lumotlaringizni kiriting\n` +
    `5️⃣ Buyurtma bering!\n\n` +
    `*💰 Cashback nima?*\n` +
    `Har xaridingizdan 5% qaytariladi.\n` +
    `Keyingi xaridda chegirma sifatida ishlatiladi.\n\n` +
    `*📦 Yetkazib berish?*\n` +
    `Toshkent bo'ylab bepul yetkazib beramiz.\n` +
    `Buyurtmadan 1-2 kun ichida.\n\n` +
    `*📞 Muammo bo'lsa:*\n` +
    `Admin: @birilmkitob_admin\n` +
    `Tel: +998 90 000 00 00\n\n` +
    `⏰ Ish vaqti: 09:00 — 21:00`
  );
});

// ──────────────────────────────────────────────────────
// Callback: Bot haqida
// ──────────────────────────────────────────────────────
bot.action("about", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.replyWithMarkdown(
    `ℹ️ *Bir Ilm Kitob — Bot haqida*\n\n` +
    `🤖 *Bot nomi:* Bir Ilm Kitob Bot\n` +
    `🏪 *Do'kon:* Bir Ilm Kitob\n` +
    `🌐 *Sayt:* [bir-ilm-kitob.vercel.app](${WEBAPP_URL})\n\n` +
    `📌 *Imkoniyatlar:*\n` +
    `• Online kitob xarid qilish\n` +
    `• Savat va buyurtma tizimi\n` +
    `• Cashback tizimi (5%)\n` +
    `• Buyurtma holati kuzatish\n` +
    `• Shaxsiy dashboard\n\n` +
    `⚙️ *Versiya:* 1.0.0\n\n` +
    `_Barcha huquqlar himoyalangan © Bir Ilm Kitob_`,
    Markup.inlineKeyboard([
      [Markup.button.webApp("🛍️ Do'konga kirish", WEBAPP_URL)]
    ])
  );
});

// ──────────────────────────────────────────────────────
// Callback: Buyurtmalarim
// ──────────────────────────────────────────────────────
bot.action("my_orders", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.replyWithMarkdown(
    `📦 *Buyurtmalaringiz*\n\n` +
    `Barcha buyurtmalarni ko'rish uchun\n` +
    `do'konni oching 👇`,
    Markup.inlineKeyboard([
      [Markup.button.webApp("📱 Buyurtmalarni ko'rish", WEBAPP_URL)]
    ])
  );
});

// ──────────────────────────────────────────────────────
// Callback: Cashback
// ──────────────────────────────────────────────────────
bot.action("my_cashback", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.replyWithMarkdown(
    `💰 *Cashback tizimi*\n\n` +
    `🎁 Har xariddan *5%* qaytariladi\n` +
    `🛒 Keyingi xaridda chegirma\n` +
    `📈 Qancha ko'p xarid — shuncha ko'p cashback!\n\n` +
    `Balansni ko'rish uchun do'konni oching 👇`,
    Markup.inlineKeyboard([
      [Markup.button.webApp("💰 Cashback ko'rish", WEBAPP_URL)]
    ])
  );
});

// ──────────────────────────────────────────────────────
// Callback: Yordam
// ──────────────────────────────────────────────────────
bot.action("help", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.replyWithMarkdown(
    `❓ *Yordam*\n\n` +
    `1️⃣ "Do'konga kirish" tugmasini bosing\n` +
    `2️⃣ Kitobni tanlang → Savatga qo'shing\n` +
    `3️⃣ Ma'lumotlarni kiriting\n` +
    `4️⃣ Buyurtma bering!\n\n` +
    `📞 *Admin:* @birilmkitob_admin\n` +
    `⏰ *Ish vaqti:* 09:00 — 21:00`
  );
});

// ──────────────────────────────────────────────────────
// Admin: Buyurtma tasdiqlash
// ──────────────────────────────────────────────────────
bot.action(/confirm_(.+)/, async (ctx) => {
  const orderId = ctx.match[1];
  await ctx.answerCbQuery("✅ Tasdiqlandi!");

  // Xabarni yangilash
  await ctx.editMessageReplyMarkup(
    Markup.inlineKeyboard([
      [Markup.button.callback("✅ TASDIQLANGAN", "done_confirm")],
      [Markup.button.callback("🚚 Yetkazildi", `deliver_${orderId}`)],
    ]).reply_markup
  );

  await ctx.reply(`✅ Buyurtma *#${orderId}* tasdiqlandi!\nMijozga xabar yuborildi.`, { parse_mode: "Markdown" });

  // Buyurtma bergan foydalanuvchini topib xabar yuborish
  // (order_user_id ni saqlab qo'ysangiz bu yerda ishlatiladi)
});

// ──────────────────────────────────────────────────────
// Admin: Yetkazildi
// ──────────────────────────────────────────────────────
bot.action(/deliver_(.+)/, async (ctx) => {
  const orderId = ctx.match[1];
  await ctx.answerCbQuery("🚚 Yetkazildi belgisi qo'yildi!");

  await ctx.editMessageReplyMarkup(
    Markup.inlineKeyboard([
      [Markup.button.callback("🚚 YETKAZILDI ✅", "done_deliver")],
    ]).reply_markup
  );

  await ctx.reply(`🚚 Buyurtma *#${orderId}* yetkazildi!\n💰 Cashback mijozga hisoblandi.`, { parse_mode: "Markdown" });
});

// ──────────────────────────────────────────────────────
// Admin: Bekor qilish
// ──────────────────────────────────────────────────────
bot.action(/cancel_(.+)/, async (ctx) => {
  const orderId = ctx.match[1];
  await ctx.answerCbQuery("❌ Bekor qilindi");

  await ctx.editMessageReplyMarkup(
    Markup.inlineKeyboard([
      [Markup.button.callback("❌ BEKOR QILINGAN", "done_cancel")],
    ]).reply_markup
  );

  await ctx.reply(`❌ Buyurtma *#${orderId}* bekor qilindi.`, { parse_mode: "Markdown" });
});

// Done actions (tugmalarni o'chirib qo'ymaslik uchun)
bot.action("done_confirm", (ctx) => ctx.answerCbQuery("Allaqachon tasdiqlangan"));
bot.action("done_deliver", (ctx) => ctx.answerCbQuery("Allaqachon yetkazilgan"));
bot.action("done_cancel",  (ctx) => ctx.answerCbQuery("Allaqachon bekor qilingan"));

// ──────────────────────────────────────────────────────
// ASOSIY FUNKSIYA: Yangi buyurtma kelganda
// server.js dan chaqiriladi: notifyNewOrder(orderData)
// ──────────────────────────────────────────────────────
async function notifyNewOrder(order) {
  const fmt = (n) => new Intl.NumberFormat("uz-UZ").format(n);
  const now = new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" });

  // ── 1. Foydalanuvchiga tasdiq xabari ──
  try {
    await bot.telegram.sendMessage(
      order.tg_user_id,
      `✅ *Buyurtmangiz qabul qilindi!*\n\n` +
      `🆔 Buyurtma raqami: *#${order.order_id}*\n` +
      `📅 Vaqt: ${now}\n\n` +
      `📦 *Buyurtma tarkibi:*\n` +
      order.items.map((i) => `  📖 ${i.title} × ${i.qty} — ${fmt(i.price * i.qty)} so'm`).join("\n") +
      `\n\n` +
      `━━━━━━━━━━━━━━━\n` +
      (order.cashback_used > 0 ? `🎁 Cashback chegirma: -${fmt(order.cashback_used)} so'm\n` : "") +
      `💵 *Jami to'lash: ${fmt(order.total)} so'm*\n` +
      `━━━━━━━━━━━━━━━\n\n` +
      `📍 *Manzil:* ${order.address}\n` +
      `📱 *Telefon:* ${order.phone}\n\n` +
      `⏳ Tez orada bog'lanamiz!\n` +
      `💰 *+${fmt(order.cashback_earned)} so'm cashback* hisoblandi 🎉\n\n` +
      `_Savollar uchun: @birilmkitob_admin_`,
      { parse_mode: "Markdown" }
    );
  } catch (e) {
    console.error("Foydalanuvchiga xabar yuborishda xato:", e.message);
  }

  // ── 2. Adminga to'liq ma'lumot ──
  try {
    await bot.telegram.sendMessage(
      ADMIN_ID,
      `🔔 *YANGI BUYURTMA KELDI!*\n` +
      `━━━━━━━━━━━━━━━\n` +
      `🆔 *#${order.order_id}*\n` +
      `📅 ${now}\n\n` +
      `👤 *Mijoz:* ${order.customer_name}\n` +
      `📱 *Tel:* ${order.phone}\n` +
      `📍 *Manzil:* ${order.address}\n` +
      `🆔 *TG ID:* ${order.tg_user_id}\n\n` +
      `📦 *Kitoblar:*\n` +
      order.items.map((i) => `  • ${i.title} × ${i.qty} — ${fmt(i.price * i.qty)} so'm`).join("\n") +
      `\n\n` +
      `━━━━━━━━━━━━━━━\n` +
      (order.cashback_used > 0 ? `🎁 Cashback: -${fmt(order.cashback_used)} so'm\n` : "") +
      `💵 *JAMI: ${fmt(order.total)} so'm*\n` +
      `━━━━━━━━━━━━━━━`,
      {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard([
          [
            Markup.button.callback("✅ Tasdiqlash", `confirm_${order.order_id}`),
            Markup.button.callback("❌ Bekor qilish", `cancel_${order.order_id}`),
          ],
          [
            Markup.button.callback("🚚 Yetkazildi", `deliver_${order.order_id}`),
          ],
        ]),
      }
    );
  } catch (e) {
    console.error("Adminga xabar yuborishda xato:", e.message);
  }
}

// ──────────────────────────────────────────────────────
// Boshqa barcha xabarlar
// ──────────────────────────────────────────────────────
bot.on("message", async (ctx) => {
  const name = ctx.from.first_name || "Do'stim";
  await ctx.replyWithMarkdown(
    `Salom ${name}! 👋\n\n` +
    `Do'konimizga xush kelibsiz!\n` +
    `Kitob xarid qilish uchun quyidagi tugmani bosing 👇`,
    Markup.inlineKeyboard([
      [Markup.button.webApp("🛍️ Do'konga kirish", WEBAPP_URL)],
      [
        Markup.button.callback("ℹ️ Bot haqida", "about"),
        Markup.button.callback("❓ Yordam", "help"),
      ],
    ])
  );
});

// ──────────────────────────────────────────────────────
// Bot ishga tushirish
// ──────────────────────────────────────────────────────
bot.launch()
  .then(() => {
    console.log("🤖 Bir Ilm Kitob Bot ishga tushdi!");
    console.log(`🌐 WebApp: ${WEBAPP_URL}`);
    console.log(`👤 Admin ID: ${ADMIN_ID}`);
  })
  .catch((err) => console.error("❌ Bot xatosi:", err));

process.once("SIGINT",  () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

module.exports = { notifyNewOrder };
