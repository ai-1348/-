const config = require('../config');
const { cmd } = require('../command');
const os = require('os');

cmd({
    pattern: "stats",
    alias: ["botstats", "system"],
    react: "📊",
    filename: __filename
}, async (conn, mek, m, { from }) => {

    try {

        const uptime = process.uptime();

        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const text = `╭━━━〔 📊 GHOST X MINI STATS 〕━━━╮

┃ 🤖 Bot : GHOST X MINI
┃ 💻 Platform : ${os.platform()}
┃ 🧠 RAM : ${Math.round(os.totalmem() / 1024 / 1024 / 1024)} GB
┃ ⚙️ CPU : ${os.cpus()[0].model}

┃ ⏳ Uptime :
┃ ${hours}h ${minutes}m ${seconds}s

╰━━━━━━━━━━━━━━━━━━━━╯

> 📰 GHOST X MINI
> 🌐 gost-x-bot.vercel.app`;

        await conn.sendMessage(from, {
            text,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363404811118873@newsletter',
                    newsletterName: 'GHOST X MINI',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {

        console.log(e);

        await conn.sendMessage(from, {
            text: '❌ Error.'
        }, { quoted: mek });

    }

});
