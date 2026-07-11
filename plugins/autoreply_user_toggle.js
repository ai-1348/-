const config = require('../config');
const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

// ============================================
// 🤖 AUTO REPLY PLUGIN - GHOST X MINI v4.0
// USER TOGGLE VERSION - Har banda ON/OFF kar sakta hai!
// ============================================

const DATA_DIR = path.join(__dirname, '..', 'data');
const USER_SETTINGS_FILE = path.join(DATA_DIR, 'user_auto_reply.json');
const CUSTOM_REPLIES_FILE = path.join(DATA_DIR, 'custom_replies.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default settings per user
const DEFAULT_USER_SETTINGS = {
    enabled: true,        // Auto reply ON by default
    aiMode: 'pollinations', // 'pollinations' ya 'gemini'
    cooldown: 3000,       // 3 seconds
    maxLength: 1500,      // Max reply length
    replyStyle: 'normal', // 'normal', 'funny', 'serious'
};

// Load user settings
function loadUserSettings() {
    try {
        if (fs.existsSync(USER_SETTINGS_FILE)) {
            return JSON.parse(fs.readFileSync(USER_SETTINGS_FILE, 'utf8'));
        }
    } catch (e) {
        console.error('Error loading user settings:', e);
    }
    return {};
}

// Save user settings
function saveUserSettings(settings) {
    try {
        fs.writeFileSync(USER_SETTINGS_FILE, JSON.stringify(settings, null, 2));
    } catch (e) {
        console.error('Error saving user settings:', e);
    }
}

// Get user settings (create if not exists)
function getUserSettings(userId) {
    const allSettings = loadUserSettings();
    if (!allSettings[userId]) {
        allSettings[userId] = { ...DEFAULT_USER_SETTINGS };
        saveUserSettings(allSettings);
    }
    return allSettings[userId];
}

// Update user settings
function updateUserSettings(userId, newSettings) {
    const allSettings = loadUserSettings();
    allSettings[userId] = { ...allSettings[userId], ...newSettings };
    saveUserSettings(allSettings);
}

// Load custom replies
function loadCustomReplies() {
    try {
        if (fs.existsSync(CUSTOM_REPLIES_FILE)) {
            return JSON.parse(fs.readFileSync(CUSTOM_REPLIES_FILE, 'utf8'));
        }
    } catch (e) {
        console.error('Error loading custom replies:', e);
    }
    return {
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
        group: {
            'welcome': '👋 Welcome to the group! Rules follow karein.',
            'rules': '📋 Group Rules:\n1. Respect everyone\n2. No spam\n3. No bad words\n4. Help each other',
            'admin': '👮‍♂️ Admin se baat karein agar koi problem ho!',
        }
    };
}

const CUSTOM_REPLIES = loadCustomReplies();
const userCooldowns = new Map();

// ============================================
// 🤖 AI RESPONSE FUNCTION
// ============================================

async function getAIReply(question, userSettings) {
    try {
        const axios = require('axios');
        const prompt = encodeURIComponent(question);

        let response;

        if (userSettings.aiMode === 'gemini' && config.GEMINI_API_KEY) {
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
            response = await axios.get(`https://text.pollinations.ai/${prompt}`, {
                timeout: 30000,
                headers: { 'Content-Type': 'application/json' }
            });

            let reply = response.data || "Maaf kijiye, main samajh nahi paya.";
            if (reply.length > userSettings.maxLength) {
                reply = reply.substring(0, userSettings.maxLength) + '...';
            }
            return reply;
        }

    } catch (error) {
        console.error('AI API Error:', error);
        return "Abhi jawab nahi de sakta. Thodi der baad try karein.";
    }
}

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
        // Get user settings
        const userSettings = getUserSettings(sender);

        // Check if auto reply is enabled for this user
        if (!userSettings.enabled) return;

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
        if (sender === conn.user.id) return;

        // Cooldown check
        const now = Date.now();
        const lastReply = userCooldowns.get(sender);
        if (lastReply && (now - lastReply) < userSettings.cooldown) return;
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

        // ========== AI REPLY ==========

        if (!replyText) {
            await conn.sendPresenceUpdate('composing', from);

            const aiResponse = await getAIReply(cleanBody, userSettings);
            replyText = aiResponse;

            await conn.sendPresenceUpdate('paused', from);
        }

        // ========== SEND REPLY ==========

        if (replyText) {
            replyText = replyText.replace('{name}', userName);

            await conn.sendMessage(from, {
                text: `*🤖 GHOST X MINI*\n\n${replyText}\n\n> _Auto Reply | ${userName}_`,
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
// ⚙️ USER TOGGLE COMMAND (Har banda use kar sakta hai!)
// ============================================

cmd({
    pattern: "autoreply",
    alias: ["autobot", "aireply", "myreply"],
    react: "⚙️",
    desc: "Apna auto reply ON/OFF karein",
    category: "User",
    filename: __filename
}, async (conn, mek, m, { from, sender, body, pushName }) => {

    try {
        const userSettings = getUserSettings(sender);
        const action = body.toLowerCase().trim();
        const userName = pushName || 'User';

        // ON karna
        if (action.includes('on') || action.includes('start') || action.includes('enable')) {
            updateUserSettings(sender, { enabled: true });
            return await conn.sendMessage(from, {
                text: `*✅ Auto Reply ON!*\n\nHello *${userName}*!\n\nAb se jab bhi aap kuch message karein ge, main automatically reply karunga.\n\n*Apne liye settings:*\n• Status: 🟢 ON\n• Cooldown: ${userSettings.cooldown/1000}s\n\n_OFF karne ke liye: ${config.PREFIX}autoreply off_`,
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

        // OFF karna
        else if (action.includes('off') || action.includes('stop') || action.includes('disable')) {
            updateUserSettings(sender, { enabled: false });
            return await conn.sendMessage(from, {
                text: `*❌ Auto Reply OFF!*\n\nHello *${userName}*!\n\nAb main aapko automatically reply nahi karunga.\n\nSirf jab aap command use karein ge tab hi reply milega.\n\n_ON karne ke liye: ${config.PREFIX}autoreply on_`,
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

        // Status check
        else {
            const status = userSettings.enabled ? '🟢 ON' : '🔴 OFF';
            return await conn.sendMessage(from, {
                text: `*⚙️ Auto Reply Settings - ${userName}*\n\nStatus: ${status}\nMode: ${userSettings.aiMode}\nCooldown: ${userSettings.cooldown/1000}s\nMax Length: ${userSettings.maxLength} chars\n\n*Commands:*\n${config.PREFIX}autoreply on - ON karein\n${config.PREFIX}autoreply off - OFF karein`,
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
        console.error('Auto Reply Toggle Error:', error);
        await conn.sendMessage(from, {
            text: `*❌ Error!*\n\nKuch problem aa gayi. Dobara try karein.`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }
});

// ============================================
// 🎛️ OWNER CONTROL (Sab users ke liye)
// ============================================

cmd({
    pattern: "allreply",
    alias: ["globalreply", "botreply"],
    react: "🌐",
    desc: "Global auto reply settings (Owner only)",
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
    const allSettings = loadUserSettings();

    if (action.includes('on')) {
        // Sab users ke liye ON
        for (const userId in allSettings) {
            allSettings[userId].enabled = true;
        }
        saveUserSettings(allSettings);
        return await conn.sendMessage(from, {
            text: `*🌐 Global Auto Reply ON!*\n\nSab users ke liye auto reply ON ho gaya.`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }
    else if (action.includes('off')) {
        // Sab users ke liye OFF
        for (const userId in allSettings) {
            allSettings[userId].enabled = false;
        }
        saveUserSettings(allSettings);
        return await conn.sendMessage(from, {
            text: `*🌐 Global Auto Reply OFF!*\n\nSab users ke liye auto reply OFF ho gaya.`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }
    else {
        const totalUsers = Object.keys(allSettings).length;
        const activeUsers = Object.values(allSettings).filter(s => s.enabled).length;

        return await conn.sendMessage(from, {
            text: `*🌐 Global Auto Reply Status*\n\nTotal Users: ${totalUsers}\nActive Users: ${activeUsers}\n\n${config.PREFIX}allreply on - Sab ke liye ON\n${config.PREFIX}allreply off - Sab ke liye OFF`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }
});

// ============================================
// 📌 EXPORT
// ============================================
module.exports = {};
