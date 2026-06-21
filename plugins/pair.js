const { cmd } = require('../command');
const axios = require('axios');

const API_BASE_URL = 'https://nawazmd.vercel.app/api';

cmd({
    pattern: "pair",
    alias: ["getpair", "clonebot"],
    react: "✅",
    desc: "Get pairing code for NAWAZ-MD bot",
    category: "owner",
    use: ".pair 923427582XXX",
    filename: __filename
}, async (conn, mek, m, { senderNumber, reply, react, q }) => {
    try {

        await react('⏳');

        const phoneNumber = (q || senderNumber || "")
            .toString()
            .replace(/[^0-9]/g, '');

        if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
            await react('❌');
            return reply("❌ Invalid number!\nExample: .pair 923001234567");
        }

        const serversResponse = await axios.get(`${API_BASE_URL}/servers`, {
            timeout: 10000
        });

        const servers = serversResponse?.data?.servers;

        if (!Array.isArray(servers) || servers.length === 0) {
            await react('❌');
            return reply("❌ No servers available right now.");
        }

        const randomServer = servers[Math.floor(Math.random() * servers.length)];

        if (!randomServer?.url) {
            await react('❌');
            return reply("❌ Server configuration error.");
        }

        const response = await axios.get(`${randomServer.url}/code`, {
            params: { number: phoneNumber },
            timeout: 20000
        });

        const pairingCode = response?.data?.code;

        if (!pairingCode) {
            await react('❌');
            return reply("❌ Failed to generate pairing code. Try again later.");
        }

        await react('✅');

        // =========================
        // ❄️ ICE STYLE MESSAGE 1
        // =========================
        await conn.sendMessage(m.chat, {
            text: `
[ ICE NODE :: NAWAZ-MD SYSTEM ]

SYSTEM STATUS: FROZEN SECURE CONNECTION

....................................

INITIALIZING PAIR ENGINE...
LOADING MODULES... ✔
VERIFYING ACCESS... ✔
GENERATING CODE... ✔

....................................

PAIR CODE: ${pairingCode}

....................................

HOW TO CONNECT:
1. Open WhatsApp
2. Go to Linked Devices
3. Tap "Link a Device"
4. Enter the code

....................................

STATUS: ICE-LOCK ACTIVE / SECURE LINK ESTABLISHED
            `.trim(),

            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363426829681935@newsletter',
                    newsletterName: "NawazTechX",
                    serverMessageId: 143
                }
            }

        }, { quoted: mek });

        // =========================
        // ❄️ ICE STYLE MESSAGE 2 (ONLY CODE)
        // =========================
        await conn.sendMessage(m.chat, {
            text: `❄️ ${pairingCode}`,

            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363426829681935@newsletter',
                    newsletterName: "NawazTechX",
                    serverMessageId: 143
                }
            }

        }, { quoted: mek });

    } catch (error) {
        console.error("Pair command error:", error);
        await react('❌');
        return reply("❌ Server error! Please try again later.");
    }
});
