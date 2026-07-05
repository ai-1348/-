const { cmd } = require('../command');

cmd({
    pattern: "timer",
    alias: ["countdown", "remind"],
    react: "⏰",
    filename: __filename
}, async (conn, mek, m, { from, q }) => {

    try {

        if (!q) {
            return await conn.sendMessage(from, {
                text: "*Example:*\n.timer 10s\n.timer 5m\n.timer 1h"
            }, { quoted: mek });
        }

        const match = q.trim().match(/^(\d+)([smh])$/i);

        if (!match) {
            return await conn.sendMessage(from, {
                text: "*Invalid Format!*\n\nUse:\n.timer 10s\n.timer 5m\n.timer 1h"
            }, { quoted: mek });
        }

        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();

        let ms;

        if (unit === "s") ms = value * 1000;
        else if (unit === "m") ms = value * 60 * 1000;
        else if (unit === "h") ms = value * 60 * 60 * 1000;

        await conn.sendMessage(from, {
            text: `⏰ Timer Started!\n\nDuration: ${value}${unit}\n\nI'll remind you when the time is over.`,
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

        setTimeout(async () => {

            await conn.sendMessage(from, {
                text: `╭━━━〔 ⏰ TIMER FINISHED 〕━━━╮

✅ Your timer has ended!

⏳ Duration: ${value}${unit}

🤖 GHOST X MINI
👑 Powered By MAFIA ADEEL

╰━━━━━━━━━━━━━━━━━━━━╯`,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363404811118873@newsletter",
                        newsletterName: "GHOST X MINI",
                        serverMessageId: 143
                    }
                }
            });

        }, ms);

    } catch (err) {

        console.log(err);

        await conn.sendMessage(from, {
            text: "❌ Timer Error."
        }, { quoted: mek });

    }

});
