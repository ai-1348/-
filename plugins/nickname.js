const { cmd } = require('../command');

const nicknames = [
    "Shadow",
    "Phantom",
    "Ghost",
    "Venom",
    "Dark Hunter",
    "Night King",
    "Silent Wolf",
    "Storm",
    "Toxic",
    "Dragon",
    "Blaze",
    "Titan",
    "Legend",
    "Viper",
    "Inferno",
    "Cyber X",
    "Royal King",
    "Alpha",
    "Demon",
    "Zero"
];

cmd({
    pattern: "nickname",
    alias: ["nick", "namegen"],
    react: "👑",
    filename: __filename
}, async (conn, mek, m, { from }) => {

    try {

        const nickname = nicknames[Math.floor(Math.random() * nicknames.length)];

        const text = `╭━━━〔 👑 NICKNAME GENERATOR 〕━━━╮

✨ Your Random Nickname

➤ ${nickname}

💡 Run the command again to get another nickname.

╰━━━━━━━━━━━━━━━━━━━━╯

> 🤖 GHOST X MINI
> 👑 Powered By MAFIA ADEEL`;

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
            text: "❌ Error while generating nickname."
        }, { quoted: mek });

    }

});
