const { cmd } = require('../command');

cmd({
    pattern: "fakechat",
    alias: ["fc", "fchat"],
    react: "💬",
    filename: __filename
}, async (conn, mek, m, { from, q }) => {

    try {

        if (!q) {
            return await conn.sendMessage(from, {
                text: "*Example:*\n.fakechat Ali|Hello Bro!|How are you?"
            }, { quoted: mek });
        }

        const args = q.split("|");

        if (args.length < 3) {
            return await conn.sendMessage(from, {
                text: "*Format:*\n.fakechat Name|Message 1|Message 2"
            }, { quoted: mek });
        }

        const name = args[0].trim();
        const msg1 = args[1].trim();
        const msg2 = args[2].trim();

        const time = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

        const text = `╭━━━〔 💬 FAKE CHAT 〕━━━╮

👤 ${name}
🕒 ${time}
💬 ${msg1}

────────────────

👤 You
🕒 ${time}
💬 ${msg2}

╰━━━━━━━━━━━━━━━━━━━━╯

⚠️ *For Fun & Entertainment Only*

🤖 GHOST X MINI
👑 Powered By MAFIA ADEEL`;

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
            text: "❌ Error while creating fake chat."
        }, { quoted: mek });

    }

});
