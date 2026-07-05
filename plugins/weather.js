const { cmd } = require('../command');
const axios = require('axios');

const BOT_NAME = "GHOST X MINI";
const CHANNEL_NAME = "GHOST X MINI";
const CHANNEL_JID = "120363404811118873@newsletter";
const WEBSITE = "gost-x-bot.vercel.app";

cmd({
    pattern: "weather",
    alias: ["wthr"],
    react: "🌤️",
    desc: "Check weather of any city",
    category: "utility",
    filename: __filename
}, async (conn, mek, m, { from, args }) => {

    try {

        const city = args.join(" ");

        if (!city) {
            return await conn.sendMessage(from, {
                text: "❌ Example: .weather Lahore"
            }, { quoted: mek });
        }

        const API_KEY = "YOUR_OPENWEATHER_API_KEY";

        const { data } = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );

        const msg = `
╭━━━〔 🌤️ WEATHER REPORT 〕━━━╮

📍 City : ${data.name}
🌡️ Temperature : ${data.main.temp}°C
🤒 Feels Like : ${data.main.feels_like}°C
💧 Humidity : ${data.main.humidity}%
🌬️ Wind Speed : ${data.wind.speed} m/s
☁️ Condition : ${data.weather[0].description}

╰━━━━━━━━━━━━━━━━━━━━╯

🤖 ${BOT_NAME}
🌐 ${WEBSITE}
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
            text: "❌ City not found or weather service error."
        }, { quoted: mek });

    }

});
