const axios = require("axios");
const FormData = require("form-data");
const { cmd } = require("../command");

// آپ کی آفیشل remove.bg کی لائیو API Key
const REMOVE_BG_API_KEY = "J7iu1mmfaP7WeiF2xuJBk8xw";

cmd({
    pattern: "rmbg",
    alias: ["removebg", "rbg", "bgremove"],
    react: '📸',
    desc: "تصویر کا بیک گراؤنڈ ختم کرنے کے لیے",
    category: "editing",
    filename: __filename
}, async (conn, message, m, { reply }) => {
    try {
        const quoted = message.quoted || message;
        const mime = quoted.mimetype || quoted.msg?.mimetype || "";

        if (!mime.startsWith("image/")) {
            return reply("❌ مہربانی فرما کر کسی تصویر کا ریپلائی کریں یا ٹیگ کریں۔");
        }

        // واٹس ایپ پر ری ایکشن بھیجنا
        await conn.sendMessage(m.chat, { react: { text: "⏳", key: message.key } });

        // امیج ڈاؤن لوڈ کرنا
        const buffer = await quoted.download();
        if (!buffer) throw new Error("Image download failed");

        // فارم ڈیٹا تیار کرنا
        const formData = new FormData();
        formData.append("image_file", buffer, {
            filename: `image_${Date.now()}.jpg`,
            contentType: mime
        });
        formData.append("size", "auto");

        // آفیشل remove.bg API پر ریکوسٹ بھیجنا
        const response = await axios.post("https://api.remove.bg/v1.0/removebg", formData, {
            headers: {
                ...formData.getHeaders(),
                "X-Api-Key": REMOVE_BG_API_KEY
            },
            responseType: "arraybuffer",
            timeout: 60000
        });

        // سائز معلوم کرنے کا فنکشن
        const formatBytes = (bytes) => {
            if (bytes === 0) return "0 Bytes";
            const k = 1024;
            const sizes = ["Bytes", "KB", "MB"];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
        };

        const size = formatBytes(response.data.length);

        // کامیابی کا ری ایکشن
        await conn.sendMessage(m.chat, { react: { text: "✅", key: message.key } });

        // بغیر بیک گراؤنڈ والی امیج واٹس ایپ پر بھیجنا
        await conn.sendMessage(
            m.chat,
            {
                image: Buffer.from(response.data),
                caption: `\`REMOVE BACKGROUND\`

📦 SIZE: ${size}

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴅᴇᴇʟ-ᴍᴅ 🍸`
            },
            { quoted: m }
        );

    } catch (err) {
        console.error("RMBG Error:", err.message);
        await conn.sendMessage(m.chat, { react: { text: "❌", key: message.key } });
        
        if (err.response && err.response.status === 402) {
            return reply("❌ آپ کی API Key کی فری لمیٹ ختم ہو چکی ہے یا کی انویلڈ ہے۔");
        }
        reply("❌ بیک گراؤنڈ ریموو کرنے میں مسئلہ آیا ہے، دوبارہ کوشش کریں۔");
    }
});
