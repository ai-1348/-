const { cmd } = require('../command');

cmd({
    pattern: "readmore",
    alias: ["rm", "spoiler"],
    react: "📖",
    filename: __filename
}, async (conn, mek, m, { from, q }) => {

    try {

        if (!q) {
            return await conn.sendMessage(from, {
                text: "*Example:*\n.readmore Hello | This is hidden text."
            }, { quoted: mek });
        }

        const parts = q.split("|");

        if (parts.length < 2) {
            return await conn.sendMessage(from, {
                text: "*Use this format:*\n.readmore Text 1 | Text 2"
            }, { quoted: mek });
        }

        const readMore = String.fromCharCode(8206).repeat(4001);

        const text = `${parts[0].trim()}

${readMore}

${parts[1].trim()}`;

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
            text: "❌ Error while creating Read More."
        }, { quoted: mek });

    }

});
