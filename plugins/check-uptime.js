const { cmd } = require('../command');
const { runtime } = require('../lib/functions');

function getPakistanTime() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + 5 * 60 * 60000);
}

let lastUsedDesignIndex = 0;

cmd({
    pattern: "uptime",
    alias: ["runtime", "up"],
    category: "main",
    react: "⏱️",
    filename: __filename
},
async (conn, mek, m, { from, sender }) => {
    try {
        const uptime = runtime(process.uptime());
        const pakistanTime = getPakistanTime();
        const date = pakistanTime.toLocaleDateString('en-GB');
        const time = pakistanTime.toLocaleTimeString('en-US', { hour12: true });

        const design1 = `*╭────✦ SYSTEM STATUS ✦────╮*
*   ⏱️ UPTIME*
    ✦ ${uptime}
*   📅 DATE*
    ✦ ${date}
*   ⏰ TIME*
    ✦ ${time}
*   ⚡ STATUS*
    ✦ 🟢 INLINE 
*╰─✦ 🄳🄰🅁🄺 🄰🄳🄴🄴🄻 🄼🄳 ✦─╯*`;

        const styles = [design1, design2];

        const selectedStyle = styles[lastUsedDesignIndex];
        lastUsedDesignIndex = (lastUsedDesignIndex + 1) % styles.length;

        const imageUrl = 'https://files.catbox.moe/pf9a6s.jpg';

        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: selectedStyle,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363404811118873@newsletter',
                    newsletterName: 'ԃαɾƙ-αԃҽҽʅ-ɱԃ',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Uptime Error:", e);
        await conn.sendMessage(from, { text: `❌ Error: ${e.message}` }, { quoted: mek });
    }
});
