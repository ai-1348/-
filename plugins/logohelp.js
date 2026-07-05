const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "logohelp",
    alias: ["logoprompt", "promptlogo"],
    react: "🎨",
    filename: __filename
}, async (conn, mek, m, { from }) => {

    try {

        const text = `╭━━━〔 🎨 LOGO HELP 〕━━━╮

🔥 *BEST AI LOGO PROMPTS*

1️⃣ Gaming Logo
A futuristic gaming mascot logo with neon blue lighting, ultra detailed, 3D, dark background.

━━━━━━━━━━━━━━━━━━

2️⃣ WhatsApp Bot Logo
A premium WhatsApp bot logo with glowing green effects, cyberpunk style, modern technology.

━━━━━━━━━━━━━━━━━━

3️⃣ Esports Logo
Professional esports mascot logo with sharp eyes, bold colors, ultra HD.

━━━━━━━━━━━━━━━━━━

4️⃣ Luxury Logo
Luxury gold monogram logo on a black background with premium lighting.

━━━━━━━━━━━━━━━━━━

5️⃣ Islamic Logo
Elegant Islamic calligraphy logo with gold ornaments and dark background.

━━━━━━━━━━━━━━━━━━

6️⃣ YouTube Logo
Modern YouTube channel logo with vibrant colors, cinematic lighting and 3D style.

━━━━━━━━━━━━━━━━━━

💡 *Tip:*
Copy any prompt above and use it in your favorite AI image generator.

╰━━━━━━━━━━━━━━━━━━╯

> 🤖 GHOST X MINI
> 👑 Powered By MAFIA ADEEL`;

        await conn.sendMessage(from, {
            text,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363404811118873@newsletter",
                    newsletterName: "GHOST X MINI",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (err) {
        console.log(err);

        await conn.sendMessage(from, {
            text: "❌ Error while executing logohelp command."
        }, { quoted: mek });
    }

});
