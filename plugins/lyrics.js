const { cmd } = require('../command');
const axios = require('axios');

const BOT_NAME = "GHOST X MINI";
const CHANNEL_NAME = "GHOST X MINI";
const CHANNEL_JID = "120363404811118873@newsletter";
const WEBSITE = "gost-x-bot.vercel.app";

cmd({
    pattern: "lyrics",
    alias: ["lyric"],
    react: "🎵",
    desc: "Search song lyrics",
    category: "search",
    filename: __filename
}, async (conn, mek, m, { from, q }) => {

    try {

        if (!q) {
            return await conn.sendMessage(from, {
                text: "❌ Example: .lyrics Believer"
            }, { quoted: mek });
        }

        const response = await axios.get(
            `https://api.lyrics.ovh/v1/${encodeURIComponent(q.split(" ")[0])}/${encodeURIComponent(q.split(" ").slice(1).join(" "))}`
        );

        const lyrics = response.data.lyrics || "Lyrics not found.";

        const msg = `
🎵 *LYRICS SEARCH*

🔍 Query: ${q}

${lyrics.length > 3500 ? lyrics.substring(0, 3500) + "..." : lyrics}

━━━━━━━━━━━━━━━
🤖 ${BOT_NAME}
🌐 ${WEBSITE}
━━━━━━━━━━━━━━━
`;

        await conn.sendMessage(from, {
            text: msg,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: CHANNEL_JID,
                    newsletterName: CHANNEL_NAME,
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (err) {

        await conn.sendMessage(from, {
            text: "❌ Lyrics not found."
        }, { quoted: mek });

    }

});
