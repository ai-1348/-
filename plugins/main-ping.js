const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "ping",
    alias: ["speed", "pong"],
    react: "🌡️",
    filename: __filename
}, async (conn, mek, m, { from, sender }) => {

    const start = Date.now();

    const reactionEmojis = ['🍧', '🏓', '🎯', '💨', '🍸'];
    const textEmojis = ['🎲', '🎀', '⚡️', '🏓', '🥃', '🍷'];

    let reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
    let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
    
    await conn.sendMessage(from, { react: { text: textEmoji, key: mek.key } });

    const responseTime = Date.now() - start;

    await conn.sendMessage(from, {
        text: `*∂αкк α∂єєℓ м∂ ѕρєє∂ ✦: ${responseTime}ms ${reactionEmoji}*`,
        contextInfo: {
            mentionedJid: [sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363404811118873@newsletter',
                newsletterName: "ԃαɾƙ-αԃҽҽʅ-ɱԃ",
                serverMessageId: 143
            }
        }
    }, { quoted: mek });

});

cmd({
    pattern: "ping2",
    react: "🍂",
    filename: __filename
}, async (conn, mek, m, { from }) => {

    const start = Date.now();
    const msg = await conn.sendMessage(from, { text: '*PINGING...*' }); 
    const ping = Date.now() - start;

    await conn.sendMessage(from, {
        text: `*ADEEL-MD SPEED: ${ping}ms*`
    }, { quoted: msg });

});
