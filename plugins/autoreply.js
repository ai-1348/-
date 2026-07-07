const config = require('../config');
const { cmd } = require('../command');

// ============================================
// 🤖 AUTO REPLY PLUGIN - GHOST X MINI v2.0
// ============================================

const AI_SETTINGS = {
    enabled: true,
    replyDelay: 1000,
    ignoreCommands: true,
    ignoreGroups: false,
    ignoreSelf: true,
    maxLength: 800,
    cooldown: 3000,
    ownerNumber: config.OWNER_NUMBER || '',
    aiMode: 'pollinations', // 'pollinations' ya 'gemini'
};

// User cooldown tracker
const userCooldowns = new Map();

// ============================================
// 📝 CUSTOM AUTO REPLIES (Aap yahan add karein)
// ============================================

const CUSTOM_REPLIES = {
    // Exact match replies
    exact: {
        'hi': 'Assalam-o-Alaikum! 😊 Main GHOST X MINI hoon. Aapki kya madad kar sakta hoon?',
        'hello': 'Hello! 👋 Kaisi madad chahiye?',
        'assalamualaikum': 'Wa Alaikum Assalam! 🤗',
        'salam': 'Wa Alaikum Assalam! 🌙',
        'bye': 'Allah Hafiz! 👋 Phir milenge!',
        'ok': 'Theek hai! ✅',
        'thanks': 'Koi baat nahi! 😊 Khush raho!',
        'shukriya': 'Aapka shukriya! 🙏',
        'bot': 'Haan ji, main hoon! 🤖 GHOST X MINI at your service!',
        'owner': 'Mere owner se baat karni hai? Unhe message karein!',
        'help': '📚 Commands list ke liye !menu type karein!',
    },

    // Contains match replies (word anywhere in message)
    contains: {
        'love': '❤️ Mohabbat zindagi ka hissa hai!',
        'sad': '😢 Ghabraein nahi! Allah sab theek karega. Dua mein yaad rakhiye!',
        'happy': '😊 Khushi baantne se badhti hai! Mashallah!',
        'pakistan': '🇵🇰 Pakistan Zindabad! Dil Dil Pakistan!',
        'islam': '☪️ Islam deen-e-haq hai. Allah ki rehmat ho aap par!',
        'allah': '☪️ SubhanAllah! Allah Pak sab se bara hai!',
        'namaz': '🕌 Namaz qaim karein! Yeh kamyabi ki kunji hai!',
        'joke': '😂 Ek joke sunana chahate hain? !joke command use karein!',
        'song': '🎵 Song chahiye? !play command se search karein!',
        'video': '🎬 Video chahiye? !yt command use karein!',
    },

    // Group specific replies
    group: {
        'welcome': '👋 Welcome to the group! Rules follow karein.',
        'rules': '📋 Group Rules:\n1. Respect everyone\n2. No spam\n3. No bad words\n4. Help each other',
        'admin': '👮‍♂️ Admin se baat karein agar koi problem ho!',
    }
};

// ============================================
// 🎯 MAIN AUTO REPLY HANDLER
// ============================================

cmd({
    on: "body",
    pattern: null,
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, sender, body, isGroup, reply, isCmd, pushName }) => {
    
    try {
        // ========== BASIC CHECKS ==========
        
        if (!AI_SETTINGS.enabled) return;
        if (!body || body.trim() === '') return;
        
        const cleanBody = body.toLowerCase().trim();
        const userName = pushName || 'Friend';

        // Commands ignore karein
        if (cleanBody.startsWith(config.PREFIX) || 
            cleanBody.startsWith('!') || 
            cleanBody.startsWith('.')) return;

        // AI commands ignore karein
        if (/^(ai|ask|gpt|chat|urdu)\s/i.test(cleanBody)) return;

        // Self ignore
        if (AI_SETTINGS.ignoreSelf && sender === conn.user.id) return;

        // Owner ignore (optional)
        if (AI_SETTINGS.ownerNumber && sender.includes(AI_SETTINGS.ownerNumber)) return;

        // Cooldown check
        const now = Date.now();
        const lastReply = userCooldowns.get(sender);
        if (lastReply && (now - lastReply) < AI_SETTINGS.cooldown) return;
        userCooldowns.set(sender, now);

        // ========== CUSTOM REPLY CHECK ==========
        
        let replyText = null;

        // 1. Exact match check
        if (CUSTOM_REPLIES.exact[cleanBody]) {
            replyText = CUSTOM_REPLIES.exact[cleanBody];
        }

        // 2. Contains match check
        if (!replyText) {
            for (const [word, response] of Object.entries(CUSTOM_REPLIES.contains)) {
                if (cleanBody.includes(word)) {
                    replyText = response;
                    break;
                }
            }
        }

        // 3. Group specific check
        if (isGroup && !replyText) {
            for (const [word, response] of Object.entries(CUSTOM_REPLIES.group)) {
                if (cleanBody.includes(word)) {
                    replyText = response;
                    break;
                }
            }
        }

        // ========== AI REPLY (Agar custom reply nahi mila) ==========
        
        if (!replyText) {
            await conn.sendPresenceUpdate('composing', from);
            
            const aiResponse = await getAIReply(cleanBody);
            replyText = aiResponse;
            
            await conn.sendPresenceUpdate('paused', from);
        }

        // ========== SEND REPLY ==========
        
        if (replyText) {
            // Personalize with name
            replyText = replyText.replace('{name}', userName);

            await conn.sendMessage(from, {
                text: `*🤖 GHOST X MINI*\n\n${replyText}\n\n> _Auto Reply_`,
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

    } catch (error) {
        console.error('Auto Reply Error:', error);
    }
});

// ============================================
// 🤖 AI RESPONSE FUNCTION
// ============================================

async function getAIReply(question) {
    try {
        const axios = require('axios');
        const prompt = encodeURIComponent(question);
        
        let response;
        
        if (AI_SETTINGS.aiMode === 'gemini' && config.GEMINI_API_KEY) {
            // Gemini API
            response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${config.GEMINI_API_KEY}`,
                {
                    contents: [{
                        parts: [{ text: question }]
                    }]
                },
                { timeout: 30000 }
            );
            return response.data.candidates[0].content.parts[0].text || "Samajh nahi paya.";
            
        } else {
            // Pollinations AI (FREE)
            response = await axios.get(`https://text.pollinations.ai/${prompt}`, {
                timeout: 30000,
                headers: { 'Content-Type': 'application/json' }
            });
            
            let reply = response.data || "Maaf kijiye, main samajh nahi paya.";
            if (reply.length > AI_SETTINGS.maxLength) {
                reply = reply.substring(0, AI_SETTINGS.maxLength) + '...';
            }
            return reply;
        }

    } catch (error) {
        console.error('AI API Error:', error);
        return "Abhi jawab nahi de sakta. Thodi der baad try karein.";
    }
}

// ============================================
// ⚙️ OWNER CONTROL COMMANDS
// ============================================

// Toggle Auto Reply
cmd({
    pattern: "autoreply",
    alias: ["autobot", "aireply"],
    react: "⚙️",
    desc: "Auto reply ON/OFF",
    category: "Owner",
    filename: __filename
}, async (conn, mek, m, { from, sender, body, isOwner }) => {
    
    if (!isOwner) {
        return await conn.sendMessage(from, {
            text: `*❌ Sirf Owner!*`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }

    const action = body.toLowerCase().trim();
    
    if (action.includes('on') || action.includes('start')) {
        AI_SETTINGS.enabled = true;
        return await conn.sendMessage(from, {
            text: `*✅ Auto Reply ON!*\n\nAb har message ka jawab automatically milega.`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }
    else if (action.includes('off') || action.includes('stop')) {
        AI_SETTINGS.enabled = false;
        return await conn.sendMessage(from, {
            text: `*❌ Auto Reply OFF!*\n\nAb sirf commands kaam karengi.`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }
    else {
        const status = AI_SETTINGS.enabled ? '🟢 ON' : '🔴 OFF';
        return await conn.sendMessage(from, {
            text: `*⚙️ Auto Reply Status*\n\nStatus: ${status}\nMode: ${AI_SETTINGS.aiMode}\nCooldown: ${AI_SETTINGS.cooldown/1000}s\n\n*Commands:*\n${config.PREFIX}autoreply on\n${config.PREFIX}autoreply off`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }
});

// Add Custom Reply
cmd({
    pattern: "addreply",
    alias: ["setreply", "customreply"],
    react: "➕",
    desc: "Custom reply add karein",
    category: "Owner",
    filename: __filename
}, async (conn, mek, m, { from, sender, body, args, isOwner }) => {
    
    if (!isOwner) {
        return await conn.sendMessage(from, {
            text: `*❌ Sirf Owner!*`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }

    // Format: !addreply trigger | reply text
    const fullText = body.replace(/^[!.*](addreply|setreply|customreply)\s*/i, '').trim();
    const parts = fullText.split('|');
    
    if (parts.length < 2) {
        return await conn.sendMessage(from, {
            text: `*❌ Wrong Format!*\n\n*Usage:*\n${config.PREFIX}addreply trigger | reply text\n\n*Example:*\n${config.PREFIX}addreply hello | Assalam-o-Alaikum!`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }

    const trigger = parts[0].trim().toLowerCase();
    const replyText = parts[1].trim();

    CUSTOM_REPLIES.exact[trigger] = replyText;

    return await conn.sendMessage(from, {
        text: `*✅ Custom Reply Added!*\n\nTrigger: "${trigger}"\nReply: "${replyText}"`,
        contextInfo: { mentionedJid: [sender] }
    }, { quoted: mek });
});

// List Custom Replies
cmd({
    pattern: "listreply",
    alias: ["replies", "customlist"],
    react: "📋",
    desc: "Custom replies dekhein",
    category: "Owner",
    filename: __filename
}, async (conn, mek, m, { from, sender, isOwner }) => {
    
    if (!isOwner) {
        return await conn.sendMessage(from, {
            text: `*❌ Sirf Owner!*`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }

    let text = `*📋 Custom Replies List*\n\n`;
    
    text += `*Exact Matches:*\n`;
    for (const [key, value] of Object.entries(CUSTOM_REPLIES.exact)) {
        text += `• "${key}" → "${value.substring(0, 30)}..."\n`;
    }
    
    text += `\n*Contains Matches:*\n`;
    for (const [key, value] of Object.entries(CUSTOM_REPLIES.contains)) {
        text += `• "${key}" → "${value.substring(0, 30)}..."\n`;
    }

    return await conn.sendMessage(from, {
        text: text,
        contextInfo: { mentionedJid: [sender] }
    }, { quoted: mek });
});

// ============================================
// 📌 EXPORT
// ============================================
module.exports = {};
