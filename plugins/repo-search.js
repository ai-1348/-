const { cmd } = require('../command');

cmd({
    pattern: "repo",
    desc: "Show server link",
    category: "main",
    react: "📦",
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const serverLink = "https://gost-x-bot.vercel.app/";

    const message = `
╭━〔 📦 𝐆𝐇𝐎𝐒𝐓 𝐗 𝐌𝐈𝐍𝐈 𝗥𝗘𝗣𝗢 〕━╮

┃ 🌐 𝗦𝗘𝗥𝗩𝗘𝗥 𝗟𝗜𝗡𝗞
┃ 🔗 ${serverLink}

┃ GHOST 👻 X MAFIA 
╰━━━━━━━━━━━━━━━━━━━╯
`.trim();

    await conn.sendMessage(from, {
        text: message,
        contextInfo: {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363404811118873@newsletter",
                newsletterName: "GHOST X BOT",
                serverMessageId: 1
            }
        }
    }, { quoted: mek });

});
