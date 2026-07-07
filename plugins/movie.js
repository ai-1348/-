const { cmd } = require('../command');
const axios = require('axios');

const BOT_NAME = "GHOST X MINI";
const CHANNEL_NAME = "GHOST X MINI";
const CHANNEL_JID = "120363404811118873@newsletter";
const WEBSITE = "gost-x-bot.vercel.app";

cmd({
    pattern: "movie",
    alias: ["imdb", "film"],
    react: "🎬",
    desc: "Search movie information",
    category: "search",
    filename: __filename
}, async (conn, mek, m, { from, q }) => {

    try {

        if (!q) {
            return await conn.sendMessage(from, {
                text: "❌ Example: .movie Avatar"
            }, { quoted: mek });
        }

        const API_KEY = "YOUR_OMDB_API_KEY";

        const { data } = await axios.get(
            `https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(q)}`
        );

        if (data.Response === "False") {
            return await conn.sendMessage(from, {
                text: "❌ Movie not found."
            }, { quoted: mek });
        }

        const msg = `
🎬 *MOVIE INFORMATION*

📌 Title : ${data.Title}
📅 Year : ${data.Year}
⭐ IMDb : ${data.imdbRating}
🎭 Genre : ${data.Genre}
🎬 Director : ${data.Director}
👥 Actors : ${data.Actors}
🌍 Country : ${data.Country}
🗣️ Language : ${data.Language}

📝 Plot :
${data.Plot}

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

        console.log(err);

        await conn.sendMessage(from, {
            text: "❌ Error fetching movie information."
        }, { quoted: mek });

    }

});
