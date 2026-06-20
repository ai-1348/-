const fs = require('fs');
const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');
const path = require('path');
const converter = require('../data/converter');

cmd({
pattern: "menu",
desc: "Show interactive menu system",
category: "menu",
react: "🧾",
filename: __filename
}, async (conn, mek, m, { from, reply, isOwner }) => {
try {

const totalCommands = Object.keys(commands).length;  

    const botName = config.BOT_NAME || "🄳🄰🅁🄺 🄰🄳🄴🄴🄻 🄼🄳";  
    const mode = config.MODE || "public";  
    const prefix = config.PREFIX || ".";  
    const creatorName = "ԃαɾƙ-αԃҽҽʅ-ɱԃ";  
    const uptime = runtime(process.uptime());  
      
    const menuCaption = `╭✦ 𝐌ᴀғɪᴀ 𝐀ᴅᴇᴇʟ ✦─╮
│ ᴘʀᴏ ᴡʜᴀᴛsᴀᴘᴘ ʙᴏᴛ
╰──────────────⍟
╭─✧「 *𝐌𝐄𝐍𝐔-𝐋𝐈𝐒𝐓* 」-⍟
┊  ╭───────────❏
┊  ┊ *〔ᴅᴀʀᴋ ᴀᴅᴇᴇʟ ᴍᴅ〕*
┊〔1〕 📥 ᴅᴏᴡɴʟᴏᴀᴅ ᴍᴇɴᴜ
┊〔2〕👥 ɢʀᴏᴜᴘ ᴍᴇɴᴜ
┊〔3〕😄 ғᴜɴ ᴍᴇɴᴜ
┊〔4〕👑 ᴏᴡɴᴇʀ ᴍᴇɴᴜ
┊〔5〕🤖 ᴀɪ ᴍᴇɴᴜ
┊〔6〕🎎 ᴀɴɪᴍᴇ ᴍᴇɴᴜ
┊〔7〕🔄 ᴄᴏɴᴠᴇʀᴛ ᴍᴇɴᴜ
┊〔8〕📌 ᴏᴛʜᴇʀ ᴍᴇɴᴜ
┊〔9〕💞 ʀᴇᴀᴄᴛɪᴏɴ ᴍᴇɴᴜ
┊〔10〕🏠 ᴍᴀɪɴ ᴍᴇɴɪ
┊  ╰──────────❏
╰─────────────⍟

╭──❏ ⚡ USE ❏──╮
│ ʀᴇᴘʟʏ ᴡɪᴛʜ ɴᴜᴍʙᴇʀ (1-10)
│ ᴛᴀᴘ & ᴏᴘᴇɴ ᴍᴇɴᴜ 🚀
╰───────────────╯
╭────✦ ❤️‍🔥 ✦────⍟
│ᴘᴏᴡᴇʀ ʙʏ ᴍᴀғɪᴀ ᴀᴅᴇᴇʟ
╰──────────────⍟
『 ᴅᴏᴡɴʟᴏᴅᴇᴅ ᴍᴇɴᴜ 』
╭━━━──────────𖧷
*┋⍟ ғᴀᴄʙᴏᴏᴋ [ᴜʀʟ]*
*┋⍟ ᴍᴇᴅɪᴀғɪʀᴇ [ᴜʀʟ]*
*┋⍟ ᴛɪᴋᴛᴏᴋ [ᴜʀʟ]*
*┋⍟ ᴄᴜᴘᴄᴜᴛ [ᴜʀʟ]*
*┋⍟ ᴛᴡɪᴛᴛᴇʀ [ᴜʀʟ]*
*┋⍟ ɪɴsᴛᴀ [ᴜʀʟ]*
*┋⍟ ᴀᴘᴋ [ɴᴀᴍᴇ]*
*┋⍟ ɪᴍɢ [ǫᴜᴇʀʏ]*
*┋⍟ sᴏʀᴀ [ǫᴜᴇʀʏ]*
*┋⍟ ɢᴇᴍɪɴɪ [ǫᴜᴇʀʏ/ᴘʀᴏ]*
*┋⍟ ᴛɪᴋᴛᴏᴋ [ᴜʀʟ]*
*┋⍟ ᴘɪɴᴛᴇʀᴇsᴛ [ᴜʀʟ]*
*┋⍟ ᴘɪɴᴛᴇʀᴇsᴛᴠɪᴅᴇᴏ [ᴜʀʟ]*
*┋⍟ ғʙ2 [ᴜʀʟ]*
*┋⍟ ᴘɪɴᴛᴇʀᴇsᴛ [ᴜʀʟ]*
*┋⍟ sᴘᴏᴛɪғʏ [ǫᴜᴇʀʏ]*
*┋⍟ ᴘʟᴀʏ  [ɴᴀᴍᴇ/ᴜʀʟ]*
*┋⍟ ᴅᴀʀᴀᴍᴀ [ɴᴀᴍᴇ/ᴜʀʟ]*
*┋⍟ ᴠɪᴅᴇᴏ [ɴᴀᴍᴇ/ᴜʀʟ]*
╰━━━━━━━━━━━━━━━━┈⊷
『 ᴍᴀɴᴀɢᴇᴍᴇɴᴛ ᴛᴏᴏʟ 』
╭━━━───────────────𖧷
*┋⍟ ɢʀᴏᴜᴘʟɪɴᴋ*
*┋⍟ ᴋɪᴄᴋᴀʟʟ*
*┋⍟ ᴋɪᴄᴋᴀʟʟ2*
*┋⍟ ᴋɪᴄᴋᴀʟʟ3*
*┋⍟ ᴀᴅᴅ @ᴜsᴇʀ*
*┋⍟ ʀᴇᴍᴏᴠᴇ @ᴜsᴇʀ*
*┋⍟ ᴋɪᴄᴋ @ᴜsᴇʀ*
╰━━━━━━━━━━━━━━━━┈⊷
 『 ᴀᴅᴍɪɴ ᴛᴏᴏʟ 』
╭━━━───────────────𖧷
*┋⍟ ᴘʀᴏᴍᴘᴛ @ᴜsᴇʀ*
*┋⍟ ᴅᴇᴍᴏᴛᴇ @ᴜsᴇʀ*
*┋⍟ ᴅɪsᴍɪss*
*┋⍟ ʀᴇᴠᴏᴋᴇ*
*┋⍟ ᴍᴜᴛᴇ (ᴛɪᴍᴇ) 20s 2ᴍ 1ʜ
*┋⍟ ᴜɴᴍᴜᴛᴇ*
*┋⍟ ᴄᴏᴘʏɢ [ʟɪɴᴋ]*
*┋⍟ ʟᴏᴄᴋɢᴄ*
*┋⍟ ᴜɴʟᴏᴄᴋɢᴄ*
╰━━━━━━━━━━━━━━━━┈⊷
『 ᴛᴀɢ ᴛᴏᴏʟ 』
╭━━━───────────────𖧷
*┋⍟ ᴛᴀɢ @ᴜsᴇʀ*
*┋⍟ ʜɪᴅᴇᴛᴀɢ [ᴍsɢ]*
*┋⍟ ᴛᴀɢᴀʟʟ*
*┋⍟ ᴛᴀɢᴇᴀᴅᴍɪɴs*
*┋⍟ ɪɴᴠɪᴛᴇ7*
╰━━━━━━━━━━━━━━━━┈⊷
『 ғᴜɴᴍᴇɴᴜ 』
╭━━━───────────────𖧷
*┋⍟ sʜᴀᴘᴀʀ*
*┋⍟ ʀᴀᴛᴇ @ᴜsᴇʀ*
*┋⍟ ɪɴsᴜʟᴛ @ᴜsᴇʀ*
*┋⍟ ʜᴀᴄᴋ @ᴜsᴇʀ*
*┋⍟ sʜɪᴏ @ᴜsᴇʀ1 @ᴜsᴇʀ2*
*┋⍟ ᴄʜᴀʀᴀᴄᴛᴇʀ*
*┋⍟ ᴘɪᴄᴋᴜᴘ*
*┋⍟ ᴊᴏᴋᴇ*
*┋⍟ ʟᴏᴠᴇ*
*┋⍟ ʜᴀᴘᴘʏ*
*┋⍟ sᴀᴅ*
*┋⍟ ʜᴏᴛ*
*┋⍟ ʜᴇᴀʀᴛ*
*┋⍟ sʜʏ*
*┋⍟ ʙᴇᴀᴛᴜғᴜʟʟ*
*┋⍟ ᴄᴜɴғᴜᴢᴇᴅ*
*┋⍟ ᴍᴏɴ*
*┋⍟ ᴋɪss*
*┋⍟ ʙʀᴏᴋᴇ*
*┋⍟ ʜᴜʀᴛ*
╰━━━━━━━━━━━━━━━━┈⊷
『 ᴏᴡɴᴇʀ ᴍᴇɴᴜ 』
╭━━━───────────────𖧷
*┋⍟ ʙʟᴏᴄᴋ*
*┋⍟ ᴜɴʙʟᴏᴄᴋ*
*┋⍟ ғᴜʟʟᴘᴘ*
*┋⍟ sᴇᴛᴘᴘ*
*┋⍟ ʀᴇsᴛᴀʀᴛ*
*┋⍟ sʜᴜᴛᴅᴏᴡɴ*
*┋⍟ ᴜᴘᴅᴀᴛᴇ*
╰━━━━━━━━━━━━━━━━┈⊷
『 ᴛᴏᴏʟ ɪɴғᴏ 』
╭━━━───────────────𖧷
*┋⍟ ɢᴊɪᴅ*
*┋⍟ ᴊɪᴅ*
*┋⍟ ʟɪsᴛᴄᴍᴅ*
*┋⍟ ᴀʟʟᴍᴇɴᴜ*
╰━━━━━━━━━━━━━━━━┈⊷
『 ᴀɪ ᴍᴇɴᴜ 』
╭━━━───────────────𖧷
*┋⍟ ᴀɪ[ǫᴜᴇʀʏ]*
*┋⍟ ɢᴘᴛ [ǫᴜᴇʀʏ]*
*┋⍟ ɢᴘᴛ2 [ǫᴜᴇʀʏ]*
*┋⍟ ɢᴘᴛ3[ǫᴜᴇʀʏ]*
*┋⍟ ɢᴘᴛᴍɪɴɪ [ǫᴜᴇʀʏ]*
*┋⍟ ᴍᴇᴛᴀ [ǫᴜᴇʀʏ]*
╰━━━━━━━━━━━━━━━━┈⊷
『 ᴀɪ ɪᴍᴀɢᴇ 』
╭━━━───────────────𖧷
*┋⍟ ɪᴍᴀɢɪɴᴇ [ᴛᴇxᴛ]*
*┋⍟ ɪᴍᴀɢɪɴᴇ2 [ᴛᴇxᴛ]*
╰━━━━━━━━━━━━━━━━┈⊷
『 ᴀɪ ɪᴍᴀɢᴇ 』
╭━━━───────────────𖧷
*┋⍟ ʙʟᴀᴄᴋʙᴏx [ǫᴜᴇʀʏ]*
*┋⍟ ʟᴜᴍᴀ [ǫᴜᴇʀʏ]*
*┋⍟ ᴅᴊ [ǫᴜᴇʀʏ]*
*┋⍟ ᴀᴅᴇᴇʟ [ǫᴜᴇʀʏ]*
╰━━━━━━━━━━━━━━━━┈⊷
『 ᴀɪ ɪᴍᴀɢᴇ 』
╭━━━───────────────𖧷
*┋⍟ ɪᴍᴀɢᴇ*
*┋⍟ ғᴀᴄᴋ*
*┋⍟ ᴅᴏɢ*
*┋⍟ ᴀᴡᴏᴏ*
*┋⍟ ɢᴀʀʟ*
*┋⍟ ᴡᴀɪғᴜ*
*┋⍟ ɴᴋᴏᴇ*
*┋⍟ ᴍᴇɢɴᴜᴍɪɴ*
*┋⍟ ᴍᴀɪᴅ*
*┋⍟ ʟᴏʟɪ*
╰━━━━━━━━━━━━━━━━┈⊷
『 ᴀɴɪᴍᴇ ᴛᴏᴏʟ 』
╭━━━───────────────𖧷
*┋⍟ ᴀɴɪᴍᴇɢɪʀʟ1*
*┋⍟ ᴀɴɪᴍᴇɢɪʀʟ11-5*
*┋⍟ ᴀɴɪᴍᴇɢɪʀʟ5*
*┋⍟ ғᴏxɢɪʀʟ*
*┋⍟ ɴᴀʀᴜᴛᴏ*
╰━━━━━━━━━━━━━━━━┈⊷
『 ᴄᴏɴᴠᴇʀᴛ ᴍᴇɴᴜ 』
╭━━━───────────────𖧷
*┋⍟ sᴛɪᴄᴋᴇʀ [ɪᴍɢ]*
*┋⍟ sᴛɪᴄᴋᴇʀ2 [ɪᴍɢ]*
*┋⍟ ᴇᴍᴏᴊɪᴍɪx 😎+😂*
*┋⍟ ᴛᴀᴋᴇ [ɴᴀᴍᴇ,ᴛᴇxᴛ]*
*┋⍟ ᴛᴏᴍᴘ3 [ᴠɪᴅᴇᴏ]*
╰━━━━━━━━━━━━━━━━┈⊷
『 ᴛᴇxᴛ ᴛᴏᴏʟ 』
╭━━━───────────────𖧷
*┋⍟ ғᴀɴᴄʏ [ᴛᴇxᴛ]*
*┋⍟ ᴛᴛs [ᴛᴇxᴛ]*
*┋⍟ ᴛʀᴛ [ᴛᴇxᴛ]*
*┋⍟ ʙᴀsᴇ64 [ᴛᴇxᴛ]*
*┋⍟ ᴜɴʙᴀsᴇ64 [ᴛᴇxᴛ]*
╰━━━━━━━━━━━━━━━━┈⊷
『 ᴏᴛʜᴇʀ ᴍᴇɴᴜ 』
╭━━━───────────────𖧷
*┋⍟ ᴛɪᴍᴇɴᴏᴡ*
*┋⍟ ᴅᴀᴛᴇ*
*┋⍟ ᴄᴏᴜɴᴛ [ɴᴜᴍ]*
*┋⍟ ᴄᴀʟᴄɪʟᴀᴛᴇ [ᴇxᴘʀ]*
*┋⍟ ᴄᴏᴜɴᴛx*
╰━━━━━━━━━━━━━━━━┈⊷
『 ʀᴀɴᴅᴏᴍ ᴛᴏᴏʟ 』
╭━━━───────────────𖧷
*┋⍟ ғʟɪᴘ*
*┋⍟ ᴄᴏɪɴғʟɪᴘ*
*┋⍟ ʀᴄᴏʟᴜʀ*
*┋⍟ ʀᴏᴏʟ*
*┋⍟ ғᴀᴄᴛ*
╰━━━━━━━━━━━━━━━━┈⊷
『 sᴇᴀʀᴄʜ ᴛᴏᴏʟ 』
╭━━━───────────────𖧷
*┋⍟ ᴅᴇғɪɴᴇ [ᴡᴏʀᴅ]*
*┋⍟ ɴᴇᴡs [ǫᴜᴇʀʏ]*
*┋⍟ ᴍᴏᴠɪᴇ [ɴᴀᴍᴇ]*
*┋⍟ ᴡᴇᴀᴛʜᴇʀ [ʟᴏᴄ]*
╰━━━━━━━━━━━━━━━━┈⊷
『 ʀᴇᴀᴄᴛɪᴏɴ ᴛᴏᴏʟ 』
╭━━━───────────────𖧷
*┋⍟ ❤️ ᴀғғᴇᴄᴛɪᴏɴ*
*┋⍟ ᴄᴜᴅᴅʟᴇ @ᴜsᴇʀ*
*┋⍟ ʜᴜɢ @ᴜsᴇʀ*
*┋⍟ ᴋɪss @ᴜsᴇʀ*
*┋⍟ ʟɪᴄᴋ @ᴜsᴇʀ*
*┋⍟ ᴘᴀᴛ @ᴜsᴇʀ*
╰━━━━━━━━━━━━━━━━┈⊷
『 ғᴜɴɴʏ ᴛᴏᴏʟ 』
╭━━━───────────────𖧷
*┋⍟ ʙᴜʟʟʏ @ᴜsᴇʀ*
*┋⍟ ʙᴏɴᴋ @ᴜsᴇʀ*
*┋⍟ ʏᴇᴇᴛ @ᴜsᴇʀ*
*┋⍟ sʜᴀᴘ @ᴜsᴇʀ*
*┋⍟ ᴋɪʟʟ @ᴜsᴇʀ*
╰━━━━━━━━━━━━━━━━┈⊷
『 ᴇxᴘʀᴇssɪᴏɴs ᴛᴏᴏʟ 』
╭━━━───────────────𖧷
*┋⍟ ʙʟᴜsʜ @ᴜsᴇʀ*
*┋⍟ sᴍɪʟᴇ @ᴜsᴇʀ*
*┋⍟ ʜᴀᴘᴘʏ @ᴜsᴇʀ*
*┋⍟ ᴡɪɴᴋ @ᴜsᴇʀ*
*┋⍟ ᴘᴏᴋᴇ @ᴜsᴇʀ*
╰━━━━━━━━━━━━━━━━┈⊷
『 ʙᴏᴛ ɪɴғɪ 』
╭━━━───────────────𖧷
*┋⍟ ʙᴏᴛ ɪɴғᴏ*
*┋⍟ ᴘɪɴɢ*
*┋⍟ ʟɪᴠᴇ*
*┋⍟ ᴀʟɪᴠᴇ*
*┋⍟ ʀᴜɴᴛɪᴍᴇ*
*┋⍟ ᴜᴘᴛɪᴍᴇ*
*┋⍟ ʀᴇᴘᴏ*
*┋⍟ ᴏᴡɴᴇʀ*
╰━━━━━━━━━━━━━━━━┈⊷
『 ʙᴏᴛ ᴄɪɴᴛʀᴏʟs 』
╭━━━───────────────𖧷
*┋⍟ ᴍᴇɴᴜ*
*┋⍟ ᴍᴇɴᴜ2*
*┋⍟ ʀᴇsᴛᴀʀᴛ*
╰━━━━━━━━━━━━━━━━┈⊷

> ᴄʀᴇᴀᴛᴇʀ: ${creatorName}`;



const contextInfo = {  
        mentionedJid: [m.sender],  
        forwardingScore: 999,  
        isForwarded: true,  
        forwardedNewsletterMessageInfo: {  
            newsletterJid: '120363404811118873@newsletter',  
            newsletterName: creatorName,  
            serverMessageId: 143  
        }  
    };  

    const sendMenuImage = async () => {  
        try {  
            return await conn.sendMessage(  
                from,  
                {  
                    image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/pf9a6s.jpg' },  
                    caption: menuCaption,  
                    contextInfo: contextInfo  
                },  
                { quoted: mek }  
            );  
        } catch (e) {  
            console.log('Image send failed, falling back to text');  
            return await conn.sendMessage(  
                from,  
                { text: menuCaption, contextInfo: contextInfo },  
                { quoted: mek }  
            );  
        }  
    };  

    let sentMsg;  
    try {  
        sentMsg = await Promise.race([  
            sendMenuImage(),  
            new Promise((_, reject) => setTimeout(() => reject(new Error('Image send timeout')), 10000))  
        ]);  
    } catch (e) {  
        console.log('Menu send error:', e);  
        sentMsg = await conn.sendMessage(  
            from,  
            { text: menuCaption, contextInfo: contextInfo },  
            { quoted: mek }  
        );  
    }  

    // Send voice only after menu is sent successfully
    try {  
        const audioPath = path.join(__dirname, '../assets/menu-new.m4a');  
        if (fs.existsSync(audioPath)) {  
            const buffer = fs.readFileSync(audioPath);  
            const ptt = await converter.toPTT(buffer, 'm4a');  

            await conn.sendMessage(from, {  
                audio: ptt,  
                mimetype: 'audio/ogg; codecs=opus',  
                ptt: true,  
            }, { quoted: mek });  
        } else {  
            console.error('menu-new.m4a not found in assets folder');  
        }  
    } catch (audioError) {  
        console.log('Audio send error:', audioError);  
    }  
      
    const messageID = sentMsg.key.id;  

    // FIXED menuData with proper string formatting
    const menuData = {  
        '1': {  
            title: `╭━━━〔 📥 *DOWNLOAD MENU* 〕━━━┈⊷

┃ ❍ facebook [url]
┃ ❍ mediafire [url]
┃ ❍ tiktok [url]
┃ ❍ capcut [url]
┃ ❍ twitter [url]
┃ ❍ insta [url]
┃ ❍ apk [name]
┃ ❍ img [query]
┃ ❍ sora [query]
┃ ❍ Gemini [query/Prompt]
┃ ❍ tiktok2 [url]
┃ ❍ Pinterest [url]
┃ ❍ Pinterestvideo [url]
┃ ❍ fb2 [url]
┃ ❍ pinterest [url]
┃ ❍ spotify [query]
┃ ❍ play [name/url]
┃ ❍ darama [name/url]
┃ ❍ video [name/url]
╰━━━━━━━━━━━━━━━━┈⊷

> ᴄʀᴇᴀᴛᴇʀ: ${creatorName}`,
            image: true   
        },  
        '2': {   
            title: `╭━━━〔 👥 *GROUP MENU* 〕━━━┈⊷

┃ ❍ grouplink
┃ ❍ kickall
┃ ❍ kickall2
┃ ❍ kickall3
┃ ❍ add @user
┃ ❍ remove @user
┃ ❍ kick @user
┃ ─〔⚡ ADMIN TOOLS〕
┃ ❍ promote @user
┃ ❍ demote @user
┃ ❍ dismiss
┃ ❍ revoke
┃ ❍ mute [time] 20s 2m 1h
┃ ❍ unmute
┃ ❍ copyg [link]
┃ ❍ lockgc
┃ ❍ unlockgc
┃ ─〔🏷️ TAGGING〕
┃ ❍ tag @user
┃ ❍ hidetag [msg]
┃ ❍ tagall
┃ ❍ tagadmins
┃ ❍ invite
╰━━━━━━━━━━━━━━━━┈⊷

> ᴄʀᴇᴀᴛᴇʀ: ${creatorName}`,
            image: true   
        },  
        '3': {   
            title: `╭━━━〔 😄 *FUN MENU* 〕━━━┈⊷

┃ ❍ shapar
┃ ❍ rate @user
┃ ❍ insult @user
┃ ❍ hack @user
┃ ❍ ship @user1 @user2
┃ ❍ character
┃ ❍ pickup
┃ ❍ joke
┃ ❍ love
┃ ❍ happy
┃ ❍ sad
┃ ❍ hot
┃ ❍ heart
┃ ❍ shy
┃ ❍ beautiful
┃ ❍ cunfuzed
┃ ❍ mon
┃ ❍ kiss
┃ ❍ broke
┃ ❍ hurt
╰━━━━━━━━━━━━━━━━┈⊷

> ᴄʀᴇᴀᴛᴇʀ: ${creatorName}`,
            image: true   
        },  
        '4': {   
            title: `╭━━━〔 👑 *OWNER MENU* 〕━━━┈⊷

┃ ❍ block
┃ ❍ unblock
┃ ❍ fullpp
┃ ❍ setpp
┃ ❍ restart
┃ ❍ shutdown
┃ ❍ updatecmd
┃ ─〔ℹ️ INFO TOOLS〕
┃ ❍ gjid
┃ ❍ jid
┃ ❍ listcmd
┃ ❍ allmenu
╰━━━━━━━━━━━━━━━━┈⊷

> ᴄʀᴇᴀᴛᴇʀ: ${creatorName}`,
            image: true   
        },  
        '5': {   
            title: `╭━━━〔 🤖 *AI MENU* 〕━━━┈⊷

┃ ❍ ai [query]
┃ ❍ gpt3 [query]
┃ ❍ gpt2 [query]
┃ ❍ gpt [query]
┃ ❍ gptmini [query]
┃ ❍ meta [query]
┃ ─〔🎨 IMAGE AI〕
┃ ❍ imagine [text]
┃ ❍ imagine2 [text]
┃ ─〔🔍 SPECIALIZED〕
┃ ❍ blackbox [query]
┃ ❍ luma [query]
┃ ❍ dj [query]
┃ ❍ irfan [query]
╰━━━━━━━━━━━━━━━━┈⊷

> ᴄʀᴇᴀᴛᴇʀ: ${creatorName}`,
            image: true   
        },  
        '6': {   
            title: `╭━━━〔 🎎 *ANIME MENU* 〕━━━┈⊷

┃ ❍ fack
┃ ❍ dog
┃ ❍ awoo
┃ ❍ garl
┃ ❍ waifu
┃ ❍ neko
┃ ❍ megnumin
┃ ❍ maid
┃ ❍ loli
┃ ─〔🎭 CHARACTERS〕
┃ ❍ animegirl
┃ ❍ animegirl1-5
┃ ❍ anime1-5
┃ ❍ foxgirl
┃ ❍ naruto
╰━━━━━━━━━━━━━━━━┈⊷

> ᴄʀᴇᴀᴛᴇʀ: ${creatorName}`,
            image: true   
        },  
        '7': {   
            title: `╭━━━〔 🔄 *CONVERT MENU* 〕━━━┈⊷

┃ ❍ sticker [img]
┃ ❍ sticker2 [img]
┃ ❍ emojimix 😎+😂
┃ ❍ take [name,text]
┃ ❍ tomp3 [video]
┃ ─〔📝 TEXT TOOLS〕
┃ ❍ fancy [text]
┃ ❍ tts [text]
┃ ❍ trt [text]
┃ ❍ base64 [text]
┃ ❍ unbase64 [text]
╰━━━━━━━━━━━━━━━━┈⊷

> ᴄʀᴇᴀᴛᴇʀ: ${creatorName}`,
            image: true   
        },  
        '8': {   
            title: `╭━━━〔 📌 *OTHER MENU* 〕━━━┈⊷

┃ ❍ timenow
┃ ❍ date
┃ ❍ count [num]
┃ ❍ calculate [expr]
┃ ❍ countx
┃ ─〔🎲 RANDOM〕
┃ ❍ flip
┃ ❍ coinflip
┃ ❍ rcolor
┃ ❍ roll
┃ ❍ fact
┃ ─〔🔎 SEARCH〕
┃ ❍ define [word]
┃ ❍ news [query]
┃ ❍ movie [name]
┃ ❍ weather [loc]
╰━━━━━━━━━━━━━━━━┈⊷

> ᴄʀᴇᴀᴛᴇʀ: ${creatorName}`,
            image: true   
        },  
        '9': {   
            title: `╭━━━〔 💞 *REACTIONS MENU* 〕━━━┈⊷

┃ ❍ ❤️ AFFECTION
┃ ❍ cuddle @user
┃ ❍ hug @user
┃ ❍ kiss @user
┃ ❍ lick @user
┃ ❍ pat @user
┃ ─〔😂 FUNNY〕
┃ ❍ bully @user
┃ ❍ bonk @user
┃ ❍ yeet @user
┃ ❍ slap @user
┃ ❍ kill @user
┃ ─〔😊 EXPRESSIONS〕
┃ ❍ blush @user
┃ ❍ smile @user
┃ ❍ happy @user
┃ ❍ wink @user
┃ ❍ poke @user
╰━━━━━━━━━━━━━━━━┈⊷

> ᴄʀᴇᴀᴛᴇʀ: ${creatorName}`,
            image: true   
        },  
        '10': {   
            title: `╭━━━〔 🏠 *MAIN MENU* 〕━━━┈⊷

┃ ❍ 🤖 BOT INFO
┃ ❍ ping
┃ ❍ live
┃ ❍ alive
┃ ❍ runtime
┃ ❍ uptime
┃ ❍ repo
┃ ❍ owner
┃ ─〔🛠️ BOT CONTROLS〕
┃ ❍ menu
┃ ❍ menu2
┃ ❍ restart
╰━━━━━━━━━━━━━━━━┈⊷

> ᴄʀᴇᴀᴛᴇʀ: ${creatorName}`,
            image: true   
        }  
    };



const handler = async (msgData) => {  
        try {  
            const receivedMsg = msgData.messages[0];  
            if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;  

            const isReplyToMenu = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;  
              
            if (isReplyToMenu) {  
                const receivedText = receivedMsg.message.conversation ||   
                                  receivedMsg.message.extendedTextMessage?.text;  
                const senderID = receivedMsg.key.remoteJid;  

                if (menuData[receivedText]) {  
                    const selectedMenu = menuData[receivedText];  
                      
                    try {  
                        if (selectedMenu.image) {  
                            await conn.sendMessage(  
                                senderID,  
                                {  
                                    image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/pf9a6s.jpg' },  
                                    caption: selectedMenu.title,  
                                    contextInfo: contextInfo  
                                },  
                                { quoted: receivedMsg }  
                            );  
                        } else {  
                            await conn.sendMessage(  
                                senderID,  
                                { text: selectedMenu.title, contextInfo: contextInfo },  
                                { quoted: receivedMsg }  
                            );  
                        }  

                        await conn.sendMessage(senderID, {  
                            react: { text: '✅', key: receivedMsg.key }  
                        });  

                    } catch (e) {  
                        console.log('Menu reply error:', e);  
                        await conn.sendMessage(  
                            senderID,  
                            { text: selectedMenu.title, contextInfo: contextInfo },  
                            { quoted: receivedMsg }  
                        );  
                    }  

                } else {  
                    await conn.sendMessage(  
                        senderID,  
                        {  
                            text: `❌ Invalid option! Please reply with a number between 1-10. Example: 1`  
                        },  
                        { quoted: receivedMsg }  
                    );  
                }  
            }  
        } catch (e) {  
            console.log('Handler error:', e);  
        }  
    };  

    conn.ev.on("messages.upsert", handler);  

    setTimeout(() => {  
        conn.ev.off("messages.upsert", handler);  
    }, 300000);  

} catch (e) {  
    console.error('Menu Error:', e);  
    try {  
        await conn.sendMessage(  
            from,  
            {   
                text: `❌ Menu system is busy. Please try again later.`  
            },  
            { quoted: mek }  
        );  
    } catch (finalError) {  
        console.log('Final error handling failed:', finalError);  
    }  
}

});
