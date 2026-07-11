const config = require('../config');
const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

// ============================================
// 📢 CHANNEL FORWARDING PLUGIN - GHOST X MINI
// WhatsApp Newsletter/Channel Auto Forward
// ============================================

const DATA_DIR = path.join(__dirname, '..', 'data');
const CHANNEL_FILE = path.join(DATA_DIR, 'channel_settings.json');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default channel settings
const DEFAULT_CHANNEL = {
    enabled: false,
    sourceChannel: '',      // Jahan se message aaye (e.g., 120363404811118873@newsletter)
    targetGroups: [],       // Jahan forward karna hai
    targetUsers: [],        // Private users ko bhejna
    forwardType: 'all',     // 'all', 'text', 'image', 'video'
    addWatermark: true,     // Bot ka naam add karein
    filterWords: [],        // Ignore these words
    delay: 1000,            // Forward delay (ms)
};

// Load settings
function loadChannelSettings() {
    try {
        if (fs.existsSync(CHANNEL_FILE)) {
            return JSON.parse(fs.readFileSync(CHANNEL_FILE, 'utf8'));
        }
    } catch (e) {
        console.error('Error loading channel settings:', e);
    }
    return { ...DEFAULT_CHANNEL };
}

// Save settings
function saveChannelSettings(settings) {
    try {
        fs.writeFileSync(CHANNEL_FILE, JSON.stringify(settings, null, 2));
    } catch (e) {
        console.error('Error saving channel settings:', e);
    }
}

let CHANNEL_SETTINGS = loadChannelSettings();

// ============================================
// 📢 CHANNEL FORWARD HANDLER
// ============================================

cmd({
    on: "body",
    pattern: null,
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, sender, body, isGroup, isNewsletter }) => {

    try {
        // Check if channel forwarding is enabled
        if (!CHANNEL_SETTINGS.enabled) return;

        // Check if message is from source channel
        if (!CHANNEL_SETTINGS.sourceChannel) return;
        if (from !== CHANNEL_SETTINGS.sourceChannel) return;

        // Filter check
        if (CHANNEL_SETTINGS.filterWords.length > 0) {
            const lowerBody = (body || '').toLowerCase();
            for (const word of CHANNEL_SETTINGS.filterWords) {
                if (lowerBody.includes(word.toLowerCase())) return;
            }
        }

        // Determine message type
        const msgType = mek.message ? Object.keys(mek.message)[0] : 'conversation';

        // Check forward type filter
        if (CHANNEL_SETTINGS.forwardType !== 'all') {
            const typeMap = {
                'text': ['conversation', 'extendedTextMessage'],
                'image': ['imageMessage'],
                'video': ['videoMessage'],
                'audio': ['audioMessage'],
                'document': ['documentMessage'],
            };

            if (!typeMap[CHANNEL_SETTINGS.forwardType]?.includes(msgType)) return;
        }

        // Prepare forward message
        let forwardContent = {};

        if (mek.message) {
            // Copy original message
            forwardContent = JSON.parse(JSON.stringify(mek.message));

            // Add watermark if enabled
            if (CHANNEL_SETTINGS.addWatermark && forwardContent.extendedTextMessage) {
                const originalText = forwardContent.extendedTextMessage.text || '';
                forwardContent.extendedTextMessage.text = 
                    originalText + '\n\n> _Forwarded by GHOST X MINI 🤖_';
            }
        }

        // Forward to target groups
        for (const groupId of CHANNEL_SETTINGS.targetGroups) {
            try {
                await new Promise(resolve => setTimeout(resolve, CHANNEL_SETTINGS.delay));

                await conn.sendMessage(groupId, forwardContent, {
                    contextInfo: {
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: from,
                            newsletterName: "GHOST X MINI Channel",
                            serverMessageId: mek.key.id
                        }
                    }
                });

                console.log(`Forwarded to group: ${groupId}`);
            } catch (err) {
                console.error(`Failed to forward to ${groupId}:`, err.message);
            }
        }

        // Forward to target users
        for (const userId of CHANNEL_SETTINGS.targetUsers) {
            try {
                await new Promise(resolve => setTimeout(resolve, CHANNEL_SETTINGS.delay));

                await conn.sendMessage(userId, forwardContent, {
                    contextInfo: {
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: from,
                            newsletterName: "GHOST X MINI Channel",
                            serverMessageId: mek.key.id
                        }
                    }
                });

                console.log(`Forwarded to user: ${userId}`);
            } catch (err) {
                console.error(`Failed to forward to ${userId}:`, err.message);
            }
        }

    } catch (error) {
        console.error('Channel Forward Error:', error);
    }
});

// ============================================
// ⚙️ CHANNEL SETUP COMMANDS
// ============================================

// Main channel command
cmd({
    pattern: "channel",
    alias: ["ch", "newsletter", "forward"],
    react: "📢",
    desc: "Channel forwarding settings",
    category: "Owner",
    filename: __filename
}, async (conn, mek, m, { from, sender, body, isOwner, reply }) => {

    if (!isOwner) {
        return await conn.sendMessage(from, {
            text: `*❌ Sirf Owner!*`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }

    const args = body.trim().split(/\s+/);
    const action = args[1]?.toLowerCase();

    // Show status
    if (!action || action === 'status') {
        const status = CHANNEL_SETTINGS.enabled ? '🟢 ON' : '🔴 OFF';
        const targets = CHANNEL_SETTINGS.targetGroups.length + CHANNEL_SETTINGS.targetUsers.length;

        return await conn.sendMessage(from, {
            text: `*📢 CHANNEL FORWARDING STATUS*\n\n` +
                  `Status: ${status}\n` +
                  `Source: ${CHANNEL_SETTINGS.sourceChannel || 'Not set'}\n` +
                  `Target Groups: ${CHANNEL_SETTINGS.targetGroups.length}\n` +
                  `Target Users: ${CHANNEL_SETTINGS.targetUsers.length}\n` +
                  `Total Targets: ${targets}\n` +
                  `Forward Type: ${CHANNEL_SETTINGS.forwardType}\n` +
                  `Watermark: ${CHANNEL_SETTINGS.addWatermark ? 'ON' : 'OFF'}\n\n` +
                  `*Commands:*\n` +
                  `${config.PREFIX}channel on\n` +
                  `${config.PREFIX}channel off\n` +
                  `${config.PREFIX}channel set <channel_jid>\n` +
                  `${config.PREFIX}channel addgroup <group_jid>\n` +
                  `${config.PREFIX}channel adduser <user_jid>\n` +
                  `${config.PREFIX}channel remove <jid>\n` +
                  `${config.PREFIX}channel list\n` +
                  `${config.PREFIX}channel type <all/text/image/video>`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }

    // ON
    if (action === 'on') {
        CHANNEL_SETTINGS.enabled = true;
        saveChannelSettings(CHANNEL_SETTINGS);
        return await conn.sendMessage(from, {
            text: `*✅ Channel Forwarding ON!*\n\nAb channel ke messages automatically forward honge.`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }

    // OFF
    if (action === 'off') {
        CHANNEL_SETTINGS.enabled = false;
        saveChannelSettings(CHANNEL_SETTINGS);
        return await conn.sendMessage(from, {
            text: `*❌ Channel Forwarding OFF!*\n\nAb messages forward nahi honge.`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }

    // Set source channel
    if (action === 'set') {
        const channelJid = args[2];
        if (!channelJid) {
            return await conn.sendMessage(from, {
                text: `*❌ Channel JID required!*\n\nExample:\n${config.PREFIX}channel set 120363404811118873@newsletter`,
                contextInfo: { mentionedJid: [sender] }
            }, { quoted: mek });
        }

        CHANNEL_SETTINGS.sourceChannel = channelJid;
        saveChannelSettings(CHANNEL_SETTINGS);
        return await conn.sendMessage(from, {
            text: `*✅ Source Channel Set!*\n\nChannel: ${channelJid}\n\nAb is channel ke messages forward honge.`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }

    // Add target group
    if (action === 'addgroup') {
        const groupJid = args[2];
        if (!groupJid) {
            return await conn.sendMessage(from, {
                text: `*❌ Group JID required!*\n\nExample:\n${config.PREFIX}channel addgroup 123456789@g.us`,
                contextInfo: { mentionedJid: [sender] }
            }, { quoted: mek });
        }

        if (!CHANNEL_SETTINGS.targetGroups.includes(groupJid)) {
            CHANNEL_SETTINGS.targetGroups.push(groupJid);
            saveChannelSettings(CHANNEL_SETTINGS);
        }

        return await conn.sendMessage(from, {
            text: `*✅ Group Added!*\n\nGroup: ${groupJid}\nTotal Groups: ${CHANNEL_SETTINGS.targetGroups.length}`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }

    // Add target user
    if (action === 'adduser') {
        const userJid = args[2];
        if (!userJid) {
            return await conn.sendMessage(from, {
                text: `*❌ User JID required!*\n\nExample:\n${config.PREFIX}channel adduser 923001234567@s.whatsapp.net`,
                contextInfo: { mentionedJid: [sender] }
            }, { quoted: mek });
        }

        if (!CHANNEL_SETTINGS.targetUsers.includes(userJid)) {
            CHANNEL_SETTINGS.targetUsers.push(userJid);
            saveChannelSettings(CHANNEL_SETTINGS);
        }

        return await conn.sendMessage(from, {
            text: `*✅ User Added!*\n\nUser: ${userJid}\nTotal Users: ${CHANNEL_SETTINGS.targetUsers.length}`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }

    // Remove target
    if (action === 'remove') {
        const jid = args[2];
        if (!jid) {
            return await conn.sendMessage(from, {
                text: `*❌ JID required!*\n\nExample:\n${config.PREFIX}channel remove 123456789@g.us`,
                contextInfo: { mentionedJid: [sender] }
            }, { quoted: mek });
        }

        CHANNEL_SETTINGS.targetGroups = CHANNEL_SETTINGS.targetGroups.filter(id => id !== jid);
        CHANNEL_SETTINGS.targetUsers = CHANNEL_SETTINGS.targetUsers.filter(id => id !== jid);
        saveChannelSettings(CHANNEL_SETTINGS);

        return await conn.sendMessage(from, {
            text: `*🗑️ Target Removed!*\n\nJID: ${jid}`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }

    // List targets
    if (action === 'list') {
        let text = `*📋 CHANNEL TARGETS*\n\n`;

        text += `*Source Channel:*\n${CHANNEL_SETTINGS.sourceChannel || 'Not set'}\n\n`;

        text += `*Target Groups (${CHANNEL_SETTINGS.targetGroups.length}):*\n`;
        CHANNEL_SETTINGS.targetGroups.forEach((id, i) => {
            text += `${i+1}. ${id}\n`;
        });

        text += `\n*Target Users (${CHANNEL_SETTINGS.targetUsers.length}):*\n`;
        CHANNEL_SETTINGS.targetUsers.forEach((id, i) => {
            text += `${i+1}. ${id}\n`;
        });

        return await conn.sendMessage(from, {
            text: text,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }

    // Set forward type
    if (action === 'type') {
        const type = args[2]?.toLowerCase();
        const validTypes = ['all', 'text', 'image', 'video', 'audio', 'document'];

        if (!validTypes.includes(type)) {
            return await conn.sendMessage(from, {
                text: `*❌ Invalid type!*\n\nValid types: all, text, image, video, audio, document`,
                contextInfo: { mentionedJid: [sender] }
            }, { quoted: mek });
        }

        CHANNEL_SETTINGS.forwardType = type;
        saveChannelSettings(CHANNEL_SETTINGS);

        return await conn.sendMessage(from, {
            text: `*✅ Forward Type Set!*\n\nType: ${type}\n\nAb sirf ${type} messages forward honge.`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }

    // Unknown command
    return await conn.sendMessage(from, {
        text: `*❌ Unknown command!*\n\nUse ${config.PREFIX}channel for help.`,
        contextInfo: { mentionedJid: [sender] }
    }, { quoted: mek });
});

// ============================================
// 📤 QUICK FORWARD COMMAND
// ============================================

cmd({
    pattern: "forward",
    alias: ["fwd", "sendto"],
    react: "📤",
    desc: "Message ko kisi group/user ko forward karein",
    category: "Owner",
    filename: __filename
}, async (conn, mek, m, { from, sender, body, isOwner, reply, quoted }) => {

    if (!isOwner) {
        return await conn.sendMessage(from, {
            text: `*❌ Sirf Owner!*`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }

    const args = body.trim().split(/\s+/);
    const targetJid = args[1];

    if (!targetJid) {
        return await conn.sendMessage(from, {
            text: `*❌ Target JID required!*\n\nReply kisi message par karein aur likhein:\n${config.PREFIX}forward <jid>\n\nExample:\n${config.PREFIX}forward 123456789@g.us`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }

    // Check if replying to a message
    if (!quoted) {
        return await conn.sendMessage(from, {
            text: `*❌ Kisi message ka reply karein!*\n\nJis message ko forward karna hai uska reply karein.`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }

    try {
        // Forward the quoted message
        await conn.sendMessage(targetJid, quoted.message, {
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true
            }
        });

        return await conn.sendMessage(from, {
            text: `*✅ Message Forwarded!*\n\nTarget: ${targetJid}`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });

    } catch (error) {
        return await conn.sendMessage(from, {
            text: `*❌ Forward Failed!*\n\nError: ${error.message}`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }
});

// ============================================
// 📌 EXPORT
// ============================================
module.exports = {};
