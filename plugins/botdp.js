const { cmd } = require("../command");

cmd({
    pattern: "botdp",
    alias: ["setbotdp", "changedp"],
    react: '🖼️',
    desc: "بوٹ کی پروفائل پکچر تبدیل کرنے کے لیے",
    category: "owner", // صرف اونر یا ایڈمن کے لیے
    filename: __filename
}, async (conn, message, m, { reply, isCreator }) => {
    try {
        // چیک کریں کہ کمانڈ دینے والا بوٹ کا اونر (مالک) ہے یا نہیں
        if (!isCreator) return reply("❌ یہ کمانڈ صرف بوٹ کا اونر ہی استعمال کر سکتا ہے۔");

        const quoted = message.quoted || message;
        const mime = quoted.mimetype || quoted.msg?.mimetype || "";

        // چیک کریں کہ امیج موجود ہے یا نہیں
        if (!mime.startsWith("image/")) {
            return reply("❌ مہربانی فرما کر کسی تصویر پر ریپلائی کریں اور لکھیں .botdp");
        }

        await conn.sendMessage(m.chat, { react: { text: "⏳", key: message.key } });

        // تصویر ڈاؤن لوڈ کرنا
        const buffer = await quoted.download();
        if (!buffer) throw new Error("Image download failed");

        // بوٹ کی ڈی پی (Profile Picture) اپڈیٹ کرنا
        // conn.user.id بوٹ کا اپنا واٹس ایپ آئی ڈی فراہم کرتا ہے
        const botJid = conn.user.id.split(":")[0] + "@s.whatsapp.net";
        await conn.updateProfilePicture(botJid, buffer);

        await conn.sendMessage(m.chat, { react: { text: "✅", key: message.key } });
        reply("✅ بوٹ کی پروفائل پکچر (DP) کامیابی سے تبدیل کر دی گئی ہے!");

    } catch (err) {
        console.error("BotDP Error:", err.message);
        await conn.sendMessage(m.chat, { react: { text: "❌", key: message.key } });
        reply("❌ ڈی پی تبدیل کرنے میں خرابی آئی ہے۔ پینل لاگز چیک کریں یا دوبارہ کوشش کریں۔");
    }
});
