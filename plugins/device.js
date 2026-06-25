const { cmd } = require('../command');

cmd({
    pattern: "device",
    alias: ["platform", "client"],
    react: "📱",
    filename: __filename
}, async (conn, mek, m, { from, sender }) => {

    try {

        let target = sender;

        const quoted =
            mek.message?.extendedTextMessage?.contextInfo?.participant;

        if (quoted) target = quoted;

        const text = `╭━━━〔 📱 DEVICE INFO 〕━━━╮

┃ 👤 User : @${target.split('@')[0]}
┃ 🤖 Bot : GHOST X MINI
┃ 📡 Status : Online
┃ ⚡ System : WhatsApp MD
┃ 🔍 Client : Detectable Info Only

╰━━━━━━━━━━━━━━━━━━━━╯

> 📰 GHOST X MINI
> 👑 Powered By MAFIA ADEEL`;

        await conn.sendMessage(from, {
            text,
            mentions: [target],
            contextInfo: {
                mentionedJid: [target],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363404811118873@newsletter',
                    newsletterName: 'GHOST X MINI',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (err) {

        console.log(err);

        await conn.sendMessage(from, {
            text: "❌ Device command error."
        }, { quoted: mek });

    }

});
