const config = require('../config');
const { cmd } = require('../command');
const axios = require('axios');

// ============================================
// 🤖 AI CHAT PLUGIN - GHOST X MINI v3.0
// COMPLETE AI COMMAND
// ============================================

const AI_CONFIG = {
    // AI API Settings
    primaryAPI: 'pollinations', // 'pollinations' ya 'gemini'
    fallbackAPI: true, // Agar primary fail ho to dusra try kare

    // Gemini API Key (agar use karna ho)
    geminiKey: config.GEMINI_API_KEY || '',

    // Response Settings
    maxLength: 2000, // Max characters in reply
    timeout: 30000, // 30 seconds timeout

    // Chat Memory (optional)
    enableMemory: false, // true karne se bot context yaad rakhega

    // Personality
    personality: 'You are GHOST X MINI, a helpful AI assistant. Reply in a friendly and helpful manner.',
};

// Chat history for memory (agar enabled ho)
const chatHistory = new Map();

// ============================================
// 🤖 MAIN AI COMMAND
// ============================================

cmd({
    pattern: "ai",
    alias: ["ask", "gpt", "chat", "bot", "question", "q"],
    react: "🤖",
    desc: "AI se kuch bhi pooch sakte hain",
    category: "AI",
    filename: __filename
}, async (conn, mek, m, { from, sender, body, reply, pushName }) => {

    try {
        // Question nikaalna
        const question = body.replace(/^[!.*](ai|ask|gpt|chat|bot|question|q)\s*/i, '').trim();

        // Agar question nahi diya
        if (!question) {
            const menuText = `*🤖 GHOST X MINI AI*

*Kuch bhi pooch sakte hain!*

*Examples:*
${config.PREFIX}ai Pakistan ki history batao
${config.PREFIX}ai ek joke sunao
${config.PREFIX}ai coding kya hai
${config.PREFIX}ai aaj ka mausam kaisa hai
${config.PREFIX}ai Islam ke bare mein batao
${config.PREFIX}ai maths solve karo: 2+2*5
${config.PREFIX}ai Urdu mein shayari likho

> _Powered by AI_`;

            return await conn.sendMessage(from, {
                text: menuText,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363404811118873@newsletter',
                        newsletterName: "GHOST X MINI",
                        serverMessageId: 143
                    }
                }
            }, { quoted: mek });
        }

        // Typing indicator show karna
        await conn.sendPresenceUpdate('composing', from);

        // AI se jawab lena
        let aiResponse = await getAIResponse(question, sender);

        // Typing stop
        await conn.sendPresenceUpdate('paused', from);

        // Agar reply zyada lamba ho to split karein
        if (aiResponse.length > AI_CONFIG.maxLength) {
            aiResponse = aiResponse.substring(0, AI_CONFIG.maxLength) + '...\n\n> _Reply zyada lamba tha, short mein diya gaya_';
        }

        // Send AI Response
        await conn.sendMessage(from, {
            text: `*🤖 GHOST X MINI AI*\n\n${aiResponse}\n\n> _Asked by: ${pushName || 'User'}_`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363404811118873@newsletter',
                    newsletterName: "GHOST X MINI",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error('AI Command Error:', error);
        await conn.sendPresenceUpdate('paused', from);

        await conn.sendMessage(from, {
            text: `*❌ Error!*\n\nAI se jawab nahi mil saka.\nPlease baad mein try karein.\n\n_Error: ${error.message}_`,
            contextInfo: {
                mentionedJid: [sender]
            }
        }, { quoted: mek });
    }
});

// ============================================
// 📝 AI RESPONSE FUNCTION
// ============================================

async function getAIResponse(question, userId) {

    // Try Primary API (Pollinations - FREE)
    try {
        if (AI_CONFIG.primaryAPI === 'pollinations' || AI_CONFIG.fallbackAPI) {
            const response = await axios.get(
                `https://text.pollinations.ai/${encodeURIComponent(question)}`,
                {
                    timeout: AI_CONFIG.timeout,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data && response.data.trim()) {
                return response.data;
            }
        }
    } catch (error) {
        console.log('Pollinations API failed:', error.message);
    }

    // Try Fallback API (Gemini)
    try {
        if (AI_CONFIG.geminiKey) {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${AI_CONFIG.geminiKey}`,
                {
                    contents: [{
                        parts: [{ text: question }]
                    }]
                },
                {
                    timeout: AI_CONFIG.timeout,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
                return text;
            }
        }
    } catch (error) {
        console.log('Gemini API failed:', error.message);
    }

    // If all fail
    return "Maaf kijiye, abhi AI se jawab nahi mil saka.\nThodi der baad try karein ya apna sawal dobara likhein.";
}

// ============================================
// 🇵🇰 URDU AI COMMAND
// ============================================

cmd({
    pattern: "urdu",
    alias: ["urduai", "hindi", "urdugpt"],
    react: "🇵🇰",
    desc: "Urdu/Hindi mein AI se baat karein",
    category: "AI",
    filename: __filename
}, async (conn, mek, m, { from, sender, body, reply, pushName }) => {

    try {
        const question = body.replace(/^[!.*](urdu|urduai|hindi|urdugpt)\s*/i, '').trim();

        if (!question) {
            return await conn.sendMessage(from, {
                text: `*🇵🇰 URDU AI*\n\n*Urdu/Hindi mein kuch bhi pooch sakte hain!*\n\n*Examples:*\n${config.PREFIX}urdu Pakistan ki history batao\n${config.PREFIX}urdu ek sher sunao\n${config.PREFIX}urdu Islam ke bare mein batao\n${config.PREFIX}urdu aaj ka mausam kaisa hai`,
                contextInfo: { mentionedJid: [sender] }
            }, { quoted: mek });
        }

        await conn.sendPresenceUpdate('composing', from);

        // Urdu prompt add karna
        const urduPrompt = `Please answer in Urdu or Hindi language: ${question}`;
        const aiResponse = await getAIResponse(urduPrompt, sender);

        await conn.sendPresenceUpdate('paused', from);

        await conn.sendMessage(from, {
            text: `*🇵🇰 URDU AI*\n\n${aiResponse}\n\n> _Asked by: ${pushName || 'User'}_`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363404811118873@newsletter',
                    newsletterName: "GHOST X MINI",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error('Urdu AI Error:', error);
        await conn.sendMessage(from, {
            text: `*❌ Khaata!*\n\nJawab nahi mil saka. Baad mein koshish karein.`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }
});

// ============================================
// 😂 AI JOKE COMMAND
// ============================================

cmd({
    pattern: "joke",
    alias: ["funny", "laugh", "hass"],
    react: "😂",
    desc: "AI se joke sunayein",
    category: "Fun",
    filename: __filename
}, async (conn, mek, m, { from, sender, pushName }) => {

    try {
        await conn.sendPresenceUpdate('composing', from);

        const prompt = "Tell me a very funny joke. Make it short and hilarious.";
        const aiResponse = await getAIResponse(prompt, sender);

        await conn.sendPresenceUpdate('paused', from);

        await conn.sendMessage(from, {
            text: `*😂 AI JOKE*\n\n${aiResponse}\n\n> _Haso aur hasao!_ 🤣`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363404811118873@newsletter',
                    newsletterName: "GHOST X MINI",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (error) {
        await conn.sendMessage(from, {
            text: `*😅 Oops!*\n\nJoke sunane mein problem aa gayi.`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }
});

// ============================================
// 🧮 AI CALCULATOR / SOLVER
// ============================================

cmd({
    pattern: "solve",
    alias: ["calc", "math", "maths"],
    react: "🧮",
    desc: "Maths problems solve karein",
    category: "AI",
    filename: __filename
}, async (conn, mek, m, { from, sender, body, pushName }) => {

    try {
        const problem = body.replace(/^[!.*](solve|calc|math|maths)\s*/i, '').trim();

        if (!problem) {
            return await conn.sendMessage(from, {
                text: `*🧮 AI MATH SOLVER*\n\n*Maths problem solve karein!*\n\n*Examples:*\n${config.PREFIX}solve 2+2*5\n${config.PREFIX}solve x^2 + 5x + 6 = 0\n${config.PREFIX}solve 25% of 400`,
                contextInfo: { mentionedJid: [sender] }
            }, { quoted: mek });
        }

        await conn.sendPresenceUpdate('composing', from);

        const prompt = `Solve this math problem step by step: ${problem}`;
        const aiResponse = await getAIResponse(prompt, sender);

        await conn.sendPresenceUpdate('paused', from);

        await conn.sendMessage(from, {
            text: `*🧮 AI MATH SOLVER*\n\n*Problem:* ${problem}\n\n*Solution:*\n${aiResponse}\n\n> _Solved by AI_`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363404811118873@newsletter',
                    newsletterName: "GHOST X MINI",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (error) {
        await conn.sendMessage(from, {
            text: `*❌ Error!*\n\nSolve nahi ho saka.`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }
});

// ============================================
// 📌 EXPORT
// ============================================
module.exports = {};
