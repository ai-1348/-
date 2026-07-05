const { cmd } = require('../command');

cmd({
    pattern: "password",
    alias: ["pass", "genpass"],
    react: "🔐",
    filename: __filename
}, async (conn, mek, m, { from }) => {

    try {

        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}";
        let password = "";

        for (let i = 0; i < 16; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const text = `╭━━━〔 🔐 PASSWORD GENERATOR 〕━━━╮

🔑 *Your Secure Password*

\`${password}\`

━━━━━━━━━━━━━━━━━━

📌 Length : 16 Characters
🛡️ Strength : Very Strong
🎲 Random : Yes

⚠️ Keep this password private.

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
            text: "❌ Error while generating password."
        }, { quoted: mek });

    }

});
