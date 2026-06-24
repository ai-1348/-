const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "userinfo",
    alias: ["whois", "user"],
    react: "👤",
    filename: __filename
}, async (conn, mek, m, { from, sender }) => {

    try {

        let target = sender;

        const quoted =
            mek.message?.extendedTextMessage?.contextInfo?.participant;

        if (quoted) {
            target = quoted;
        }

        const number = target.split('@')[0];

        let name = "Unknown User";

        try {
            name = await conn.getName(target);
        } catch (e) {}

        const text = `╭━━━〔 👤 USER INFO 〕━━━╮

┃ 🏷️ Name : ${name}
┃ 📞 Number : ${number}
┃ 🆔 JID : ${target}
┃ 👥 Chat : ${from.endsWith('@g.us') ? 'Group' : 'Private'}

╰━━━━━━━━━━━━━━━━╯

> Powered By GHOST X MINI`;

        await conn.sendMessage(from, {
            text,
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
        }, {
            quoted: mek
        });

    } catch (err) {

        console.log(err);

        await conn.sendMessage(from, {
            text: '❌ Error while fetching user info.'
        }, {
            quoted: mek
        });

    }

});
