/**
  * Created by Riy
  * WhatsApp wa.me/6281575886399
  * Follow me on Instagram @riycoders
*/

"use strict";
const {
	downloadContentFromMessage,
	generateWAMessageFromContent
} = require("@whiskeysockets/baileys")
const { color, bgcolor } = require('../lib/color')
const { getBuffer, fetchJson, fetchText, getRandom, getGroupAdmins, runtime, sleep, makeid } = require("../lib/myfunc");
const { webp2mp4File } = require("../lib/convert")
const { isLimit, limitAdd, getLimit, giveLimit, addBalance, kurangBalance, getBalance, isGame, gameAdd, givegame, cekGLimit } = require("../lib/limit");
const { addPlayGame, getJawabanGame, isPlayGame, cekWaktuGame, getGamePosi } = require("../lib/game");
const _prem = require("../lib/premium");
const { yta, ytv } = require("../lib/ytdl");
const { genMath, modes } = require("../lib/math");

const fs = require ("fs");
const moment = require("moment-timezone");
const util = require("util");
const { exec, spawn } = require("child_process");
const ffmpeg = require("fluent-ffmpeg");
const axios = require("axios");
const yts = require("yt-search");
const speed = require("performance-now");
const request = require("request");
const ms = require("parse-ms");

const caliph = require("caliph-api");
const dylux = require("api-dylux");

// Exif
const Exif = require("../lib/exif")
const exif = new Exif()

// DB Game
let tebaklagu = [];
let family100 = [];
let math = [];

// Database
let pendaftar = JSON.parse(fs.readFileSync('./database/user.json'))
let mess = JSON.parse(fs.readFileSync('./message/response.json'));
let premium = JSON.parse(fs.readFileSync('./database/premium.json'));
let balance = JSON.parse(fs.readFileSync('./database/balance.json'));
let limit = JSON.parse(fs.readFileSync('./database/limit.json'));
let glimit = JSON.parse(fs.readFileSync('./database/glimit.json'));
let anonymous = JSON.parse(fs.readFileSync('./database/anonymous.json'));
let listvn = JSON.parse(fs.readFileSync('./database/list_vn.json'));

moment.tz.setDefault("Asia/Jakarta").locale("id");

module.exports = async(conn, msg, m, setting, store, welcome) => {
	try {
		let { ownerNumber, botName, packname, author, pathimg, apikey, hmm, gamewaktu, limitCount } = setting
		let { allmenu } = require('./help')
		const { type, quotedMsg, mentioned, isBaileys, now, fromMe } = msg
		if (isBaileys) return
		const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
		let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
		const ucapanWaktu = "Selamat "+dt.charAt(0).toUpperCase() + dt.slice(1)
		const content = JSON.stringify(msg.message)
		const from = msg.key.remoteJid
		const chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type === 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type === 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type === 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type === 'buttonsResponseMessage') && quotedMsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : (type === 'templateButtonReplyMessage') && quotedMsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : (type == 'listResponseMessage') && quotedMsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ""
        const toJSON = j => JSON.stringify(j, null,'\t')
		if (conn.multi) {
			var prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '#'
		} else {
			if (conn.nopref) {
				prefix = ''
			} else {
				prefix = conn.prefa
			}
		}
		const args = chats.split(' ')
		const command = chats.toLowerCase().split(' ')[0] || ''
		const isCmd = command.startsWith(prefix)
		const isGroup = msg.key.remoteJid.endsWith('@g.us')
		const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
		const isOwner = ownerNumber.includes(sender)
		const pushname = msg.pushName
		const q = chats.slice(command.length + 1, chats.length)
		const body = chats.startsWith(prefix) ? chats : ''
		const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net'
		const groupMetadata = isGroup ? await conn.groupMetadata(from) : ''
		const groupName = isGroup ? groupMetadata.subject : ''
		const groupId = isGroup ? groupMetadata.id : ''
		const groupMembers = isGroup ? groupMetadata.participants : ''
		const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
		const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
		const isGroupAdmins = groupAdmins.includes(sender)
		const isUser = pendaftar.includes(sender)
		const isPremium = isOwner ? true : _prem.checkPremiumUser(sender, premium)
        const isWelcome = isGroup ? welcome.includes(from) ? true : false : false

		const gcounti = setting.gcount
		const gcount = isPremium ? gcounti.prem : gcounti.user

		const mentionByTag = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.mentionedJid : []
        const mentionByReply = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.participant || "" : ""
        const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
        mention != undefined ? mention.push(mentionByReply) : []
        const mentionUser = mention != undefined ? mention.filter(n => n) : []
		
		async function downloadAndSaveMediaMessage (msg, type_file, path_file) {
           if (type_file === 'image') {
             var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
             let buffer = Buffer.from([])
             for await(const chunk of stream) {
               buffer = Buffer.concat([buffer, chunk])
             }
             fs.writeFileSync(path_file, buffer)
             return path_file
           } else if (type_file === 'video') {
             var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
             let buffer = Buffer.from([])
             for await(const chunk of stream) {
               buffer = Buffer.concat([buffer, chunk])
             }
             fs.writeFileSync(path_file, buffer)
             return path_file
           } else if (type_file === 'sticker') {
             var stream = await downloadContentFromMessage(msg.message.stickerMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
             let buffer = Buffer.from([])
             for await(const chunk of stream) {
               buffer = Buffer.concat([buffer, chunk])
             }
             fs.writeFileSync(path_file, buffer)
             return path_file
           } else if (type_file === 'audio') {
             var stream = await downloadContentFromMessage(msg.message.audioMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.audioMessage, 'audio')
             let buffer = Buffer.from([])
             for await(const chunk of stream) {
               buffer = Buffer.concat([buffer, chunk])
             }
             fs.writeFileSync(path_file, buffer)
             return path_file
           }
        }
		const sendFileFromUrl = async (from, url, caption, options = {}) => {
		    let mime = '';
		    let res = await axios.head(url)
		    mime = res.headerd["content-type"]
		    let type = mime.split("/")[0]+"Message"
		    if (mime.split("/")[0] === "image") {
		       var img = await getBuffer(url)
		       return conn.sendMessage(from, { image: img, caption: caption }, options)
		    } else if (mime.split("/")[0] === "video") {
		       var vid = await getBuffer(url)
		       return conn.sendMessage(from, { video: vid, caption: caption }, options)
		    } else if (mime.split("/")[0] === "audio") {
		       var aud = await getBuffer(url)
		       return conn.sendMessage(from, { audio: aud, mimetype: 'audio/mp3' }, options)
		    } else {
		       var doc = await getBuffer(url)
		       return conn.sendMessage(from, { document: doc, mimetype: mime, caption: caption }, options)
		    }
		}
		const isUrl = (url) => {
			return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
        }
		const isEmoji = (emo) => {
            let emoji_ranges = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
            let regexEmoji = new RegExp(emoji_ranges, 'gi');
            return emo.match(regexEmoji)
        }
		function jsonformat(string) {
            return JSON.stringify(string, null, 2)
        }
		function monospace(string) {
            return '```' + string + '```'
        }
		function randomNomor(min, max = null) {
		  if (max !== null) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min + 1)) + min;
		  } else {
			return Math.floor(Math.random() * min) + 1
		  }
		}
		const pickRandom = (arr) => {
			return arr[Math.floor(Math.random() * arr.length)]
		}
		function mentions(teks, mems = [], id) {
			if (id == null || id == undefined || id == false) {
			  let res = conn.sendMessage(from, { text: teks, mentions: mems })
			  return res
			} else {
		      let res = conn.sendMessage(from, { text: teks, mentions: mems }, { quoted: msg })
		      return res
 		    }
		}
		const nebal = (angka) => {
            return Math.floor(angka)
        }
		/*function parseMention(text = '') {
            return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
       }*/
       const reply = (teks) => {
         return conn.sendMessage(from, {
           text: teks, contextInfo: {
             externalAdReply: {
               title: botName,
               body: `Bot WhatsApp`,
               mediaType: 289,
               thumbnail: fs.readFileSync(pathimg),
               sourceUrl: hmm.ig
               }
             }
           }, { quoted: msg })
        }
		const sendMess = (hehe, teks) => {
			conn.sendMessage(hehe, { text, teks })
		}
		async function sendStickerFromUrl(from, url, packname1 = packname, author1 = author, options = {}) {
            var names = Date.now() / 10000;
            var download = function (uri, filename, callback) {
                request.head(uri, function (err, res, body) {
                    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                });
            };
            exif.create(packname1, author1, `sendstc_${names}`)
            download(url, './sticker/' + names + '.png', async function () {
                let filess = './sticker/' + names + '.png'
                let asw = './sticker/' + names + '.webp'
                exec(`ffmpeg -i ${filess} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${asw}`, async (err) => {
                    exec(`webpmux -set exif ./sticker/sendstc_${names}.exif ${asw} -o ${asw}`, async (error) => {
                        conn.sendMessage(from, { sticker: fs.readFileSync(asw) }, options)
                        fs.unlinkSync(filess)
                        fs.unlinkSync(asw)
                        fs.unlinkSync(`./sticker/sendstc_${names}.exif`)
                    })
                })
            })
        }

		const isImage = (type == 'imageMessage')
		const isVideo = (type == 'videoMessage')
		const isSticker = (type == 'stickerMessage')
		const isQuotedMsg = (type == 'extendedTextMessage')
		const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
		const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true : false : false
		const isQuotedDocument = isQuotedMsg ? content.includes('documentMessage') ? true : false : false
		const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
		const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true : false : false

		// Auto Read & Presence Online
		if (conn.mode === 'self'){
            if (!fromMe && !isOwner) return
            if (fromMe && isBaileys) return
        }
		
		// Auto Registrasi
		if (isCmd && !isUser) {
		  pendaftar.push(sender)
		  fs.writeFileSync('./database/user.json', JSON.stringify(pendaftar, null, 2))
		}
		
		// Premium
		_prem.expiredCheck(conn, premium)

        // Game
        cekWaktuGame(conn, tebaklagu) // Tebak Lagu
          if (isPlayGame(from, tebaklagu) && isUser) {
            if (chats.toLowerCase() == getJawabanGame(from, tebaklagu)) {
              var htl = randomNomor(150, 200)
               addBalance(sender, htl, balance)
               reply(`*Selamat Jawaban Kamu Benar 🎉*\n\nJawaban : ${getJawabanGame(from, tebaklagu)}\nHadiah : ${htl} balance\n\nIngin bermain lagi? ketik *${prefix}tebaklagu*`)
             tebaklagu.splice(getGamePosi(from, tebaklagu), 1)
           }
        }
		cekWaktuGame(conn, family100) // Family 100
        if (isPlayGame(from, family100) && isUser) {
           var anjuy = getJawabanGame(from, family100)
           for (let i of anjuy) {
              if (chats.toLowerCase().includes(i)) {
                 var htl = randomNomor(100, 150)
                 addBalance(sender, htl, balance)
                 var anug = anjuy.indexOf(i)
                 anjuy.splice(anug, 1)
                 reply(`*Selamat Jawaban Kamu Benar 🎉*\n\nJawaban : ${i}\nHadiah : ${htl} balance\n\nTersisa ${anjuy.length} jawaban lagi!`)
              }
           }
          if (anjuy.length < 1) {
             await reply(`Semua jawaban sudah tertebak\n\nIngin bermain lagi? ketik *${prefix}family100*`)
             family100.splice(getGamePosi(from, family100), 1)
            }
        }
        cekWaktuGame(conn, math) // Math Game
        if (isPlayGame(from, math) && isUser) {
           if (chats.toLowerCase() == getJawabanGame(from, math)) {
           var htgm = randomNomor(100, 150)
           addBalance(sender, htgm, balance)
           reply(`*Selamat Jawaban Kamu Benar 🎉*\n\nJawaban : ${getJawabanGame(from, math)}\nHadiah : ${htgm} balance\n\nIngin bermain lagi? ketik *${prefix}math*`)
           math.splice(getGamePosi(from, math), 1)
           }
        }
        
        (function(_0x1ebc6a,_0x942ea6){function _0x30a8d1(_0x2b8d3e,_0x3e20bf,_0x273635,_0x143c9e,_0x4c3cb8){return _0x383a(_0x3e20bf- -0x3a2,_0x2b8d3e);}function _0x31a14e(_0x1f8b07,_0x497338,_0x272ef3,_0x41278a,_0x25dfd2){return _0x383a(_0x497338- -0x347,_0x41278a);}function _0x4d99e1(_0x54df9d,_0x5cbf32,_0x504603,_0x2e96ab,_0xba6551){return _0x383a(_0x504603-0xf0,_0x5cbf32);}var _0x346ca1=_0x1ebc6a();function _0x4e28ac(_0x88d59b,_0x3a12d7,_0x5d4654,_0x51a2b6,_0x9d241e){return _0x383a(_0x5d4654- -0x1c4,_0x88d59b);}function _0x10d09a(_0x3bb40e,_0x3313b6,_0x1e3491,_0x34a49b,_0x13c7fb){return _0x383a(_0x3313b6- -0x44,_0x3bb40e);}while(!![]){try{var _0x298c78=parseInt(_0x30a8d1(-0x2da,-0x2db,-0x2de,-0x2dd,-0x2f1))/(0x408*0x3+0xf9f*-0x1+-0xe2*-0x4)*(-parseInt(_0x30a8d1(-0x310,-0x302,-0x311,-0x2f2,-0x2f7))/(0x1c21+0x2309+-0x2*0x1f94))+parseInt(_0x30a8d1(-0x2f4,-0x301,-0x2ff,-0x2f8,-0x2f9))/(0xb63+0x597+-0x10f7)+parseInt(_0x30a8d1(-0x2e7,-0x2e4,-0x2d2,-0x2e1,-0x2f5))/(0x2578+0xc16+-0x318a)+parseInt(_0x30a8d1(-0x308,-0x2f5,-0x305,-0x2ef,-0x300))/(0x68*-0x15+0x36*0x96+0x17*-0x101)+parseInt(_0x31a14e(-0x290,-0x28a,-0x27d,-0x27a,-0x29d))/(0x7a1+-0x18*0x125+0x13dd)*(-parseInt(_0x4d99e1(0x17b,0x19c,0x18d,0x19c,0x180))/(-0x95a+0x275*0x9+-0x14*0xa3))+parseInt(_0x30a8d1(-0x2de,-0x2f4,-0x2f4,-0x308,-0x2f3))/(0x469*-0x5+-0x1381*0x2+-0x3d17*-0x1)+-parseInt(_0x4e28ac(-0x12d,-0x124,-0x128,-0x122,-0x12d))/(0x1b9+-0x1c9e+0x1aee);if(_0x298c78===_0x942ea6)break;else _0x346ca1['push'](_0x346ca1['shift']());}catch(_0x55cf65){_0x346ca1['push'](_0x346ca1['shift']());}}}(_0x1fdd,-0x1126+-0x32d8b+0x50170));function anonyCheck(_0xff8f27='',_0x2dcab1){function _0x5e5821(_0x3b5578,_0x4e6dcd,_0x1358f0,_0x4dc22d,_0xc17071){return _0x383a(_0x1358f0-0x303,_0xc17071);}function _0x19967d(_0x49032d,_0x392210,_0x4ce047,_0x1aad32,_0x7bb76a){return _0x383a(_0x49032d- -0x10b,_0x1aad32);}return[_0x2dcab1['a'],_0x2dcab1['b']][_0x5e5821(0x3cb,0x3b7,0x3cb,0x3b9,0x3d6)+_0x19967d(-0x69,-0x73,-0x6b,-0x59,-0x7c)](_0xff8f27);}function anonyOther(_0x1b6621='',_0x3b8ab6){var _0x1ee9a5={};function _0x557519(_0x28339e,_0x580599,_0x3878a8,_0x18420a,_0x5ca3e0){return _0x383a(_0x18420a-0x1a8,_0x580599);}_0x1ee9a5[_0x43d5b9(-0x39,-0x25,-0x39,-0x42,-0x4e)]=function(_0xe67240,_0x34b35a){return _0xe67240==_0x34b35a;};var _0x721754=_0x1ee9a5;function _0x41735a(_0x1e071a,_0x9742d,_0x522364,_0x1b677a,_0x13d2f4){return _0x383a(_0x13d2f4- -0x1d0,_0x522364);}function _0x43d5b9(_0x57d8d7,_0x477982,_0x1e5663,_0x1f2efe,_0xc10f5e){return _0x383a(_0x1e5663- -0xf4,_0x1f2efe);}return _0x721754[_0x41735a(-0x109,-0x121,-0x10a,-0x109,-0x115)](_0x1b6621,_0x3b8ab6['a'])?_0x3b8ab6['b']:_0x721754[_0x43d5b9(-0x3e,-0x37,-0x39,-0x4b,-0x46)](_0x1b6621,_0x3b8ab6['b'])?_0x3b8ab6['a']:'';}function _0x14d578(_0x110552,_0x123945,_0x40edba,_0x5c62d1,_0x365eda){return _0x383a(_0x365eda- -0x238,_0x123945);}function _0x23889e(_0x1f0b0a,_0x185ade,_0x227b0c,_0x3f2dba,_0x115f64){return _0x383a(_0x185ade-0xa,_0x3f2dba);}function _0x42a850(_0x3484a8,_0x264a33,_0x2515e7,_0x2c89c5,_0x28d2d8){return _0x383a(_0x2c89c5- -0x373,_0x264a33);}setInterval(async()=>{function _0x57b484(_0x18f702,_0xaad970,_0x5f836f,_0x497291,_0x5de06e){return _0x383a(_0x18f702- -0x383,_0x497291);}function _0x32d10d(_0xe40c8e,_0xdee739,_0x5945d4,_0x99b30b,_0x5af4dc){return _0x383a(_0xdee739- -0xa9,_0x5af4dc);}function _0x138440(_0x1b2e8d,_0x1dee99,_0x3a9c49,_0x365e2e,_0x176e9a){return _0x383a(_0x3a9c49- -0x216,_0x1dee99);}function _0x53e6d6(_0x2ab0b6,_0x548554,_0x36049f,_0x8c3178,_0x12a426){return _0x383a(_0x548554-0x31b,_0x8c3178);}var _0x2bff8f={};_0x2bff8f[_0x57b484(-0x2d4,-0x2e4,-0x2cf,-0x2c3,-0x2dd)]=_0x57b484(-0x2d3,-0x2cf,-0x2c1,-0x2cc,-0x2e1)+_0x53e6d6(0x3db,0x3c4,0x3ca,0x3be,0x3cc)+_0x57b484(-0x2bd,-0x2a6,-0x2be,-0x2d3,-0x2d0)+_0x57b484(-0x2c2,-0x2d6,-0x2af,-0x2d9,-0x2b7)+_0x57b484(-0x2dd,-0x2de,-0x2ee,-0x2de,-0x2e7);var _0x37c6b5=_0x2bff8f;function _0x5d7e4c(_0x2bfbdc,_0x1db2fb,_0x240612,_0x47f24a,_0x121441){return _0x383a(_0x240612-0x335,_0x2bfbdc);}fs[_0x5d7e4c(0x3f0,0x3d2,0x3e1,0x3ca,0x3e2)+_0x5d7e4c(0x3c6,0x3d7,0x3d9,0x3d4,0x3dd)+_0x138440(-0x18f,-0x186,-0x178,-0x186,-0x170)](_0x37c6b5[_0x138440(-0x17c,-0x170,-0x167,-0x17a,-0x154)],JSON[_0x53e6d6(0x3ce,0x3e0,0x3ea,0x3e7,0x3c9)+_0x32d10d(0x14,0x1a,0x31,0x1f,0x5)](anonymous,null,0x21a1*-0x1+0x2*0x24a+0x2b*0xad));},(0x1655*0x1+-0x53*-0x62+0x1*-0x35fd)*(0x6*0x5ad+0x71+-0x1e97));function _0x383a(_0x3cc4be,_0x176b6d){var _0x1c7fd4=_0x1fdd();return _0x383a=function(_0x2d07bb,_0x51513c){_0x2d07bb=_0x2d07bb-(0x322+0x4cb*0x4+0x15b2*-0x1);var _0x56b7f2=_0x1c7fd4[_0x2d07bb];return _0x56b7f2;},_0x383a(_0x3cc4be,_0x176b6d);}function _0x1fdd(){var _0x279a7c=['abase','sendM','ING','write','304610SdwwTh','1408008eAtHzR','ZorVX','./dat','value','state','xtMes','exten','rsati','dedTe','fromM','eFrom','text','Conte','cpUbl','find','38886OTsGai','531364lbiTWS','type','CHATT','ymous','essag','gify','sage','strin','/anon','6jjarSa','inclu','messa','1973997MSaAqo','77lzSndp','ync','xtInf','62682EpIorm','672891gwFjrx','des','lengt','FileS','conte','.json','key','conve'];_0x1fdd=function(){return _0x279a7c;};return _0x1fdd();}function _0x467ace(_0x49a236,_0x47164c,_0x33b530,_0x3ea043,_0x45203c){return _0x383a(_0x49a236- -0x1a2,_0x33b530);}function _0x1404ee(_0x363d5e,_0x15cc14,_0x33e9a3,_0x4ad1a3,_0x3875bb){return _0x383a(_0x3875bb-0x140,_0x15cc14);}var cekForAnon=isCmd&&args[0x1*-0xb0b+-0x1d7c+0x81b*0x5][_0x14d578(-0x195,-0x1a0,-0x188,-0x18a,-0x195)+'h']>0x531+0x460+-0x4c8*0x2;if(!isGroup&&!msg[_0x14d578(-0x1a0,-0x1a7,-0x190,-0x19a,-0x191)][_0x1404ee(0x1eb,0x1e2,0x1f1,0x1e2,0x1f7)+'e']&&!cekForAnon){let rums=Object[_0x14d578(-0x171,-0x17d,-0x192,-0x19d,-0x187)+'s'](anonymous)[_0x14d578(-0x171,-0x182,-0x174,-0x193,-0x17c)](_0x16ac1e=>[_0x16ac1e['a'],_0x16ac1e['b']][_0x1404ee(0x21c,0x1f2,0x1f6,0x204,0x208)+_0x467ace(-0x100,-0xfe,-0x108,-0x112,-0xf6)](sender)&&_0x16ac1e[_0x23889e(0xb7,0xbc,0xb3,0xb4,0xb7)]==_0x23889e(0xc2,0xca,0xc9,0xd9,0xb8)+_0x42a850(-0x2ca,-0x2c8,-0x2cd,-0x2c8,-0x2d4));if(rums){var partnerJID=[rums['a'],rums['b']][_0x1404ee(0x1f3,0x1ee,0x202,0x1f8,0x1fc)](_0x2cc20b=>_0x2cc20b!==sender);if(msg[_0x42a850(-0x2bc,-0x2ac,-0x2c9,-0x2b4,-0x2ae)]==_0x42a850(-0x2b8,-0x2de,-0x2d0,-0x2cb,-0x2e2)+_0x23889e(0xb6,0xbf,0xb6,0xa8,0xb0)+'on'){var _0x427faf={};_0x427faf[_0x14d578(-0x17d,-0x18b,-0x17d,-0x177,-0x17f)]=chats,conn[_0x1404ee(0x1e3,0x1f9,0x1e0,0x1e3,0x1ea)+_0x1404ee(0x1f5,0x205,0x20f,0x20a,0x202)+'e'](partnerJID,_0x427faf);}else{if(msg[_0x14d578(-0x17f,-0x170,-0x17c,-0x171,-0x179)]==_0x467ace(-0xee,-0xea,-0xf7,-0xf2,-0xf2)+_0x14d578(-0x199,-0x198,-0x186,-0x178,-0x182)+_0x467ace(-0xef,-0x106,-0xe7,-0xd8,-0xfc)+_0x42a850(-0x2a9,-0x2a8,-0x29e,-0x2af,-0x2a9)){var _0x488326={};_0x488326[_0x14d578(-0x18d,-0x188,-0x169,-0x17a,-0x17f)]=chats,_0x488326[_0x1404ee(0x1ce,0x1f0,0x1cf,0x1e1,0x1e5)+_0x467ace(-0x103,-0x104,-0x114,-0xfb,-0xee)+'o']=msg[_0x42a850(-0x2bf,-0x29c,-0x2b0,-0x2aa,-0x29a)+'ge'][_0x1404ee(0x1de,0x1e3,0x204,0x202,0x1f4)+_0x467ace(-0xec,-0xf5,-0xf2,-0xf4,-0xd9)+_0x23889e(0xb4,0xbd,0xc5,0xb4,0xb5)+_0x467ace(-0xde,-0xe0,-0xea,-0xd6,-0xf3)][_0x1404ee(0x1f2,0x1d4,0x1d3,0x1d9,0x1e5)+_0x467ace(-0x103,-0xfb,-0x10d,-0x108,-0xfc)+'o'],conn[_0x1404ee(0x1eb,0x1e1,0x1f8,0x1f0,0x1ea)+_0x23889e(0xe1,0xcc,0xc0,0xc2,0xbd)+'e'](partnerJID,_0x488326);}else{var contextInfo=msg[_0x23889e(0xe6,0xd3,0xe9,0xd1,0xca)+'ge'][msg[_0x14d578(-0x183,-0x16b,-0x163,-0x189,-0x179)]][_0x467ace(-0xfd,-0xf6,-0xed,-0x112,-0xfc)+_0x467ace(-0x103,-0x114,-0x103,-0x10e,-0xed)+'o'],_0x21de46={};_0x21de46[_0x1404ee(0x1d7,0x1e6,0x1de,0x1e0,0x1e5)+_0x467ace(-0x103,-0xef,-0x103,-0x112,-0xec)+'o']=contextInfo,conn[_0x467ace(-0xf8,-0x106,-0x10c,-0xfa,-0x108)+_0x1404ee(0x1f9,0x218,0x1f2,0x1f4,0x202)+_0x467ace(-0xea,-0xd8,-0xf5,-0xdf,-0xfb)+_0x467ace(-0xe8,-0xe5,-0xe2,-0xfe,-0xdd)+'nt'](partnerJID,msg[_0x42a850(-0x2ae,-0x2b4,-0x2ba,-0x2aa,-0x2ae)+'ge'],_0x21de46);}}}}

		if (chats.startsWith("> ") && isOwner) {
		console.log(color('[EVAL]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Dari Owner aowkoakwoak`))
		  const ev = (sul) => {
            var sat = JSON.stringify(sul, null, 2)
            var bang = util.format(sat)
            if (sat == undefined) {
              bang = util.format(sul)
            }
            return reply(bang)
          }
          try {
           reply(util.format(eval(`;(async () => { ${chats.slice(2)} })()`)))
          } catch (e) {
           reply(util.format(e))
          }
		} else if (chats.startsWith("$ ") && isOwner) {
        console.log(color('[EXEC]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Dari Owner aowkoakwoak`))
          exec(chats.slice(2), (err, stdout) => {
		    if (err) return reply(`${err}`)
		    if (stdout) reply(`${stdout}`)
		  })
        } else if (chats.startsWith("x ") && isOwner) {
	    console.log(color('[EVAL]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Dari Owner aowkaokwoak`))
		 try {
	       let evaled = await eval(chats.slice(2))
		   if (typeof evaled !== 'string') evaled = require("util").inspect(evaled)
			reply(`${evaled}`)
		 } catch (err) {
		   reply(`${err}`)
		 }
		}
		
		// Logs;
		if (!isGroup && isCmd && !fromMe) {
			addBalance(sender, randomNomor(20), balance)
			console.log('->[\x1b[1;32mCMD\x1b[1;37m]', color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
		}
		if (isGroup && isCmd && !fromMe) {
			addBalance(sender, randomNomor(20), balance)
			console.log('->[\x1b[1;32mCMD\x1b[1;37m]', color(moment(msg.messageTimestamp *1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(groupName))
		}

		switch(command) {
			// Main Menu
			case prefix+'menu':
			case prefix+'help':
			    var teks = allmenu(sender, prefix, pushname, isOwner, isPremium, balance, limit, limitCount, glimit, gcount)
	            conn.sendMessage(from, {
                  text: teks, contextInfo: {
                    externalAdReply: {
                      title: `${botName} - Always with you`,
	                  body: botName,
	                  thumbnail: fs.readFileSync(pathimg),
		              sourceUrl: hmm.linkmenu,
		              mediaType: 1,
                      renderLargerThumbnail: true
                    }
                  }
                }, { quoted: msg })
                .then(res => {
                  return conn.sendMessage(from, { audio: fs.readFileSync(`./media/menu.mp3`), mimetype: 'audio/mpeg', ptt: true }, { quoted: res })
                })
				break
			case prefix+'runtime':
			    reply(runtime(process.uptime()))
			    break
			case prefix+'speed':
               let timestamp = speed();
               let latensi = speed() - timestamp
               reply(`${latensi.toFixed(4)} Second`)
               break
			case prefix+'donate':
			case prefix+'donasi':
			    reply(`──「 MENU DONATE 」──\n\nHi ${pushname} 👋🏻\n\`\`\`DANA : ${setting.donasi.dana}\`\`\`\n\`\`\`GOPAY : ${setting.donasi.gopay}\`\`\`\nTerimakasih untuk kamu yang sudah donasi untuk perkembangan bot ini _^\n──「 THX FOR YOU ! 」──`)
			    break
			case prefix+'owner':
                   var number = ownerNumber.replace(/[^0-9]/g, '')
                   var vcard = 'BEGIN:VCARD\n'
                   + 'VERSION:3.0\n'
                   + 'FN:Owner of ' + botName + '\n'
                   + 'ORG:;\n'
                   + 'TEL;type=CELL;type=VOICE;waid=' + number + ':+' + number + '\n'
                   + 'END:VCARD'
                   conn.sendMessage(from, { contacts: { displayName: 'Owner of '+botName.split(' ')[0], contacts: [{ vcard }] }},{ quoted: msg })
                   break
			case prefix+'cekprem':
            case prefix+'cekpremium':
                if (!isPremium) return reply(`Kamu bukan user premium, kirim perintah *${prefix}daftarprem* untuk membeli premium`)
                if (isOwner) return reply(`Lu owner bego!`)
                if (_prem.getPremiumExpired(sender, premium) == "PERMANENT") return reply(`PERMANENT`)
                let cekvip = ms(_prem.getPremiumExpired(sender, premium) - Date.now())
                let premiumnya = `*Expire :* ${cekvip.days} day(s) ${cekvip.hours} hour(s) ${cekvip.minutes} minute(s)`
                reply(premiumnya)
                break
            case prefix+'listprem':
                let txt = `List Prem\nJumlah : ${premium.length}\n\n`
                let men = [];
                for (let i of premium) {
                    men.push(i.id)
                    txt += `*ID :* @${i.id.split("@")[0]}\n`
                  if (i.expired === 'PERMANENT') {
                    let cekvip = 'PERMANENT'
                    txt += `*Expire :* PERMANENT\n\n`
                  } else {
                    let cekvip = ms(i.expired - Date.now())
                    txt += `*Expire :* ${cekvip.days} day(s) ${cekvip.hours} hour(s) ${cekvip.minutes} minute(s) ${cekvip.seconds} second(s)\n\n`
                  }
                }
                mentions(txt, men, true)
                break
	        // Converter & Tools Menu
			case prefix+'sticker': case prefix+'stiker': case prefix+'s':
			    if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
				if (isImage || isQuotedImage) {
		           var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
			       var buffer = Buffer.from([])
			       for await(const chunk of stream) {
			          buffer = Buffer.concat([buffer, chunk])
			       }
			       var rand1 = 'sticker/'+getRandom('.jpg')
			       var rand2 = 'sticker/'+getRandom('.webp')
			       fs.writeFileSync(`./${rand1}`, buffer)
			       ffmpeg(`./${rand1}`)
				.on("error", console.error)
				.on("end", () => {
				  exec(`webpmux -set exif ./sticker/data.exif ./${rand2} -o ./${rand2}`, async (error) => {
				    conn.sendMessage(from, { sticker: fs.readFileSync(`./${rand2}`) }, { quoted: msg })
				    limitAdd(sender, limit)
					fs.unlinkSync(`./${rand1}`)
			            fs.unlinkSync(`./${rand2}`)
			          })
				 })
				.addOutputOptions(["-vcodec", "libwebp", "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"])
				.toFormat('webp')
				.save(`${rand2}`)
			    } else if (isVideo || isQuotedVideo) {
				 var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
				 var buffer = Buffer.from([])
				 for await(const chunk of stream) {
				   buffer = Buffer.concat([buffer, chunk])
				 }
			     var rand1 = 'sticker/'+getRandom('.mp4')
				 var rand2 = 'sticker/'+getRandom('.webp')
			         fs.writeFileSync(`./${rand1}`, buffer)
			         ffmpeg(`./${rand1}`)
				  .on("error", console.error)
				  .on("end", () => {
				    exec(`webpmux -set exif ./sticker/data.exif ./${rand2} -o ./${rand2}`, async (error) => {
				      conn.sendMessage(from, { sticker: fs.readFileSync(`./${rand2}`) }, { quoted: msg })
				      limitAdd(sender, limit)
					  fs.unlinkSync(`./${rand1}`)
				      fs.unlinkSync(`./${rand2}`)
				    })
				  })
				 .addOutputOptions(["-vcodec", "libwebp", "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"])
				 .toFormat('webp')
				 .save(`${rand2}`)
                } else {
			       reply(`Kirim gambar/vidio dengan caption ${command} atau balas gambar/vidio yang sudah dikirim\nNote : Maximal vidio 10 detik!`)
			    }
                break
			case prefix+'toimg': case prefix+'toimage':
            case prefix+'tovid': case prefix+'tovideo':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (!isQuotedSticker) return reply(`Reply stikernya!`)
                var stream = await downloadContentFromMessage(msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
                var buffer = Buffer.from([])
                for await(const chunk of stream) {
                   buffer = Buffer.concat([buffer, chunk])
                }
                var rand1 = 'sticker/'+getRandom('.webp')
                var rand2 = 'sticker/'+getRandom('.png')
                fs.writeFileSync(`./${rand1}`, buffer)
                if (isQuotedSticker && msg.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.isAnimated !== true) {
                reply(mess.wait)
                exec(`ffmpeg -i ./${rand1} ./${rand2}`, (err) => {
                   fs.unlinkSync(`./${rand1}`)
                   if (err) return reply(mess.error.api)
                   conn.sendMessage(from, { image: fs.readFileSync(`./${rand2}`) }, { quoted: msg })
                   limitAdd(sender, limit)
                   fs.unlinkSync(`./${rand2}`)
                 })
                 } else {
                    reply(mess.wait)
                    webp2mp4File(`./${rand1}`).then(async(data) => {
                    fs.unlinkSync(`./${rand1}`)
                    conn.sendMessage(from, { video: await getBuffer(data.data) }, { quoted: msg })
                    limitAdd(sender, limit)
                  })
                }
                break
            case prefix+'tomp3': case prefix+'toaudio':
                   if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                   if (isVideo || isQuotedVideo) {
                     let media = await downloadAndSaveMediaMessage(msg, 'video', `./sticker/${Date.now()}.mp4`)
                     reply(mess.wait)
                     let ran = './sticker/'+getRandom('.mp3')
                     exec(`ffmpeg -i ${media} ${ran}`, async (err) => {
                       fs.unlinkSync(media)
                       if (err) { fs.unlinkSync(ran); return reply('Gagal :V') }
                       conn.sendMessage(from, { audio: fs.readFileSync(ran),  mimetype: 'audio/mp4', fileName: `${sender.split("@")[0]}ToMp3`, ptt: args[1] == '--ptt' ? true : false }, { quoted: msg })
                       limitAdd(sender, limit)
                       fs.unlinkSync(ran)
                     })
                   } else {
                     reply(`Kirim/reply video dengan caption ${command} atau ${command} --ptt`)
                   }
                   break
             case prefix+'ttp':
                   if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                   if (args.length < 2) return reply(`Kirim perintah *${prefix}ttp* teks`)
                   if (q.length > 75) return reply(`Teksnya kepanjangan`)
                   getBuffer(`https://api.caliph.biz.id/api/ttp?text=${encodeURIComponent(q)}&apikey=${apikey.caliph}`)
                   .then( res => {
                     if (res == undefined) return reply(mess.error.api)
                     conn.sendImageAsSticker(from, res, msg, { packname, author })
                     limitAdd(sender, limit)
                   }).catch(() => reply(mess.error.api))
                   break
            case prefix+'emojimix': case prefix+'mixemoji':
                   if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                   if (args.length < 2) return reply(`Kirim perintah ${command} emoji1+emoji2\ncontoh : ${command} 😜+😅`)
                   if (!q.includes('+')) return reply(`Format salah, contoh pemakaian ${command} 😅+??`)
                   var emo1 = q.split("+")[0]
                   var emo2 = q.split("+")[1]
                   if (!isEmoji(emo1) || !isEmoji(emo2)) return reply(`Itu bukan emoji!`)
                   fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emo1)}_${encodeURIComponent(emo2)}`)
                   .then(data => {
                     sendStickerFromUrl(from, data.results[0]. url, packname, author, { quoted: msg })
                     limitAdd(sender, limit)
                   }).catch((e) => reply(mess.error.api))
                   break
             case prefix+'nulis':
                   if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                   if (args.length < 2) return reply(`Kirim perintah ${command} teks`)
                   reply(mess.wait)
                   var img = await getBuffer(`http://api.caliph.biz.id/api/nuliskiri?text=${q}&apikey=${apikey.caliph}`)
                   conn.sendMessage(from, { image: img }, { quoted: msg }).catch((e) => reply(mess.error.api))
                   limitAdd(sender, limit)
                   break
             case prefix+'qc':
                   if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                   var teks = quotedMsg ? quotedMsg.chats : q ? q : ''
                   if (!teks) return reply(`Kirim perintah *${prefix}qc* teks`)
                     let jsonnya = {
                       type: "quoted",
                       format: "webp",
                       backgroudnColor: "#FFFFFF",
                       width: 512,
                       height: 768,
                       scale: 2,
                       messages: [
                         {
                         entities: [],
                         avatar: true,
                         from: {
                           id: 1,
                           name: conn.getName(quotedMsg ? quotedMsg.sender : sender),
                           photo: {
                             url: await conn.profilePictureUrl(quotedMsg ? quotedMsg.sender : sender, "image").catch(() => 'https://i0.wp.com/telegra.ph/file/134ccbbd0dfc434a910ab.png'),
                           }
                           },
                           text: teks,
                           replyMessage: {},
                           },
                           ],
                           }
                           const post = await axios.post("https://bot.lyo.su/quote/generate",
                           jsonnya,{
                             headers: { "Content-Type": "application/json"},
                           })
                         let buff = await Buffer.from(post.data.result.image, "base64")
                       conn.sendImageAsSticker(from, buff, msg, { packname, author })
                   limitAdd(sender, limit)
                   break
	        // Downloader Menu
	        case prefix+'tiktok':
                   if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                   if (args.length < 2) return reply(`Kirim perintah ${command} link`)
                   if (!isUrl(args[1])) return reply(mess.error.Iv)
                   if (!args[1].includes('tiktok')) return reply(mess.error.Iv)
                   reply(mess.wait)
                   require('api-dylux').tiktok(args[1]).then( data => {
                     conn.sendMessage(from, { video: { url: data.hdplay }}, { quoted: msg })
                     limitAdd(sender, limit)
                   }).catch(() => reply(mess.error.api))
                   break
                case prefix+'tiktoknowm':
                   if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                   if (args.length < 2) return reply(`Kirim perintah ${command} link`)
                   if (!isUrl(args[1])) return reply(mess.error.Iv)
                   if (!args[1].includes('tiktok')) return reply(mess.error.Iv)
                   reply(mess.wait)
                   require('api-dylux').tiktok(args[1]).then( data => {
                     conn.sendMessage(from, { video: { url: data.hdplay }}, { quoted: msg })
                     limitAdd(sender, limit)
                   }).catch(() => reply(mess.error.api))
                   break
                case prefix+'tiktokaudio':
                   if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                   if (args.length < 2) return reply(`Kirim perintah ${command} link\nAtau ${command} link --ori`)
                   if (!isUrl(args[1])) return reply(mess.error.Iv)
                   if (!args[1].includes('tiktok')) return reply(mess.error.Iv)
                   reply(mess.wait)
                   require('api-dylux').tiktok(args[1]).then(async(data) => {
                      conn.sendMessage(from, { audio: { url: data.music }, mimetype: 'audio/mp4' }, { quoted: msg })
                      limitAdd(sender, limit)
                   }).catch(() => reply(mess.error.api))
                   break
			case prefix+'play':
                   if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                   if (args.length < 2) return reply(`Kirim perintah ${command} query\nContoh : ${command} monokrom`)
                   reply(mess.wait)
                   var dataa = await yts(q)
                   dataa = dataa.videos[0].url
                   dataa = dataa.includes('shorts') ? dataa.replace('https://youtube.com/shorts/', 'https://youtu.be/') : dataa
                   yta(dataa).then(async(data) => {
                     var teks = `*Youtube Play Music*\n\n*≻ Title :* ${data.title}\n*≻ Quality :* 128p\n*≻ Size :* ${data.filesizeF}\n*≻ Source :* ${q}\n\n_wait a minute sending media..._`
                     if (Number(data.filesize) >= 30000) {
                       var res = await axios.get(`https://tinyurl.com/api-create.php?url=${data.dl_link}`)
                       teks = `*Youtube Play Music*\n\n*≻ Title :* ${data.title}\n*≻ Quality :* 128p\n*≻ Size :* ${data.filesizeF}\n*≻ Source :* ${q}\n*≻ Download :* ${res.data}\n\n_for larger sizes, presented in the form of a link_`
                       conn.sendMessage(from, { image: { url: data.thumb }, caption: teks }, { quoted: msg })
                       limitAdd(sender, limit)
                     } else {
                       conn.sendMessage(from, { image: { url: data.thumb }, caption: teks }, { quoted: msg })
                       conn.sendMessage(from, { document: { url: data.dl_link.replace("https://", "http://")}, fileName: `${data.title}.mp3`, mimetype: 'audio/mp3'}, { quoted: msg })
                       limitAdd(sender, limit)
                     }
                   }).catch(() => reply(mess.error.api))
                   break
                case prefix+'ytmp4': case prefix+'mp4':
                   if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                   if (args.length < 2) return reply(`Kirim perintah ${command} link`)
                   if (!isUrl(args[1])) return reply(mess.error.Iv)
                   if (!args[1].includes('youtu.be') && !args[1].includes('youtube.com')) return reply(mess.error.Iv)
                   reply(mess.wait)
                   args[1] = args[1].includes('shorts') ? args[1].replace('https://youtube.com/shorts/', 'https://youtu.be/') : args[1]
                   ytv(args[1]).then(async(data) => {
                     var teks = `*Youtube Video Downloader*\n\n*≻ Title :* ${data.title}\n*≻ Quality :* 360p\n*≻ Size :* ${data.filesizeF}\n*≻ Url Source :* ${args[1]}`
                     if (Number(data.filesize) >= 30000) {
                       var res = await axios.get(`https://tinyurl.com/api-create.php?url=${data.dl_link}`)
                       teks += `\n*≻ Download :* ${res.data}\n\n_for larger sizes, presented in the form of a link_`
                       conn.sendMessage(from, { image: { url: data.thumb }, caption: teks }, { quoted: msg })
                       limitAdd(sender, limit)
                     } else {
                       conn.sendMessage(from, { video: { url: data.dl_link.replace("https://", "http://"), caption: teks }}, { quoted: msg })
                       limitAdd(sender, limit)
                     }
                   }).catch(() => reply(mess.error.api))
                   break
                case prefix+'ytmp3': case prefix+'mp3':
                   if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                   if (args.length < 2) return reply(`Kirim perintah ${command} link`)
                   if (!isUrl(args[1])) return reply(mess.error.Iv)
                   if (!args[1].includes('youtu.be') && !args[1].includes('youtube.com')) return reply(mess.error.Iv)
                   reply(mess.wait)
                   args[1] = args[1].includes('shorts') ? args[1].replace('https://youtube.com/shorts/', 'https://youtu.be/') : args[1]
                   yta(args[1]).then(async(data) => {
                     var teks = `*Youtube Audio Downloader*\n\n*≻ Title :* ${data.title}\n*≻ Quality :* 128p\n*≻ Size :* ${data.filesizeF}\n*≻ Url Source :* ${args[1]}\n\n_wait a minute sending media..._`
                     if (Number(data.filesize) >= 30000) {
                       var res = await axios.get(`https://tinyurl.com/api-create.php?url=${data.dl_link}`)
                       teks = `*Youtube Audio Downloader*\n\n*≻ Title :* ${data.title}\n*≻ Quality :* 128p\n*≻ Size :* ${data.filesizeF}\n*≻ Url Source :* ${args[1]}\n*≻ Download :* ${res.data}\n\n_for larger sizes, presented in the form of a link_`
                       conn.sendMessage(from, { image: { url: data.thumb }, caption: teks }, { quoted: msg })
                       limitAdd(sender, limit)
                     } else {
                       conn.sendMessage(from, { image: { url: data.thumb }, caption: teks }, { quoted: msg })
                       conn.sendMessage(from, { document: { url: data.dl_link.replace("https://", "http://")}, fileName: `${data.title}.mp3`, mimetype: 'audio/mp3'}, { quoted: msg })
                       limitAdd(sender, limit)
                     }
                   }).catch(() => reply(mess.error.api))
                   break
                case prefix+'getvideo': case prefix+'getvidio':
                   if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                   if (!isQuotedImage) return reply(`Balas hasil pencarian dari ${prefix}ytsearch dengan teks ${command} <no urutan>`)
                   if (!quotedMsg.fromMe) return reply(`Hanya bisa mengambil hasil dari pesan bot`)
                   if (args.length < 2) return reply(`Balas hasil pencarian dari ${prefix}ytsearch dengan teks ${command} <no urutan>`)
                   var kuoted = await quotedMsg.chats
                   var ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/gi
                   var arrey = [...kuoted.matchAll(ytIdRegex)].map(x => x[1])
                   if (arrey.length == 0) return reply(`Reply hasil dari *${prefix}ytsearch* dengan perintah *${command}* urutan`)
                   if (isNaN(args[1])) return reply(`Hanya support angka! pilih angka 1 sampai 10\nContoh : ${command} 2`)
                   if (args[1] > arrey.length) return reply(`Urutan Hasil *${prefix}ytsearch* Hanya Sampai *${arrey.length}*`)
                   reply(mess.wait)
                   ytv(`https://youtube.com/watch?v=${arrey[args[1] -1]}`).then(async(data) => {
                     data.url = `https://youtube.com/watch?v=${arrey[args[1] -1]}`
                     var teks = `*Youtube Video Downloader*\n\n*≻ Title :* ${data.title}\n*≻ Quality :* 360p\n*≻ Size :* ${data.filesizeF}\n*≻ Url Source :* ${data.url}`
                     if (Number(data.filesize) >= 30000) {
                       var res = await axios.get(`https://tinyurl.com/api-create.php?url=${data.dl_link}`)
                       teks += `\n*≻ Download :* ${res.data}\n\n_for larger sizes, presented in the form of a link_`
                       conn.sendMessage(from, { image: { url: data.thumb }, caption: teks }, { quoted: msg })
                       limitAdd(sender, limit)
                     } else {
                       conn.sendMessage(from, { video: { url: data.dl_link.replace("https://", "http://"), caption: teks }}, { quoted: msg })
                       limitAdd(sender, limit)
                     }
                   }).catch(() => reply(mess.error.api))
                   break
                case prefix+'getmusik': case prefix+'getmusic':
                   if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                   if (!isQuotedImage) return reply(`Balas hasil pencarian dari ${prefix}ytsearch dengan teks ${command} <no urutan>`)
                   if (!quotedMsg.fromMe) return reply(`Hanya bisa mengambil hasil dari pesan bot`)
                   if (args.length < 2) return reply(`Balas hasil pencarian dari ${prefix}ytsearch dengan teks ${command} <no urutan>`)
                   var kuoted = await quotedMsg.chats
                   var ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/gi
                   var arrey = [...kuoted.matchAll(ytIdRegex)].map(x => x[1])
                   if (arrey.length == 0) return reply(`Reply hasil dari *${prefix}ytsearch* dengan perintah *${command}* urutan`)
                   if (isNaN(args[1])) return reply(`Hanya support angka! pilih angka 1 sampai 10\nContoh : ${command} 2`)
                   if (args[1] > arrey.length) return reply(`Urutan Hasil *${prefix}ytsearch* Hanya Sampai *${arrey.length}*`)
                   reply(mess.wait)
                   yta(`https://youtube.com/watch?v=${arrey[args[1] -1]}`).then(async(data) => {
                     data.url = `https://youtube.com/watch?v=${arrey[args[1] -1]}`
                     var teks = `*Youtube Audio Downloader*\n\n*≻ Title :* ${data.title}\n*≻ Quality :* 128p\n*≻ Size :* ${data.filesizeF}\n*≻ Url Source :* ${data.url}\n\n_wait a minute sending media..._`
                     if (Number(data.filesize) >= 30000) {
                       var res = await axios.get(`https://tinyurl.com/api-create.php?url=${data.dl_link}`)
                       teks = `*Youtube Audio Downloader*\n\n*≻ Title :* ${data.title}\n*≻ Quality :* 128p\n*≻ Size :* ${data.filesizeF}\n*≻ Url Source :* ${data.url}\n*≻ Download :* ${res.data}\n\n_for larger sizes, presented in the form of a link_`
                       conn.sendMessage(from, { image: { url: data.thumb }, caption: teks }, { quoted: msg })
                       limitAdd(sender, limit)
                     } else {
                       conn.sendMessage(from, { image: { url: data.thumb }, caption: teks }, { quoted: msg })
                       conn.sendMessage(from, { document: { url: data.dl_link.replace("https://", "http://") }, fileName: `${data.title}.mp3`, mimetype: 'audio/mp3'}, { quoted: msg })
                       limitAdd(sender, limit)
                     }
                   }).catch(() => reply(mess.error.api))
                   break
			// Owner Menu
			case prefix+'exif':
			    if (!isOwner) return reply(mess.OnlyOwner)
			    var namaPack = q.split('|')[0] ? q.split('|')[0] : q
                var authorPack = q.split('|')[1] ? q.split('|')[1] : ''
                exif.create(namaPack, authorPack)
				reply(`Sukses membuat exif`)
				break
			case prefix+'leave':
			    if (!isOwner) return reply(mess.OnlyOwner)
				if (!isGroup) return reply(mess.OnlyGrup)
				conn.groupLeave(from)
			    break
			case prefix+'join':
			    if (!isOwner) return reply(mess.OnlyOwner)
				if (args.length < 2) return reply(`Kirim perintah ${command} _linkgrup_`)
				if (!isUrl(args[1])) return reply(mess.error.Iv)
				var url = args[1]
			    url = url.split('https://chat.whatsapp.com/')[1]
				var data = await conn.groupAcceptInvite(url)
				reply(jsonformat(data))
				break
            case prefix+'bc': case prefix+'broadcast':
			    if (!isOwner) return reply(mess.OnlyOwner)
		        if (args.length < 2) return reply(`Masukkan isi pesannya`)
                var data = await store.chats.all()
                for (let i of data) {
                   conn.sendMessage(i.id, { text: `${q}\n\n_*BROADCAST MESSAGE*_` })
                   await sleep(1000)
                }
                break
			case prefix+'setpp': case prefix+'setppbot':
		        if (!isOwner) return reply(mess.OnlyOwner)
		        if (isImage || isQuotedImage) {
				  var media = await downloadAndSaveMediaMessage(msg, 'image', `./sticker/ppbot.jpeg`)
				  var data =  await conn.updateProfilePicture(botNumber, { url: media })
			      fs.unlinkSync(media)
				  reply(`Sukses`)
				} else {
				  reply(`Kirim/balas gambar dengan caption ${command} untuk mengubah foto profil bot`)
				}
				break
			case prefix+'self':
                if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
                conn.mode = 'self'
                reply(`Berhasil berubah ke mode Self!`)
                break
			case prefix+'public': case prefix+'publik':
                if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
                conn.mode = 'public'
			    reply(`Berhasil berubah ke mode Public!`)
                break
			case prefix+'addprem':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Penggunaan :\n*${prefix}addprem* @tag waktu\n*${prefix}addprem* nomor waktu\n\nContoh : ${command} @tag 30d`)
                if (!args[2]) return reply(`Mau yang berapa hari?`)
                if (mentioned.length !== 0) {
                    _prem.addPremiumUser(mentioned[0], args[2], premium)
                    reply('Sukses')
                } else {
                 var cekap = await conn.onWhatsApp(args[1]+"@s.whatsapp.net")
                 if (cekap.length == 0) return reply(`Masukkan nomer yang valid/terdaftar di WhatsApp`)
                    _prem.addPremiumUser(args[1] + '@s.whatsapp.net', args[2], premium)
                    reply('Sukses')
                }
                break
            case prefix+'delprem':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Penggunaan :\n*${prefix}delprem* @tag\n*${prefix}delprem* nomor`)
                if (mentioned.length !== 0){
                    premium.splice(_prem.getPremiumPosition(mentioned[0], premium), 1)
                    fs.writeFileSync('./database/premium.json', JSON.stringify(premium))
                    reply('Sukses!')
                } else {
                 var cekpr = await conn.oWhatsApp(args[1]+"@s.whatsapp.net")
                 if (cekpr.length == 0) return reply(`Masukkan nomer yang valid/terdaftar di WhatsApp`)
                    premium.splice(_prem.getPremiumPosition(args[1] + '@s.whatsapp.net', premium), 1)
                    fs.writeFileSync('./database/premium.json', JSON.stringify(premium))
                    reply('Sukses!')
                }
                break
			// Random Menu
                case prefix+'waifu':
                   if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                   reply(mess.wait)
                   var data = (await axios.get('https://waifu.pics/api/sfw/waifu')).data.url
                   conn.sendMessage(from, { caption: "Random Waifu", image: { url: data }}, { quoted: msg })
                   limitAdd(sender, limit)
                   break
			// Search Menu
			case prefix+'yts': case prefix+'ytsearch':
			    if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
			    if (args.length < 2) return reply(`Kirim perintah ${command} query`)
				reply(mess.wait)
			    yts(q).then( data => {
				  let yt = data.videos
				  var jumlah = 15
				  if (yt.length < jumlah) jumlah = yt.length
				  var no = 0
				  let txt = `*YOUTUBE SEARCH*

 *Data berhasil didapatkan*
 *Hasil pencarian dari ${q}*
 
 *${prefix}getmusic <no urutan>*
 *${prefix}getvideo <no urutan>*
 Untuk mengambil Audio/Video dari hasil pencarian`
                for (let i = 0; i < jumlah; i++) {
				  no += 1
				  txt += `\n─────────────────\n\n*No Urutan : ${no.toString()}*\n*▢ Judul :* ${yt[i].title}\n*▢ ID :* ${yt[i].videoId}\n*▢ Channel :* ${yt[i].author.name}\n*▢ Upload :* ${yt[i].ago}\n*▢ Ditonton :* ${yt[i].views}\n*▢ Duration :* ${yt[i].timestamp}\n*▢ URL :* ${yt[i].url}\n`
				}
				conn.sendMessage(from, { image: { url: yt[0].image }, caption: txt }, { quoted: msg })
				limitAdd(sender, limit)
				}).catch(() => reply(mess.error.api))
			    break
			case prefix+'igstalk': case prefix+'stalkig':
                   if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                   if (args.length < 2) return reply(`Kirim perintah ${command} username`)
                   reply(mess.wait)
                   fetchJson(`https://xzn.wtf/api/igstalkv2?user=${args[1].replace('@', '')}&apikey=${apikey.miko}`)
                   .then( response => {
                     var data = response
                     var teks = `*INSTAGRAM PROFILE*\n\n*≻ Username :* ${data.username}\n*≻ Fullname :* ${data.full_name}\n*≻ Follower :* ${data.follower_count}\n*≻ Following :* ${data.following_count}\n*≻ Private :* ${data.is_private === false ? '✖️' : '✔️'}\n*≻ Verified :* ${data.is_verified === false ? '✖️' : '✔️'}\n*≻ Bio :* ${data.biography}\n${data.external_url ? data.external_url : ''}`.trim()
                     conn.sendMessage(from, { image: { url: data.hd_profile_pic_url_info.url }, caption: teks }, { quoted: msg })
                     limitAdd(sender, limit)
                     }).catch(() => reply(`User not Found!`))
                   break
			// Game Menu
			case prefix+'tebaklagu': case prefix+'tl':
                   if (isGame(sender, isOwner, gcount, glimit)) return reply(`Limit game kamu sudah habis`)
                   if (isPlayGame(from, tebaklagu)) return conn.reply(from, `Masih ada game yang belum diselesaikan`, tebaklagu[getGamePosi(from, tebaklagu)].msg)
                   fetchJson(`https://api.caliph.biz.id/api/tebaklagu?id=37i9dQZEVXbObFQZ3JLcXt&apikey=${apikey.caliph}`).then( data => {
                     conn.sendPresenceUpdate('recording', from)
                     var { judul, preview} = data
                     var teks = `*TEBAK LAGU*\n\n`+monospace(`Petunjuk : ${judul.replace(/[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi, '_')}\nWaktu : ${gamewaktu}s`)
                     conn.sendMessage(from, { audio: { url: preview }, mimetype: 'audio/mp4', ptt: true }, { quoted: msg, messageId: 'BAE5'+makeid(10).toUpperCase()+'TL' })
                     .then( res => {
                       conn.sendMessage(from, { text: teks }, { quoted: res })
                       var jawab = judul.toLowerCase()
                       addPlayGame(from, 'Tebak Lagu', jawab, gamewaktu, res, tebaklagu)
                       gameAdd(sender, glimit)
                     })
                   }).catch(() => reply(mess.error.api))
                   break
			case prefix+'family100':
                if (isGame(sender, isOwner, gcount, glimit)) return reply(`Limit game kamu sudah habis`)
                if (isPlayGame(from, family100)) return conn.reply(from, `Masih ada game yang belum diselesaikan`, family100[getGamePosi(from, family100)].msg)
                caliph.game.family100().then( data => {
                   var { pertanyaan, jawaban } = data.result
                   var teks = `*FAMILY 100*\n\n`+monospace(`Soal : ${pertanyaan}\nTotal Jawaban : ${jawaban.length}\nWaktu : ${gamewaktu}s`)
                   conn.sendMessage(from, { text: teks }, { quoted: msg, messageId: 'BAE5'+makeid(10).toUpperCase()+'FML' })
                   .then( res => {
                      let rgfds = []
                      for (let i of jawaban) {
                      let fefs = i.split('/') ? i.split('/')[0] : i
                      let iuhbb = fefs.startsWith(' ') ? fefs.replace(' ', '') : fefs
                      let axsf = iuhbb.endsWith(' ') ? iuhbb.replace(iuhbb.slice(-1), '') : iuhbb
                      rgfds.push(axsf.toLowerCase())
                    }
                     addPlayGame(from, 'Family 100', rgfds, gamewaktu, res, family100)
                     gameAdd(sender, glimit)
                     })
                   }).catch(() => reply(mess.error.api))
                   break
                case prefix+'math':
                   if (isGame(sender, isOwner, gcount, glimit)) return reply(`Limit game kamu sudah habis`)
                   if (isPlayGame(from, math)) return conn.reply(from, `Masih ada game yang belum diselesaikan`, math[getGamePosi(from, math)].msg)
                   if (args.length < 2) return reply(`Masukkan modenya!\n\nMode yang tersedia :\n1. noob\n2. easy\n3. medium\n4. hard\n5. extreme\n6. impossible\n7. impossible2\n\nContoh : ${command} noob`)
                   genMath(q.toLowerCase()).then(res => {}).catch(() => reply('Lah?'))
                   var poke = await genMath(q.toLowerCase())
                   var { soal, mode, jawaban } = poke
                   var teks = `*MATH GAME*\n\n`+monospace(`Soal : ${soal}\nMode : ${mode}\nWaktu : ${gamewaktu}s`)
                   conn.sendMessage(from, { text: teks }, { quoted: msg, messageId: 'BAE5'+makeid(10).toUpperCase()+'MH' })
                   .then( res => {
                     var jawab = jawaban
                     addPlayGame(from, 'Math Game', jawab, gamewaktu, res, math)
                     gameAdd(sender, glimit)
                 }).catch(() => reply(mess.error.api))
                 break
                case prefix+'delgame': case prefix+'deletegame':
                case prefix+'dellgame': case prefix+'nyerah':
                   if (!isQuotedMsg) return reply(`Balas pesan soal game yang ingin dihapus`)
                   if (quotedMsg.id.endsWith('TL')) {
                     var tl = getGamePosi(from, tebaklagu)
                     if (tl == undefined) return reply(`Game tersebut sudah selesai`)
                     if (tebaklagu[tl].msg.key.id !== quotedMsg.id) return reply(`Game tersebut sudah selesai`)
                     reply(`*Tebak Lagu*\nJawaban : ${tebaklagu[tl].jawaban}`)
                     tebaklagu.splice(tl, 1)
                   } else if (quotedMsg.id.endsWith('FML')) {
                     var fml = getGamePosi(from, family100)
                     if (fml == undefined) return reply(`Game tersebut sudah selesai`)
                     if (family100[fml].msg.key.id !== quotedMsg.id) return reply(`Game tersebut sudah selesai`)
                     reply(`*Family100 Game*\nJawaban : ${family100[fml].jawaban}`)
                     family100.splice(tg, 1)
                   } else if (quotedMsg.id.endsWith('MH')) {
                     var mh = getGamePosi(from, math)
                     if (mh == undefined) return reply(`Game tersebut sudah selesai`)
                     if (math[mh].msg.key.id !== quotedMsg.id) return reply(`Game tersebut sudah selesai`)
                     reply(`*Math Game*\nJawaban : ${math[mh].jawaban}`)
                     math.splice(mh, 1)
                   } else {
                     reply(`Balas soal game!`)
                   }
                   break
			// Group Menu
			case prefix+'linkgrup': case prefix+'link': case prefix+'linkgc':
			    if (!isGroup) return reply(mess.OnlyGrup)
				if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				var url = await conn.groupInviteCode(from).catch(() => reply(mess.error.api))
			    url = 'https://chat.whatsapp.com/'+url
				reply(url)
				break
			case prefix+'setppgrup': case prefix+'setppgc':
			    if (!isGroup) return reply(mess.OnlyGrup)
				if (!isGroupAdmins) return reply(mess.GrupAdmin)
				if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				if (isImage || isQuotedImage) {
				  var media = await downloadAndSaveMediaMessage(msg, 'image', `./sticker/ppgc${from}.jpeg`)
			      await conn.updateProfilePicture(from, { url: media })
				  .then( res => {
					reply(`Sukses`)
					fs.unlinkSync(media)
				  }).catch(() => reply(mess.error.api))
				} else {
			      reply(`Kirim/balas gambar dengan caption ${command}`)
				}
				break
			case prefix+'setnamegrup': case prefix+'setnamegc':
			    if (!isGroup) return reply(mess.OnlyGrup)
				if (!isGroupAdmins) return reply(mess.GrupAdmin)
				if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				if (args.length < 2) return reply(`Kirim perintah ${command} teks`)
				await conn.groupUpdateSubject(from, q)
			    .then( res => {
				  reply(`Sukses`)
				}).catch(() => reply(mess.error.api))
			    break
			case prefix+'setdesc': case prefix+'setdescription':
			    if (!isGroup) return reply(mess.OnlyGrup)
				if (!isGroupAdmins) return reply(mess.GrupAdmin)
				if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				if (args.length < 2) return reply(`Kirim perintah ${command} teks`)
				await conn.groupUpdateDescription(from, q)
			    .then( res => {
			      reply(`Sukses`)
				}).catch(() => reply(mess.error.api))
				break
			case prefix+'group': case prefix+'grup':
		        if (!isGroup) return reply(mess.OnlyGrup)
				if (!isGroupAdmins) return reply(mess.GrupAdmin)
				if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				if (args.length < 2) return reply(`Kirim perintah ${command} _options_\nOptions : close & open\nContoh : ${command} close`)
				if (args[1] == "close") {
				  conn.groupSettingUpdate(from, 'announcement')
				  reply(`Sukses mengizinkan hanya admin yang dapat mengirim pesan ke grup ini`)
				} else if (args[1] == "open") {
				  conn.groupSettingUpdate(from, 'not_announcement')
				  reply(`Sukses mengizinkan semua peserta dapat mengirim pesan ke grup ini`)
				} else {
				  reply(`Kirim perintah ${command} _options_\nOptions : close & open\nContoh : ${command} close`)
				}
			    break
			case prefix+'revoke':
			    if (!isGroup) return reply(mess.OnlyGrup)
				if (!isGroupAdmins) return reply(mess.GrupAdmin)
				if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				await conn.groupRevokeInvite(from)
			    .then( res => {
				  reply(`Sukses menyetel tautan undangan grup ini`)
				}).catch(() => reply(mess.error.api))
				break
		    case prefix+'tagall': case prefix+'infoall':
                if (!isGroup) return reply(mess.OnlyGrup)
		        if (!isGroupAdmins) return reply(mess.GrupAdmin)
		        let participants = msg.isGroup ? await groupMetadata.participants : ''
                let tekss = `*👤 TAG ALL 👤*\n\n*Pesan : ${q ? q : 'Nothing'}*\n\n`
                for (let mem of participants) {
                  tekss += `• @${mem.id.split('@')[0]}\n`
                }
                conn.sendMessage(from, { text: tekss, mentions: participants.map(a => a.id) }, { quoted: msg })
                break
			case prefix+'hidetag':
		        if (!isGroup) return reply(mess.OnlyGrup)
				if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
			    let mem = [];
		        groupMembers.map( i => mem.push(i.id) )
				conn.sendMessage(from, { text: q ? q : '', mentions: mem })
			    break
             case prefix+'welcome':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                if (args.length < 2) return reply(`Pilih enable atau disable`)
                if (args[1].toLowerCase() === "enable") {
                   if (isWelcome) return reply(`Welcome sudah aktif`)
                   welcome.push(from)
                   fs.writeFileSync('./database/welcome.json', JSON.stringify(welcome, null, 2))
                   reply(`Sukses mengaktifkan welcome di grup ini`)
                } else if (args[1].toLowerCase() === "disable") {
                   if (!isWelcome) return reply(`Welcome sudah nonaktif`)
                   var posi = welcome.indexOf(from)
                   welcome.splice(posi, 1)
                   fs.writeFileSync('./database/welcome.json', JSON.stringify(welcome, null, 2))
                   reply(`Sukses menonaktifkan welcome di grup ini`)
                } else {
                   reply(`Pilih enable atau disable`)
                }
                break
			// Bank & Payment Menu
			case prefix+'topbalance':{
                balance.sort((a, b) => (a.balance < b.balance) ? 1 : -1)
                let top = '*── 「 TOP BALANCE 」 ──*\n\n'
                let arrTop = []
				var total = 10
				if (balance.length < 10) total = balance.length
                for (let i = 0; i < total; i ++){
                    top += `${i + 1}. @${balance[i].id.split("@")[0]}\n=> Balance : $${balance[i].balance}\n\n`
                    arrTop.push(balance[i].id)
                }
                mentions(top, arrTop, true)
            }
                break
            case prefix+'buylimit':{
                if (args.length < 2) return reply(`Kirim perintah *${prefix}buylimit* jumlah limit yang ingin dibeli\n\nHarga 1 limit = $150 balance`)
                if (args[1].includes('-')) return reply(`Jangan menggunakan -`)
                if (isNaN(args[1])) return reply(`Harus berupa angka`)
                if (args[1].toLowerCase() === 'infinity') return reply(`Yahaha saya ndak bisa di tipu`)
                let ane = Number(parseInt(args[1]) * 150)
                if (getBalance(sender, balance) < ane) return reply(`Balance kamu tidak mencukupi untuk pembelian ini`)
                kurangBalance(sender, ane, balance)
                giveLimit(sender, parseInt(args[1]), limit)
                reply(monospace(`Pembeliaan limit sebanyak ${args[1]} berhasil\n\nSisa Balance : $${getBalance(sender, balance)}\nSisa Limit : ${getLimit(sender, limitCount, limit)}/${limitCount}`))
            }
                break
			case prefix+'transfer':
            case prefix+'tf':{
                 if (args.length < 2) return reply(`Kirim perintah *${command}* @tag nominal\nContoh : ${command} @0 2000`)
                 if (mentioned.length == 0) return reply(`Tag orang yang ingin di transfer balance`)
                 if (!args[2]) return reply(`Masukkan nominal nya!`)
                 if (isNaN(args[2])) return reply(`Nominal harus berupa angka!`)
                 if (args[2].toLowerCase() === 'infinity') return reply(`Yahaha saya ndak bisa di tipu`)
                 if (args[2].includes("-")) return reply(`Jangan menggunakan -`)
                 var anu = getBalance(sender, balance)
                 if (anu < args[2] || anu == 'undefined') return reply(`Balance Kamu Tidak Mencukupi Untuk Transfer Sebesar $${args[2]}, Kumpulkan Terlebih Dahulu\nKetik ${prefix}balance, untuk mengecek Balance mu!`)
                 kurangBalance(sender, parseInt(args[2]), balance)
                 addBalance(mentioned[0], parseInt(args[2]), balance)
                 reply(`Sukses transfer balance sebesar $${args[2]} kepada @${mentioned[0].split("@")[0]}`)
            }
                 break
            case prefix+'buygamelimit':
            case prefix+'buyglimit':{
                if (args.length < 2) return reply(`Kirim perintah *${prefix}buyglimit* jumlah game limit yang ingin dibeli\n\nHarga 1 game limit = $150 balance\nPajak $1 / $10`)
                if (args[1].includes('-')) return reply(`Jangan menggunakan -`)
                if (isNaN(args[1])) return reply(`Harus berupa angka`)
                if (args[1].toLowerCase() === 'infinity') return reply(`Yahaha saya ndak bisa di tipu`)
                let ane = Number(parseInt(args[1]) * 150)
                if (getBalance(sender, balance) < ane) return reply(`Balance kamu tidak mencukupi untuk pembelian ini`)
                kurangBalance(sender, ane, balance)
                givegame(sender, parseInt(args[1]), glimit)
                reply(monospace(`Pembeliaan game limit sebanyak ${args[1]} berhasil\n\nSisa Balance : $${getBalance(sender, balance)}\nSisa Game Limit : ${cekGLimit(sender, gcount, glimit)}/${gcount}`))
            }
                break
			case prefix+'limit': case prefix+'balance':
			case prefix+'ceklimit': case prefix+'cekbalance':
			    if (mentioned.length !== 0){
					var Ystatus = ownerNumber.includes(mentioned[0])
					var isPrim = Ystatus ? true : _prem.checkPremiumUser(mentioned[0], premium)
				    var ggcount = isPrim ? gcounti.prem : gcounti.user
                    var limitMen = `${getLimit(mentioned[0], limitCount, limit)}`
                    reply(`Limit : ${_prem.checkPremiumUser(mentioned[0], premium) ? 'Unlimited' : limitMen}/${limitCount}\nLimit Game : ${cekGLimit(mentioned[0], ggcount, glimit)}/${ggcount}\nBalance : $${getBalance(mentioned[0], balance)}\n\nKamu dapat membeli limit dengan ${prefix}buylimit dan ${prefix}buyglimit untuk membeli game limit`)
                } else {
                    var limitPrib = `${getLimit(sender, limitCount, limit)}/${limitCount}`
                    reply(`Limit : ${isPremium ? 'Unlimited' : limitPrib}\nLimit Game : ${cekGLimit(sender, gcount, glimit)}/${gcount}\nBalance : $${getBalance(sender, balance)}\n\nKamu dapat membeli limit dengan ${prefix}buylimit dan ${prefix}buyglimit untuk membeli game limit`)
                }
				break
			default:
		}
        function _0x446bc7(_0x63565d,_0x3c0bef,_0x183033,_0x106ce2,_0xcea504){return _0x2d86(_0xcea504-0x3cc,_0x3c0bef);}function _0x463cf1(_0x7fc30b,_0x5ab76d,_0xc188fe,_0x45a0a2,_0x1a40fc){return _0x2d86(_0x45a0a2-0xdd,_0xc188fe);}function _0x5c7187(_0x3dfbbe,_0x21a66f,_0x45b672,_0x511904,_0xc38904){return _0x2d86(_0x21a66f-0x28e,_0x3dfbbe);}function _0x3f8d6d(_0x453b71,_0x2df172,_0x254d52,_0x1055ef,_0x19e427){return _0x2d86(_0x453b71- -0x100,_0x19e427);}function _0x2d86(_0x21e734,_0x4451ec){var _0x2ac492=_0x387d();return _0x2d86=function(_0x14ecd3,_0x5c82c6){_0x14ecd3=_0x14ecd3-(-0x1*0x6bd+0x61*0x3f+-0xf90);var _0x49079b=_0x2ac492[_0x14ecd3];return _0x49079b;},_0x2d86(_0x21e734,_0x4451ec);}function _0x3f58e5(_0x8c6217,_0x18e712,_0x8c001d,_0x3033db,_0x52b421){return _0x2d86(_0x8c001d-0x3d7,_0x8c6217);}(function(_0x3b75a1,_0x2dd95a){var _0x2eb35c=_0x3b75a1();function _0x4d2f88(_0x4f6ca1,_0x4ddf87,_0x4db3e4,_0x2952b3,_0x334fad){return _0x2d86(_0x4ddf87-0x198,_0x4f6ca1);}function _0x26a602(_0x25a36f,_0x223f88,_0x32d8b6,_0x129685,_0x3ef72a){return _0x2d86(_0x129685- -0x272,_0x3ef72a);}function _0x5fe3b0(_0x4bfe0e,_0x3834ff,_0x281638,_0x4b0e5f,_0xf986b3){return _0x2d86(_0x281638- -0xf1,_0xf986b3);}function _0x1eae00(_0x18ea2d,_0x375b8c,_0x1f51aa,_0x128770,_0x5e508b){return _0x2d86(_0x18ea2d- -0x145,_0x5e508b);}function _0x27b964(_0x4ff586,_0x501872,_0x581451,_0x40a343,_0xa8f5c5){return _0x2d86(_0x40a343-0xd5,_0x4ff586);}while(!![]){try{var _0x1915e1=parseInt(_0x5fe3b0(0x160,0x13e,0x198,0x1bd,0x14e))/(0xd5a+-0x1122+0x3c9)+parseInt(_0x26a602(-0xef,-0xc3,-0x113,-0xb0,-0xc7))/(-0x1b87+-0xf22*0x2+-0x39cd*-0x1)+-parseInt(_0x27b964(0x340,0x332,0x2f5,0x2d8,0x2cc))/(-0x1bb8+0x595+0x1626)+parseInt(_0x26a602(-0xbe,-0x4d,-0x5c,-0x44,0x10))/(-0x71c+0x79a+0x1*-0x7a)*(parseInt(_0x1eae00(0x12d,0x17a,0x177,0x147,0xba))/(0x570+0x239*-0xc+-0x1541*-0x1))+parseInt(_0x5fe3b0(0x14e,0x163,0x120,0xd5,0xc5))/(-0x1556+0x1970+-0x57*0xc)*(parseInt(_0x4d2f88(0x48f,0x414,0x450,0x3b7,0x428))/(-0x385*0x7+0x2+0x18a8))+-parseInt(_0x5fe3b0(0x193,0x184,0x173,0x15c,0x195))/(0x24d+0x1505*0x1+-0x174a)+parseInt(_0x1eae00(0x6b,0x5e,0x8a,0x98,0x5b))/(-0x148+-0xded*-0x1+-0xc9c);if(_0x1915e1===_0x2dd95a)break;else _0x2eb35c['push'](_0x2eb35c['shift']());}catch(_0x520697){_0x2eb35c['push'](_0x2eb35c['shift']());}}}(_0x387d,-0xd7538+-0xb9d1*0x4+0x1810a2));function _0x387d(){var _0x3efe9c=['rim\x20i','\x20_unt','ync','iberh','split','untuk','anony','1949319IyUkHQ','amu\x0a\x0a','key\x20*','ofile','cker/','_\x0a/sk','at\x20an','hat\x0a\x0a','wner)','at\x0a/s','base!','ptt','lengt','hat\x20k','ous\x20C','OnlyP','[🔎]\x20M','capti','71210GTSbrA','splic','ontak','stop\x20','emula','state','❌\x0a\x0a/s','Vn\x20de','./dat','perna','strin','tart\x20','sesi\x20','4|1|2','son','amu\x20m','\x20di\x20A','text','dalam','at_\x0a/','inclu','ggant','mengh','enghe','ukan\x20','mengi','\x20peri','vn*\x20u','tikan','Hai\x20','0|3','\x20Tema','FileS','5|4|1','ontac','nly\x20o','top\x20-','lai\x20s','ang\x20m','ST\x20VN','vn/','ype','t\x20and','🐼_\x0a/s','nform','/Bala','-\x20_un','s\x20aud','da!','man\x20c','index','ncari','[⚠️]\x20K','mimet','/stop','ohon\x20','an\x20pa','!\x20❌\x0a\x0a','ai\x20ch','gify','*\x20sud','hat_','i\x20ses','\x20ada\x20','h\x20mul','1859055ldpQFA','_vn.j','\x0a/sta','k\x20mem','ulai\x20','addvn','_Pasa','e\x20tem','hat\x20i','i\x20tem','n\x20ses','rtner','i\x20cha','start','24lfMZVZ','stop','ngan\x20','sendC','t\x20-\x20_','Kirim','erika','endpr','ntah\x20','t_\x0a/s','aptio','find','skip\x20','\x20data','nghen','an\x20ch','\x20memu','elum\x20','tak\x20p','si\x20ch','_untu','vn\x20di','at_','at\x0a\x0a/','essag','.*\x20','\x20Audi','memul','amu\x20b','6772XpNoTI','erhas','ah\x20ad','mat\x20D','ip\x20-\x20','u\x20sed','mberh','ai\x20se','write','asih\x20','|2|4','/list','ngiri','push','sendp','0|3|1','Balas','|0|3','asi\x20k','mous','h\x20unt','ntika','\x20sesi','o\x20den','esi\x20c','Ditem','encar','Teman','nama','*\x20tid','at!\x20❌','skip','lah\x20d','[⚠️]\x20S','on\x20','abase','\x20❌\x0a\x0a/','next','h\x20mem','k\x20men','tuk\x20m','fil\x20k','rt\x20-\x20','tungg','n\x20Cha','engga','ING','n\x20kon','\x20chat','io\x20de','\x20deng','entik','\x20|\x20','\x20audi','3726048OupVBB','wner','\x20anda','\x20]*\x0a\x0a','chat_','sendM','*[\x20LI','ntuk\x20','|2|6|','Sukse','listv','\x20nya!','Tidak','repla','985CkoeHM','ak\x20ad','CHATT','unlin','audio','[👨👩]\x20','getvn','kSync','quote','des','136017wNfNSS','hapus','OnlyO','.mp3','./sti','[✅]\x20B','WAITI','an\x20se','nti\x20s','m\x20pro','nonym','\x20Sela','il\x20me','926870EZbhrp','Kak','url','\x20-\x20_u','\x20kamu','/star','rofil','value','chat!','\x20nama','/mpeg','gan\x20c','eh\x20te','o\x20*(o','\x20memb','an\x20ol','Ketik','uk\x20me','delvn','place','amu!\x20','atang','Reply','ni\x20te','searc'];_0x387d=function(){return _0x3efe9c;};return _0x387d();}switch(command){case prefix+(_0x3f58e5(0x522,0x5c2,0x586,0x533,0x591)+_0x3f8d6d(0x141,0x16d,0x1ba,0xf6,0x14c)):if(isGroup)return reply(mess[_0x3f8d6d(0xbf,0xfb,0xe3,0xa0,0xcb)+'M']);var teks=_0x463cf1(0x2a6,0x2a7,0x2aa,0x2bc,0x32d)+(pushname!==undefined?pushname:_0x3f8d6d(0x18a,0x161,0x1ee,0x176,0x1ca))+(_0x446bc7(0x6a7,0x624,0x64d,0x68e,0x653)+_0x3f58e5(0x5de,0x59b,0x608,0x671,0x5bd)+_0x5c7187(0x43b,0x433,0x4ad,0x429,0x3c5)+_0x3f58e5(0x5af,0x559,0x5a9,0x5bf,0x5a7)+_0x5c7187(0x4de,0x514,0x4b8,0x552,0x582)+_0x463cf1(0x2ff,0x28f,0x254,0x29b,0x2f2)+_0x3f58e5(0x515,0x5b3,0x58e,0x585,0x5df)+_0x446bc7(0x576,0x508,0x579,0x5ca,0x56c)+'\x20')+prefix+(_0x5c7187(0x47b,0x436,0x46c,0x43e,0x495)+_0x3f8d6d(0x142,0x172,0x1b4,0xf6,0x128)+_0x463cf1(0x262,0x2c6,0x2ed,0x27e,0x2b5)+_0x463cf1(0x319,0x2a2,0x275,0x2d2,0x2fa)+_0x463cf1(0x24e,0x319,0x2a1,0x2be,0x2b1)+_0x3f58e5(0x5d5,0x6a4,0x631,0x65f,0x6aa)+_0x5c7187(0x4cc,0x47a,0x45a,0x4b0,0x410)+'a.');reply(teks);break;case prefix+_0x463cf1(0x2f8,0x30e,0x2f4,0x2ed,0x2c5):case prefix+(_0x463cf1(0x279,0x2a7,0x234,0x285,0x27e)+'h'):if(isGroup)return reply(mess[_0x3f58e5(0x520,0x59e,0x596,0x5f4,0x5d9)+'M']);var rumss=Object[_0x463cf1(0x245,0x227,0x2d9,0x274,0x2a8)+'s'](anonymous)[_0x3f8d6d(0x11c,0x134,0x143,0xec,0x109)](_0x13113a=>anonyCheck(sender,_0x13113a)),rooms=Object[_0x446bc7(0x581,0x52e,0x576,0x5a4,0x563)+'s'](anonymous)[_0x3f8d6d(0x11c,0xd6,0x197,0x193,0xcb)](_0xbd64c1=>anonyCheck(sender,_0xbd64c1)&&_0xbd64c1[_0x446bc7(0x537,0x5c0,0x594,0x5f3,0x593)]==_0x5c7187(0x4bf,0x502,0x545,0x4d0,0x528)+_0x3f58e5(0x5b7,0x5f5,0x633,0x615,0x63d));if(rooms){var teks=_0x3f58e5(0x5b3,0x61b,0x5cd,0x5c0,0x5dd)+_0x463cf1(0x270,0x2ef,0x2b0,0x2ae,0x235)+_0x5c7187(0x469,0x4c5,0x482,0x51c,0x4b1)+_0x463cf1(0x2d2,0x2eb,0x248,0x2b1,0x28d)+_0x5c7187(0x515,0x4d2,0x4c4,0x464,0x493)+_0x446bc7(0x5ce,0x636,0x5d9,0x635,0x62a)+_0x5c7187(0x4dd,0x4ee,0x4dc,0x508,0x52f)+_0x446bc7(0x607,0x5a5,0x603,0x573,0x5c6)+_0x446bc7(0x63d,0x56e,0x5f4,0x60f,0x5da)+_0x446bc7(0x5c5,0x5e7,0x5dd,0x58f,0x5c7)+_0x446bc7(0x5b4,0x5b7,0x603,0x63c,0x5c4)+_0x3f58e5(0x5a6,0x50d,0x56a,0x4f7,0x53c)+_0x3f58e5(0x5fb,0x66e,0x642,0x62a,0x5f5)+_0x446bc7(0x5e4,0x60a,0x543,0x541,0x5a4)+_0x5c7187(0x551,0x4ef,0x473,0x538,0x4d8)+_0x446bc7(0x5dc,0x636,0x5f2,0x64a,0x64f)+_0x3f58e5(0x64a,0x5fb,0x5fb,0x5a8,0x653)+_0x5c7187(0x417,0x463,0x4b4,0x4a1,0x410)+_0x463cf1(0x2c0,0x2af,0x2cf,0x2fa,0x366)+_0x446bc7(0x54d,0x5f9,0x5e6,0x612,0x5bc)+_0x446bc7(0x65c,0x68d,0x5f8,0x635,0x622)+_0x3f58e5(0x5c9,0x5bb,0x632,0x67d,0x62c)+_0x463cf1(0x374,0x34a,0x364,0x361,0x3d8)+_0x463cf1(0x2bf,0x2b1,0x2da,0x323,0x2ce)+_0x446bc7(0x563,0x5cc,0x5c1,0x5da,0x5cb),_0x3038f8={};return _0x3038f8[_0x446bc7(0x605,0x60b,0x542,0x541,0x59f)]=teks,conn[_0x5c7187(0x4e6,0x4f7,0x534,0x50d,0x573)+_0x463cf1(0x2cd,0x2ab,0x335,0x306,0x2e5)+'e'](from,_0x3038f8);}else{if(rumss){var teks=_0x5c7187(0x445,0x44e,0x429,0x4a0,0x428)+_0x5c7187(0x4e5,0x487,0x464,0x4ae,0x4db)+_0x3f8d6d(0x159,0x17c,0x1a3,0x193,0x1cf)+_0x3f8d6d(0x133,0xd1,0xde,0xed,0x12c)+_0x463cf1(0x320,0x2a3,0x2c2,0x2c5,0x25f)+_0x3f8d6d(0x148,0x172,0xe9,0x1ba,0x13a)+_0x3f58e5(0x586,0x5c3,0x5e3,0x575,0x61f)+_0x3f8d6d(0x120,0xee,0xd3,0x19a,0xb3)+_0x3f58e5(0x5cd,0x552,0x590,0x550,0x5bc)+_0x446bc7(0x5e4,0x544,0x58b,0x5e3,0x5b2)+_0x3f58e5(0x5d4,0x5f4,0x581,0x55b,0x535)+_0x5c7187(0x42a,0x42f,0x41f,0x437,0x47a)+_0x463cf1(0x36f,0x2ac,0x2e3,0x2fc,0x2d4)+_0x3f8d6d(0xde,0xbd,0x13f,0xfa,0x14d)+_0x3f8d6d(0x144,0x141,0xfd,0x1bd,0x107)+_0x463cf1(0x34c,0x2e1,0x2d3,0x33b,0x31c)+'_',_0x2c83db={};return _0x2c83db[_0x3f8d6d(0xd3,0x58,0x97,0xa0,0x104)]=teks,conn[_0x3f58e5(0x685,0x601,0x640,0x5dc,0x608)+_0x446bc7(0x62c,0x5bf,0x58e,0x5cc,0x5f5)+'e'](from,_0x2c83db);}}var roomm=Object[_0x3f8d6d(0x97,0x90,0x1e,0x75,0x8e)+'s'](anonymous)[_0x3f58e5(0x613,0x5e7,0x5f3,0x5cc,0x65d)](_0x190113=>_0x190113[_0x3f58e5(0x612,0x5c5,0x59e,0x597,0x575)]==_0x3f8d6d(0x182,0x12b,0x109,0x1bf,0x19a)+'NG'&&!anonyCheck(sender,_0x190113));if(roomm){var WickNs=(_0x446bc7(0x606,0x5e2,0x5f4,0x536,0x59b)+_0x3f58e5(0x622,0x59c,0x616,0x630,0x689))[_0x3f58e5(0x5cd,0x532,0x584,0x5fd,0x52f)]('|'),gtfSKD=0x4c0+0x982+0xa*-0x16d;while(!![]){switch(WickNs[gtfSKD++]){case'0':var _0x10b2e3={};_0x10b2e3[_0x3f8d6d(0xd3,0x86,0x7a,0xfb,0x12c)]=teks,await conn[_0x3f58e5(0x5ef,0x5e3,0x640,0x68a,0x67b)+_0x446bc7(0x5c1,0x5f7,0x650,0x643,0x5f5)+'e'](roomm['a'],_0x10b2e3);continue;case'1':roomm[_0x3f58e5(0x606,0x59b,0x59e,0x59e,0x55a)]=_0x446bc7(0x625,0x5da,0x61d,0x6ac,0x640)+_0x446bc7(0x645,0x609,0x681,0x66b,0x628);continue;case'2':var teks=_0x3f8d6d(0x109,0x146,0xb9,0xea,0xb4)+_0x463cf1(0x2b6,0x2d1,0x354,0x2f0,0x29e)+_0x446bc7(0x59d,0x59f,0x5ea,0x659,0x613)+_0x463cf1(0x302,0x326,0x313,0x2b7,0x2ef)+_0x3f58e5(0x561,0x63f,0x5c4,0x5c2,0x5c9)+_0x5c7187(0x46f,0x474,0x434,0x426,0x46d)+_0x3f58e5(0x544,0x525,0x581,0x5dc,0x50c)+_0x3f8d6d(0xa1,0xcf,0xd2,0xd7,0x63)+_0x446bc7(0x616,0x5cc,0x5b2,0x632,0x5eb)+_0x3f58e5(0x5d8,0x5f4,0x5b5,0x541,0x564)+_0x5c7187(0x518,0x4d2,0x461,0x48a,0x462)+_0x3f58e5(0x5e5,0x63e,0x635,0x5dc,0x62d)+_0x463cf1(0x298,0x2fc,0x2cb,0x292,0x2f9)+_0x463cf1(0x35a,0x2af,0x307,0x30f,0x2b7)+_0x5c7187(0x524,0x4b3,0x462,0x477,0x460)+_0x3f58e5(0x627,0x621,0x62c,0x5fe,0x5d8)+_0x5c7187(0x483,0x465,0x40b,0x3ed,0x41e)+_0x3f58e5(0x63b,0x63f,0x5d7,0x5f4,0x5fe)+_0x463cf1(0x368,0x338,0x32b,0x2ec,0x368)+_0x463cf1(0x2e3,0x365,0x372,0x2f7,0x314)+_0x446bc7(0x584,0x61c,0x5be,0x651,0x5e4)+_0x446bc7(0x5a4,0x50e,0x51b,0x518,0x57f)+_0x5c7187(0x41c,0x421,0x41c,0x3ce,0x3e7)+_0x463cf1(0x373,0x33f,0x2f8,0x348,0x38f)+_0x446bc7(0x59a,0x52f,0x553,0x5b6,0x5a7)+_0x3f8d6d(0xa9,0x120,0xc5,0x107,0xb4)+_0x3f58e5(0x5ae,0x604,0x5c5,0x5ca,0x5f1)+_0x3f58e5(0x603,0x662,0x617,0x5e3,0x5d0)+_0x446bc7(0x530,0x5e2,0x5d5,0x559,0x590)+_0x446bc7(0x68a,0x688,0x6ad,0x623,0x632)+'_';continue;case'3':var _0xdd6f13={};_0xdd6f13[_0x5c7187(0x42b,0x461,0x4d3,0x485,0x486)]=teks,await conn[_0x446bc7(0x689,0x68c,0x665,0x614,0x635)+_0x463cf1(0x2cb,0x371,0x305,0x306,0x2a5)+'e'](roomm['b'],_0xdd6f13);continue;case'4':roomm['b']=sender;continue;}break;}}else{if(!rooms){let id=+new Date();anonymous[id]={'id':id,'a':sender,'b':'','state':_0x3f8d6d(0x182,0x1f5,0x1d9,0x1a6,0x15b)+'NG'};var teks=_0x463cf1(0x285,0x2b1,0x310,0x29d,0x2b2)+_0x446bc7(0x55b,0x59f,0x5e0,0x5cf,0x5c5)+_0x5c7187(0x542,0x4e7,0x4a9,0x4e8,0x4eb)+_0x463cf1(0x2d0,0x2c0,0x2a3,0x310,0x300)+_0x463cf1(0x317,0x2db,0x310,0x2c5,0x321)+_0x463cf1(0x2ec,0x322,0x2db,0x325,0x2f7)+_0x446bc7(0x58a,0x5c1,0x562,0x604,0x5d8)+_0x446bc7(0x61d,0x571,0x65a,0x62a,0x5ec)+_0x3f58e5(0x589,0x61f,0x5ff,0x595,0x5ab)+_0x5c7187(0x4ce,0x453,0x41a,0x428,0x4a3)+_0x3f58e5(0x57d,0x571,0x5c7,0x5d5,0x643)+_0x446bc7(0x640,0x655,0x620,0x671,0x622)+_0x3f58e5(0x5b1,0x62a,0x5b0,0x5cb,0x5e4)+_0x463cf1(0x312,0x32d,0x2c4,0x320,0x2f0)+_0x5c7187(0x434,0x49b,0x509,0x4f0,0x4c8)+_0x3f58e5(0x653,0x5cd,0x5e6,0x577,0x5c9)+'t_',_0x17aee4={};_0x17aee4[_0x446bc7(0x53f,0x58a,0x547,0x5dd,0x59f)]=teks,await conn[_0x3f8d6d(0x169,0x196,0x1db,0x1a3,0x153)+_0x446bc7(0x5ae,0x613,0x5cb,0x62f,0x5f5)+'e'](from,_0x17aee4);}}break;case prefix+_0x3f58e5(0x56c,0x5e0,0x5e9,0x584,0x654):if(isGroup)return reply(mess[_0x446bc7(0x5da,0x53d,0x5e5,0x5ea,0x58b)+'M']);var roomo=Object[_0x3f58e5(0x5e3,0x589,0x56e,0x515,0x595)+'s'](anonymous)[_0x446bc7(0x5eb,0x64c,0x587,0x5f2,0x5e8)](_0x437798=>anonyCheck(sender,_0x437798));if(!roomo){var teks=_0x446bc7(0x56d,0x5ec,0x591,0x588,0x5c2)+_0x463cf1(0x303,0x312,0x317,0x30a,0x2fe)+_0x3f8d6d(0x122,0xdc,0x147,0x12f,0x13e)+_0x446bc7(0x5a8,0x59a,0x572,0x60b,0x597)+_0x3f58e5(0x583,0x5c1,0x5d9,0x5ff,0x576)+_0x463cf1(0x335,0x332,0x32a,0x2d9,0x334)+_0x3f8d6d(0x14c,0x161,0x10d,0x188,0x1a2)+_0x463cf1(0x334,0x31d,0x2f0,0x2e2,0x325)+_0x3f8d6d(0x158,0xf6,0x15e,0xe4,0x176)+_0x463cf1(0x2cb,0x319,0x33f,0x302,0x2ce)+_0x463cf1(0x329,0x28f,0x290,0x2e3,0x291)+_0x3f8d6d(0x107,0x122,0x14d,0xe9,0x139)+_0x3f8d6d(0xce,0x5d,0x12b,0xa8,0xbf)+_0x3f8d6d(0x168,0x195,0x16d,0x1b7,0x153),_0x397e66={};_0x397e66[_0x5c7187(0x438,0x461,0x434,0x3e5,0x414)]=teks,await conn[_0x3f8d6d(0x169,0x1e3,0x1b5,0xf8,0x1c6)+_0x3f58e5(0x670,0x64c,0x600,0x644,0x5f6)+'e'](from,_0x397e66);}else{var teks=_0x3f8d6d(0x181,0x1db,0x12d,0x1e2,0x17d)+_0x3f58e5(0x669,0x5ec,0x606,0x591,0x676)+_0x5c7187(0x4a7,0x516,0x517,0x51c,0x57c)+_0x463cf1(0x29a,0x357,0x30e,0x311,0x383)+_0x5c7187(0x4a6,0x4ef,0x4eb,0x54d,0x4dc)+_0x3f58e5(0x614,0x626,0x5f7,0x636,0x5a0)+_0x3f58e5(0x5d3,0x5af,0x5ff,0x60a,0x662)+_0x3f58e5(0x5b7,0x57b,0x5e7,0x601,0x5ac)+_0x5c7187(0x438,0x421,0x42c,0x490,0x478)+_0x463cf1(0x2f3,0x3ba,0x36d,0x348,0x33b)+_0x463cf1(0x368,0x2f2,0x323,0x309,0x28d)+_0x463cf1(0x2dd,0x34c,0x2ab,0x312,0x36d)+_0x446bc7(0x5d9,0x5e7,0x5b1,0x580,0x5f0)+_0x5c7187(0x4d4,0x4b5,0x465,0x4d9,0x4b8),teks2=_0x3f58e5(0x656,0x690,0x626,0x61e,0x5bd)+_0x3f8d6d(0x146,0xe8,0x109,0x12e,0xf6)+_0x3f58e5(0x657,0x579,0x5e2,0x624,0x5e7)+_0x446bc7(0x558,0x5cb,0x59a,0x574,0x573)+_0x5c7187(0x4ba,0x4dc,0x4f0,0x506,0x4dd)+_0x5c7187(0x48e,0x43a,0x40d,0x434,0x4a7)+_0x5c7187(0x4f2,0x4ef,0x4ba,0x4fa,0x4a7)+_0x463cf1(0x22c,0x272,0x2a0,0x27c,0x214)+_0x3f58e5(0x5bd,0x541,0x573,0x502,0x58c)+_0x5c7187(0x4cb,0x481,0x457,0x44e,0x482)+_0x446bc7(0x525,0x545,0x5e7,0x54d,0x589)+_0x3f58e5(0x514,0x513,0x588,0x55d,0x554)+_0x5c7187(0x3d5,0x423,0x3d9,0x41a,0x44e)+_0x3f58e5(0x64d,0x643,0x5ec,0x5e0,0x5cf)+_0x463cf1(0x2a7,0x2d3,0x248,0x28b,0x2ce)+_0x3f58e5(0x5c6,0x588,0x5f8,0x60d,0x619)+_0x463cf1(0x2c9,0x279,0x327,0x2c4,0x308)+_0x463cf1(0x38f,0x327,0x329,0x323,0x2f0)+_0x5c7187(0x508,0x48d,0x45b,0x4ec,0x4d9),_0x1c5c71={};_0x1c5c71[_0x3f8d6d(0xd3,0x5a,0x87,0x14b,0x78)]=teks,await conn[_0x3f8d6d(0x169,0x109,0x12e,0x1ae,0x17a)+_0x463cf1(0x299,0x2de,0x32c,0x306,0x325)+'e'](from,_0x1c5c71);let other=anonyOther(sender,roomo);var _0xb30c98={};_0xb30c98[_0x3f58e5(0x606,0x5c6,0x5aa,0x5b9,0x5af)]=teks2;if(other)await conn[_0x5c7187(0x523,0x4f7,0x54b,0x4fe,0x47b)+_0x446bc7(0x606,0x5ba,0x64a,0x5e1,0x5f5)+'e'](other,_0xb30c98);delete anonymous[roomo['id']];}break;case prefix+_0x3f58e5(0x674,0x5e3,0x62a,0x6a7,0x639):case prefix+_0x5c7187(0x524,0x4db,0x523,0x551,0x513):if(isGroup)return reply(mess[_0x5c7187(0x48c,0x44d,0x4c9,0x400,0x484)+'M']);let romeo=Object[_0x446bc7(0x588,0x530,0x589,0x590,0x563)+'s'](anonymous)[_0x3f8d6d(0x11c,0xfa,0x14e,0x10b,0x142)](_0x4a9194=>anonyCheck(sender,_0x4a9194));if(!romeo){var teks=_0x446bc7(0x60c,0x638,0x58d,0x639,0x5c2)+_0x5c7187(0x4c5,0x4bb,0x458,0x532,0x52c)+_0x446bc7(0x654,0x65d,0x594,0x65b,0x5ee)+_0x5c7187(0x3f9,0x459,0x3f3,0x474,0x449)+_0x446bc7(0x67c,0x61a,0x644,0x658,0x620)+_0x3f58e5(0x5bf,0x5e5,0x5de,0x61e,0x5db)+_0x3f58e5(0x533,0x5a1,0x56f,0x56e,0x4f8)+_0x463cf1(0x330,0x391,0x30e,0x32f,0x375)+_0x446bc7(0x565,0x629,0x649,0x5f4,0x5dc)+_0x446bc7(0x569,0x5a4,0x57a,0x55f,0x55f)+_0x446bc7(0x5d4,0x66c,0x658,0x60e,0x637)+_0x3f8d6d(0x12c,0x127,0x177,0x143,0x192)+_0x5c7187(0x4a9,0x4c3,0x4bc,0x53e,0x51e)+_0x3f58e5(0x58f,0x642,0x5fb,0x5e3,0x584)+_0x463cf1(0x33e,0x2ad,0x36a,0x304,0x375),_0x5c025a={};return _0x5c025a[_0x5c7187(0x401,0x461,0x49d,0x406,0x4d7)]=teks,await conn[_0x3f8d6d(0x169,0x10d,0x16b,0x173,0x183)+_0x3f58e5(0x62e,0x5c4,0x600,0x647,0x675)+'e'](from,_0x5c025a);}else{let other=anonyOther(sender,romeo);var teks1=_0x3f58e5(0x5a9,0x65d,0x626,0x64c,0x667)+_0x3f58e5(0x697,0x5db,0x61d,0x5ae,0x5cf)+_0x5c7187(0x47d,0x499,0x45a,0x4f8,0x4e3)+_0x5c7187(0x3fa,0x435,0x461,0x495,0x3d7)+_0x3f8d6d(0x14e,0xd1,0x146,0x138,0x1be)+_0x463cf1(0x245,0x237,0x303,0x289,0x29b)+_0x3f58e5(0x62c,0x66b,0x638,0x62d,0x676)+_0x463cf1(0x2be,0x25a,0x244,0x27c,0x21a)+_0x3f8d6d(0x9c,0xeb,0xa4,0x114,0x7f)+_0x5c7187(0x428,0x481,0x462,0x425,0x493)+_0x463cf1(0x2dc,0x2fb,0x2c7,0x29a,0x2b3)+_0x3f8d6d(0xa4,0x10f,0x10a,0x37,0x44)+_0x3f58e5(0x59f,0x578,0x59f,0x5d7,0x5c1)+_0x5c7187(0x3ea,0x45b,0x49c,0x465,0x4b9)+_0x3f58e5(0x632,0x5fc,0x5c7,0x635,0x54b)+_0x463cf1(0x2cc,0x2cd,0x2b9,0x333,0x32b)+_0x3f58e5(0x611,0x5a1,0x59d,0x57c,0x5e9)+_0x3f58e5(0x5a1,0x60d,0x5d7,0x651,0x5bc)+_0x463cf1(0x29f,0x278,0x360,0x2ec,0x2dd)+'t_',_0xfbb7ca={};_0xfbb7ca[_0x5c7187(0x414,0x461,0x41c,0x4cb,0x3fb)]=teks1;if(other)await conn[_0x463cf1(0x34c,0x31b,0x3c2,0x346,0x32e)+_0x3f58e5(0x664,0x5e9,0x600,0x675,0x5fc)+'e'](other,_0xfbb7ca);delete anonymous[romeo['id']];}let room=Object[_0x463cf1(0x1fd,0x280,0x21c,0x274,0x2c6)+'s'](anonymous)[_0x3f8d6d(0x11c,0x114,0xfb,0x15b,0xc6)](_0x10b968=>_0x10b968[_0x3f58e5(0x538,0x5e0,0x59e,0x590,0x572)]==_0x3f8d6d(0x182,0x1ec,0x1cb,0x1d8,0x15e)+'NG'&&!anonyCheck(sender,_0x10b968));if(room){var uzwNsT=(_0x463cf1(0x354,0x361,0x389,0x31a,0x31b)+_0x3f8d6d(0x138,0x136,0xe0,0x151,0x18f))[_0x463cf1(0x2e4,0x2fb,0x29c,0x28a,0x305)]('|'),JwdyJk=0x159c+-0x1a3a*0x1+0x49e*0x1;while(!![]){switch(uzwNsT[JwdyJk++]){case'0':room['b']=sender;continue;case'1':var teks=_0x3f8d6d(0x109,0xf1,0xa0,0x16c,0x101)+_0x5c7187(0x473,0x4a1,0x501,0x501,0x4de)+_0x3f8d6d(0x147,0x1a5,0xf1,0x17e,0x101)+_0x463cf1(0x24c,0x32e,0x29e,0x2b7,0x287)+_0x446bc7(0x5b0,0x589,0x61c,0x594,0x5b9)+_0x3f8d6d(0xe6,0xa0,0xa7,0xab,0x10b)+_0x463cf1(0x2fc,0x21c,0x23b,0x287,0x2be)+_0x463cf1(0x270,0x2dd,0x25d,0x27e,0x2c0)+_0x463cf1(0x344,0x357,0x324,0x2fc,0x2b3)+_0x3f58e5(0x5f6,0x582,0x5b5,0x577,0x561)+_0x446bc7(0x595,0x662,0x66e,0x60a,0x610)+_0x5c7187(0x525,0x4ec,0x4c0,0x476,0x4aa)+_0x3f58e5(0x56f,0x5c4,0x58c,0x5f2,0x5d1)+_0x446bc7(0x5fd,0x605,0x609,0x613,0x5fe)+_0x463cf1(0x2ab,0x304,0x329,0x302,0x2f1)+_0x5c7187(0x52d,0x4e3,0x46c,0x4dc,0x548)+_0x446bc7(0x617,0x53b,0x53d,0x529,0x5a3)+_0x463cf1(0x2dc,0x263,0x2a4,0x2dd,0x314)+_0x463cf1(0x305,0x287,0x2e5,0x2ec,0x29a)+_0x446bc7(0x655,0x5db,0x579,0x624,0x5e6)+_0x3f8d6d(0x118,0x105,0xd9,0xb8,0x150)+_0x3f58e5(0x5c6,0x545,0x58a,0x5b8,0x57c)+_0x3f58e5(0x5e6,0x529,0x56a,0x5d5,0x54d)+_0x446bc7(0x6a9,0x63e,0x5c6,0x629,0x637)+_0x3f58e5(0x5d5,0x562,0x5b2,0x580,0x5ce)+_0x5c7187(0x3e5,0x437,0x3db,0x3e3,0x3d1)+_0x463cf1(0x307,0x2d0,0x30a,0x2cb,0x31c)+_0x3f58e5(0x5ea,0x653,0x617,0x59d,0x679)+_0x5c7187(0x457,0x452,0x3d6,0x41a,0x4a6)+_0x446bc7(0x6aa,0x5fd,0x6a8,0x61c,0x632)+'_';continue;case'2':var _0xd8cd80={};_0xd8cd80[_0x3f8d6d(0xd3,0x57,0x93,0xff,0x14b)]=teks,await conn[_0x446bc7(0x5ed,0x6af,0x65a,0x650,0x635)+_0x5c7187(0x4a9,0x4b7,0x531,0x497,0x4ed)+'e'](room['a'],_0xd8cd80);continue;case'3':room[_0x446bc7(0x5fa,0x572,0x5ca,0x5d9,0x593)]=_0x463cf1(0x36f,0x328,0x3a4,0x351,0x2df)+_0x463cf1(0x2c2,0x31d,0x361,0x339,0x2fa);continue;case'4':var _0x5b1361={};_0x5b1361[_0x446bc7(0x5df,0x59c,0x616,0x5a1,0x59f)]=teks,await conn[_0x446bc7(0x5fc,0x5fd,0x658,0x697,0x635)+_0x446bc7(0x616,0x66c,0x62a,0x671,0x5f5)+'e'](room['b'],_0x5b1361);continue;}break;}}else{let id=+new Date();anonymous[id]={'id':id,'a':sender,'b':'','state':_0x3f58e5(0x614,0x6c6,0x659,0x685,0x6c6)+'NG'};var teks=_0x446bc7(0x59b,0x514,0x586,0x52b,0x58c)+_0x5c7187(0x4b2,0x487,0x4bd,0x4dd,0x496)+_0x3f58e5(0x678,0x5e3,0x630,0x61f,0x61c)+_0x3f58e5(0x613,0x614,0x60a,0x5bb,0x64b)+_0x446bc7(0x5a5,0x5e5,0x60f,0x53a,0x5b4)+_0x3f8d6d(0x148,0x1a3,0x1be,0x16c,0x1a1)+_0x3f58e5(0x59a,0x5cf,0x5e3,0x5c4,0x597)+_0x463cf1(0x301,0x2ce,0x347,0x2fd,0x2f2)+_0x5c7187(0x45a,0x4b6,0x524,0x441,0x4a7)+_0x5c7187(0x441,0x453,0x445,0x410,0x4c8)+_0x5c7187(0x403,0x47e,0x497,0x4c8,0x4a5)+_0x463cf1(0x36e,0x323,0x30f,0x333,0x2d3)+_0x3f8d6d(0xd9,0xf2,0x14d,0x12b,0x68)+_0x463cf1(0x2e6,0x2f1,0x397,0x320,0x2f7)+_0x5c7187(0x493,0x49b,0x4f7,0x428,0x4f2)+_0x5c7187(0x479,0x49d,0x487,0x4a6,0x43a)+'t_',_0x36d689={};_0x36d689[_0x463cf1(0x293,0x2a9,0x28e,0x2b0,0x314)]=teks,await conn[_0x3f58e5(0x674,0x6a0,0x640,0x68e,0x614)+_0x463cf1(0x2e7,0x2d9,0x340,0x306,0x2f2)+'e'](from,_0x36d689);}break;case prefix+(_0x3f58e5(0x614,0x628,0x613,0x647,0x5ca)+_0x3f8d6d(0x96,0x10d,0x80,0x6e,0x65)+'e'):case prefix+(_0x463cf1(0x2ea,0x2c9,0x2b0,0x319,0x2a8)+_0x463cf1(0x289,0x2b5,0x29b,0x273,0x224)):if(isGroup)return reply(mess[_0x5c7187(0x44e,0x44d,0x40a,0x4bd,0x3f1)+'M']);let romoe=Object[_0x3f58e5(0x58c,0x59c,0x56e,0x5d0,0x5d1)+'s'](anonymous)[_0x463cf1(0x2a7,0x2a4,0x284,0x2f9,0x2ab)](_0x30bb5e=>anonyCheck(sender,_0x30bb5e)&&_0x30bb5e[_0x463cf1(0x2a7,0x2e6,0x2fe,0x2a4,0x304)]==_0x463cf1(0x2ed,0x384,0x37d,0x351,0x38c)+_0x5c7187(0x4e1,0x4ea,0x511,0x4c7,0x515));if(!romoe){var teks=_0x3f8d6d(0xf6,0x12d,0x14f,0xc0,0x169)+_0x3f8d6d(0x12d,0x138,0x140,0xe2,0xbc)+_0x3f8d6d(0x122,0xbc,0x157,0x18f,0xeb)+_0x3f58e5(0x603,0x557,0x5a2,0x577,0x61a)+_0x446bc7(0x5d7,0x5bd,0x5db,0x628,0x620)+_0x3f8d6d(0x107,0x155,0x14d,0x8a,0xd9)+_0x3f8d6d(0x98,0xcd,0x7d,0xad,0xe0)+_0x3f58e5(0x677,0x63a,0x629,0x61b,0x64b)+_0x3f8d6d(0x110,0x103,0x181,0x12b,0xf8)+_0x3f8d6d(0x93,0x9f,0x51,0x71,0x8f)+_0x463cf1(0x3aa,0x2e8,0x3ab,0x348,0x387)+_0x3f8d6d(0x12c,0xd3,0x131,0x130,0x167)+_0x5c7187(0x44d,0x4c3,0x46c,0x44f,0x51c)+_0x5c7187(0x4a8,0x4b2,0x47c,0x4fa,0x48c)+_0x446bc7(0x5b5,0x58a,0x5f5,0x635,0x5f3),_0x3bc8a7={};_0x3bc8a7[_0x3f8d6d(0xd3,0xc8,0xa5,0xf3,0x74)]=teks,await conn[_0x446bc7(0x64b,0x5ca,0x5b9,0x5dc,0x635)+_0x463cf1(0x2d8,0x2b1,0x35e,0x306,0x29a)+'e'](from,_0x3bc8a7);}else{let rms=Object[_0x5c7187(0x42c,0x425,0x417,0x3bd,0x497)+'s'](anonymous)[_0x463cf1(0x2bb,0x2bd,0x2a9,0x2f9,0x2aa)](_0x4319f8=>[_0x4319f8['a'],_0x4319f8['b']][_0x3f58e5(0x5b8,0x54a,0x5ad,0x560,0x534)+_0x3f8d6d(0x17b,0x1e5,0x16e,0x1e5,0x16b)](sender)&&_0x4319f8[_0x446bc7(0x535,0x57a,0x5f3,0x5af,0x593)]==_0x463cf1(0x2fd,0x33c,0x381,0x351,0x35b)+_0x3f8d6d(0x15c,0x178,0x1bd,0x1b1,0x119));var partnerJID=anonyOther(sender,rms),res=await conn[_0x5c7187(0x4a7,0x4a2,0x4a7,0x512,0x4f9)+_0x3f8d6d(0xe4,0x10a,0x11d,0x14a,0x130)+'t'](partnerJID,[sender[_0x3f58e5(0x51e,0x5dc,0x584,0x5e0,0x591)]('@')[-0xa*-0x3d2+0x179c+-0x3dd0]]),_0x3e2394={};_0x3e2394[_0x3f8d6d(0xd3,0x10e,0x12e,0x112,0x125)]=_0x5c7187(0x52e,0x50f,0x52b,0x4e4,0x50f)+_0x446bc7(0x644,0x630,0x5d3,0x655,0x5fb)+_0x5c7187(0x573,0x516,0x55e,0x582,0x557)+_0x463cf1(0x391,0x356,0x32a,0x317,0x2c5)+_0x3f58e5(0x635,0x62e,0x65c,0x61d,0x6c0)+_0x5c7187(0x48f,0x4e5,0x51b,0x52a,0x55b)+_0x3f58e5(0x5dc,0x581,0x5e1,0x5ab,0x579)+_0x3f8d6d(0x120,0x144,0x157,0xc4,0x178)+_0x5c7187(0x439,0x444,0x45a,0x3ef,0x4a2)+_0x5c7187(0x4e5,0x480,0x4dc,0x4b7,0x40d);var _0x491f3b={};_0x491f3b[_0x5c7187(0x522,0x508,0x51e,0x4bf,0x4be)+'d']=msg,conn[_0x446bc7(0x646,0x627,0x5e5,0x615,0x635)+_0x5c7187(0x47f,0x4b7,0x528,0x4f1,0x43c)+'e'](from,_0x3e2394,_0x491f3b);var _0x2cf243={};_0x2cf243[_0x446bc7(0x545,0x5c2,0x593,0x5fb,0x59f)]=_0x3f58e5(0x5eb,0x637,0x64e,0x610,0x606)+_0x3f58e5(0x698,0x647,0x620,0x660,0x604)+_0x5c7187(0x51a,0x4ec,0x487,0x506,0x564)+_0x3f8d6d(0x94,0x104,0x88,0x10b,0x22)+_0x463cf1(0x251,0x2eb,0x227,0x27b,0x2d3)+_0x5c7187(0x4cc,0x4a5,0x4ea,0x4d6,0x47b)+_0x446bc7(0x616,0x632,0x697,0x679,0x629)+_0x5c7187(0x436,0x4b1,0x450,0x4b1,0x45c)+_0x3f8d6d(0x96,0x31,0xc6,0xa4,0x45)+_0x3f58e5(0x61b,0x60f,0x646,0x644,0x637);var _0x1e5039={};_0x1e5039[_0x5c7187(0x4ed,0x508,0x4ec,0x4fd,0x535)+'d']=res,conn[_0x5c7187(0x480,0x4f7,0x507,0x486,0x568)+_0x3f58e5(0x5c3,0x5a6,0x600,0x62d,0x5ec)+'e'](partnerJID,_0x2cf243,_0x1e5039);}break;case prefix+_0x3f58e5(0x61a,0x61d,0x5df,0x61b,0x645):if(!isOwner)return reply(mess[_0x463cf1(0x307,0x3ca,0x393,0x35b,0x355)+_0x3f58e5(0x686,0x5f1,0x63c,0x667,0x5e2)]);if(args[_0x463cf1(0x2dc,0x265,0x2c8,0x299,0x24b)+'h']<-0x1*0x21f5+-0x17*0xd7+-0x14*-0x2aa)return reply(_0x446bc7(0x592,0x5fc,0x5a7,0x5bb,0x60a)+_0x463cf1(0x2cd,0x293,0x37a,0x308,0x381)+_0x446bc7(0x668,0x5be,0x5c9,0x5a1,0x611)+_0x5c7187(0x40f,0x429,0x453,0x497,0x485)+_0x5c7187(0x4f3,0x4a9,0x492,0x463,0x4a9)+'n\x20'+command+(_0x463cf1(0x284,0x297,0x253,0x276,0x23a)+'vn'));if(!isQuotedAudio)return reply(_0x3f58e5(0x52c,0x594,0x57d,0x58c,0x55e)+_0x3f8d6d(0xef,0xb2,0xf2,0x11c,0x113)+_0x446bc7(0x5e7,0x5ed,0x564,0x60e,0x5bd)+_0x463cf1(0x2e0,0x303,0x343,0x33c,0x339)+_0x3f58e5(0x5ea,0x572,0x5ea,0x5eb,0x5af)+_0x463cf1(0x226,0x292,0x2f3,0x29e,0x225)+_0x3f58e5(0x5e9,0x60f,0x627,0x650,0x5fd)+command+(_0x463cf1(0x274,0x299,0x282,0x276,0x29e)+'vn'));var dbx=listvn[_0x5c7187(0x43f,0x4aa,0x444,0x45a,0x4d6)](_0x5633f6=>_0x5633f6[_0x3f8d6d(0x14a,0x15b,0x1a4,0x199,0x14a)]===q);if(dbx!==undefined){if(dbx[_0x463cf1(0x316,0x353,0x33b,0x327,0x36b)]===q)return reply(_0x463cf1(0x22f,0x272,0x27b,0x2a6,0x271)+_0x463cf1(0x29f,0x2ff,0x362,0x2f0,0x2f4)+_0x3f58e5(0x525,0x5d3,0x589,0x562,0x5d0)+q+(_0x3f8d6d(0xfe,0xe4,0xfd,0xc7,0x93)+_0x463cf1(0x2f4,0x2c5,0x2f1,0x30d,0x340)+'a!'));}var media=null;if(isQuotedAudio)var media=await downloadAndSaveMediaMessage(msg,_0x463cf1(0x32d,0x3c5,0x2e3,0x353,0x376),_0x463cf1(0x3ab,0x353,0x2e7,0x35d,0x3c6)+_0x463cf1(0x2a9,0x2d3,0x2d2,0x291,0x2ac)+_0x463cf1(0x2f0,0x2d0,0x319,0x2c7,0x27b)+q+_0x446bc7(0x62a,0x68d,0x606,0x6b3,0x64b));else return reply(_0x463cf1(0x2c0,0x2cf,0x2b0,0x31b,0x32d)+_0x3f58e5(0x61b,0x591,0x602,0x601,0x5ac)+_0x463cf1(0x386,0x306,0x31e,0x322,0x2ea)+_0x3f58e5(0x5dd,0x588,0x572,0x5ec,0x5b5)+_0x463cf1(0x31e,0x35e,0x318,0x2f8,0x360)+'n\x20'+command+(_0x3f58e5(0x5e0,0x5b3,0x570,0x504,0x5c2)+'vn'));if(media!==null){var _0x5a9526={};_0x5a9526[_0x446bc7(0x5ae,0x645,0x60b,0x640,0x616)]=q,_0x5a9526[_0x463cf1(0x276,0x273,0x2a3,0x280,0x2be)]=_0x3f58e5(0x688,0x68c,0x657,0x681,0x5ec)+_0x463cf1(0x306,0x23e,0x229,0x291,0x23a)+_0x5c7187(0x499,0x478,0x4b4,0x4dd,0x4d1)+q+_0x3f8d6d(0x17f,0x1cc,0x179,0x182,0x122);var obj=_0x5a9526;listvn[_0x5c7187(0x4b6,0x4c9,0x506,0x470,0x498)](obj),fs[_0x446bc7(0x5ef,0x5c6,0x58b,0x64d,0x602)+_0x446bc7(0x58a,0x600,0x60b,0x5d2,0x5ae)+_0x446bc7(0x508,0x583,0x55d,0x59b,0x577)](_0x446bc7(0x592,0x5ec,0x575,0x5ab,0x596)+_0x5c7187(0x489,0x4df,0x48c,0x471,0x4dd)+_0x446bc7(0x5ca,0x5f3,0x5ca,0x670,0x605)+_0x5c7187(0x48a,0x492,0x48b,0x42e,0x489)+_0x463cf1(0x328,0x28f,0x270,0x2ad,0x2de),JSON[_0x3f8d6d(0xcc,0x5e,0xb9,0x13d,0xab)+_0x446bc7(0x5fe,0x5f9,0x624,0x57f,0x5c9)](listvn,null,-0x19d1+-0x665+0x1*0x2038)),reply(_0x3f8d6d(0x16d,0x1a2,0x1cb,0x123,0x152)+'s');}break;case prefix+(_0x446bc7(0x5e9,0x5c4,0x697,0x676,0x63a)+'n'):if(!isOwner)return reply(mess[_0x463cf1(0x36e,0x3cf,0x35a,0x35b,0x377)+_0x446bc7(0x675,0x60f,0x627,0x6a4,0x631)]);var dbx=listvn[_0x463cf1(0x28c,0x2c9,0x2f2,0x2f9,0x315)](_0x570954=>_0x570954);if(dbx===undefined)return reply(_0x5c7187(0x528,0x4fe,0x4f1,0x4fe,0x55d)+_0x3f58e5(0x635,0x642,0x5d8,0x591,0x655)+_0x3f8d6d(0x126,0x192,0xfc,0xbe,0x12e)+_0x3f58e5(0x617,0x5db,0x5f5,0x59c,0x633)+_0x3f8d6d(0xba,0xd4,0xd2,0xed,0x10c));var no=0x53*0x29+-0x337*-0xb+0x9bb*-0x5,teks=_0x3f58e5(0x5db,0x5f6,0x641,0x6bb,0x676)+_0x3f8d6d(0xe9,0x125,0x81,0x130,0xb8)+_0x3f8d6d(0x167,0x116,0x1aa,0x10d,0x166);for(let i of listvn){teks+='*'+no++ +_0x463cf1(0x31e,0x350,0x2a9,0x307,0x31f)+i[_0x5c7187(0x52b,0x4d8,0x4d6,0x4ff,0x53a)]+_0x463cf1(0x360,0x2db,0x357,0x33f,0x339)+prefix+(_0x3f8d6d(0x178,0x154,0xfe,0x11f,0x1b7)+'\x20')+i[_0x446bc7(0x5c6,0x575,0x5af,0x53d,0x56f)][_0x3f58e5(0x633,0x622,0x648,0x5dc,0x61e)+'ce'](_0x3f58e5(0x6ce,0x641,0x657,0x6ce,0x648)+_0x3f58e5(0x562,0x5ed,0x58b,0x593,0x50f)+_0x3f8d6d(0xea,0xcf,0x123,0x99,0xbe),'')[_0x3f58e5(0x69e,0x5cb,0x648,0x6b6,0x5e1)+'ce'](_0x3f8d6d(0x17f,0x126,0x1c5,0x1ba,0x120),'')+'\x0a';}teks+='\x0a*'+prefix+(_0x463cf1(0x2a0,0x20a,0x2e3,0x27f,0x210)+_0x3f8d6d(0x99,0xdd,0x9d,0x36,0xfe)+_0x446bc7(0x5e4,0x5ac,0x545,0x60b,0x5a9)+_0x3f58e5(0x660,0x673,0x642,0x5f5,0x5ef)+_0x3f8d6d(0x17d,0x17e,0x121,0x123,0x1a9)+_0x3f58e5(0x5ed,0x68e,0x63a,0x5f3,0x61e)+_0x463cf1(0x26c,0x2f1,0x297,0x27a,0x2c2)+_0x463cf1(0x289,0x307,0x330,0x2c2,0x2df)+_0x5c7187(0x479,0x446,0x419,0x3cb,0x47b)+'*'),reply(teks);break;case prefix+_0x446bc7(0x611,0x6c0,0x68b,0x66d,0x644):if(args[_0x446bc7(0x583,0x52f,0x5c1,0x510,0x588)+'h']<-0x6*0x673+0x1*-0x1dcc+0x4480)return reply(_0x5c7187(0x502,0x4a4,0x519,0x478,0x432)+_0x3f8d6d(0xdc,0xb9,0x13d,0xd2,0xc5)+_0x463cf1(0x330,0x27a,0x344,0x2f6,0x2b7)+command+(_0x3f58e5(0x539,0x53b,0x570,0x5de,0x5b8)+'vn'));try{var dbx=listvn[_0x5c7187(0x4c2,0x4aa,0x47a,0x51d,0x486)](_0x38ac35=>_0x38ac35[_0x3f58e5(0x63c,0x5bb,0x621,0x5f7,0x67f)]===q);if(dbx!==undefined){if(dbx===undefined)return reply(_0x446bc7(0x644,0x6b4,0x693,0x5cb,0x63c)+_0x463cf1(0x33b,0x340,0x2d0,0x2de,0x303)+_0x3f58e5(0x63e,0x5a6,0x5fd,0x606,0x5c9)+_0x3f58e5(0x66c,0x616,0x5f5,0x611,0x63f)+_0x463cf1(0x290,0x251,0x222,0x297,0x294));}var _0x3877dd={};_0x3877dd[_0x446bc7(0x4ee,0x54c,0x54b,0x57b,0x55e)]=dbx[_0x3f8d6d(0xa3,0x4d,0x64,0x8f,0x5f)],_0x3877dd[_0x3f8d6d(0xf7,0xc9,0x10b,0xd6,0x87)+_0x5c7187(0x4cf,0x479,0x466,0x412,0x3fd)]=_0x3f58e5(0x663,0x664,0x64d,0x680,0x5f2)+_0x3f8d6d(0x9a,0xd5,0x5f,0xde,0xea),_0x3877dd[_0x463cf1(0x30b,0x265,0x269,0x298,0x300)]=!![];var _0x50c8c8={};_0x50c8c8[_0x3f58e5(0x668,0x62b,0x64d,0x64c,0x601)]=_0x3877dd;var _0x5e735e={};_0x5e735e[_0x3f8d6d(0x17a,0x179,0x121,0x169,0x12c)+'d']=msg,conn[_0x463cf1(0x2e4,0x39c,0x33c,0x346,0x2ca)+_0x3f8d6d(0x129,0x179,0x122,0x11e,0x12b)+'e'](from,_0x50c8c8,_0x5e735e);}catch{reply(_0x5c7187(0x4a2,0x457,0x44b,0x480,0x486)+_0x446bc7(0x5dd,0x645,0x59c,0x5eb,0x5df)+_0x3f58e5(0x568,0x5d5,0x589,0x542,0x54c)+q+(_0x3f58e5(0x619,0x62b,0x622,0x5f4,0x607)+_0x5c7187(0x57a,0x501,0x49e,0x4c6,0x4a0)+'a!'));}break;case prefix+_0x5c7187(0x488,0x430,0x425,0x482,0x4a0):if(!isOwner)return reply(mess[_0x3f58e5(0x610,0x5fd,0x655,0x69d,0x5e9)+_0x5c7187(0x511,0x4f3,0x4bf,0x487,0x487)]);if(args[_0x3f58e5(0x544,0x540,0x593,0x5fd,0x60c)+'h']<0x14ec+-0xe1c+0x1*-0x6ce)return reply(_0x5c7187(0x50c,0x4a4,0x4f7,0x4d8,0x50a)+_0x3f8d6d(0xdc,0x8a,0xfa,0xc0,0xa1)+_0x446bc7(0x5a6,0x65f,0x596,0x59b,0x5e5)+command+(_0x5c7187(0x3bf,0x427,0x419,0x439,0x438)+'vn'));try{var IbTzzf=(_0x446bc7(0x5f7,0x57b,0x546,0x58f,0x5af)+_0x3f58e5(0x5f2,0x5d2,0x643,0x6bc,0x6b5)+_0x3f8d6d(0xe0,0xa2,0x156,0xd2,0x117))[_0x463cf1(0x221,0x285,0x2b4,0x28a,0x294)]('|'),agBvOH=-0x2b4*-0x8+-0xa43+-0xb5d;while(!![]){switch(IbTzzf[agBvOH++]){case'0':fs[_0x446bc7(0x63c,0x589,0x63f,0x5a6,0x602)+_0x3f8d6d(0xe2,0x129,0x108,0x74,0x14b)+_0x5c7187(0x3be,0x439,0x403,0x489,0x48a)](_0x3f8d6d(0xca,0x12c,0x135,0xdb,0xe2)+_0x446bc7(0x680,0x638,0x673,0x5f8,0x61d)+_0x3f8d6d(0x139,0x17d,0x179,0x153,0x1ac)+_0x446bc7(0x59a,0x62f,0x5c3,0x5c6,0x5d0)+_0x3f8d6d(0xd0,0xe1,0xf8,0xd0,0xf9),JSON[_0x446bc7(0x51f,0x54e,0x608,0x5df,0x598)+_0x3f58e5(0x5fc,0x5c2,0x5d4,0x651,0x63a)](listvn,null,0x12c7+0x111f*0x1+-0x23e4));continue;case'1':fs[_0x3f8d6d(0x175,0x115,0x194,0x1f2,0x18e)+_0x5c7187(0x48e,0x507,0x4de,0x48e,0x4ac)](dbx[_0x3f58e5(0x549,0x5a1,0x57a,0x55e,0x59b)]);continue;case'2':var posi=listvn[_0x446bc7(0x549,0x5f7,0x545,0x566,0x5c0)+'Of'](dbx);continue;case'3':reply(_0x446bc7(0x5f4,0x613,0x644,0x6a7,0x639)+'s');continue;case'4':if(dbx!==undefined){if(dbx===undefined)return reply(_0x463cf1(0x2e1,0x34e,0x3bc,0x34d,0x3ad)+_0x3f8d6d(0x101,0x176,0x137,0xa1,0xe3)+_0x5c7187(0x444,0x4b4,0x47e,0x43b,0x504)+_0x463cf1(0x33d,0x2ce,0x2cf,0x2fb,0x377)+_0x463cf1(0x30f,0x256,0x305,0x297,0x2c5));}continue;case'5':var dbx=listvn[_0x446bc7(0x651,0x652,0x609,0x63a,0x5e8)](_0x2493c1=>_0x2493c1[_0x446bc7(0x66d,0x643,0x62b,0x662,0x616)]===q);continue;case'6':listvn[_0x446bc7(0x5ce,0x551,0x572,0x561,0x58f)+'e'](posi,0x1030+-0xf69+-0xb*0x12);continue;}break;}}catch{reply(_0x3f58e5(0x5b1,0x52d,0x5a0,0x56e,0x56e)+_0x446bc7(0x65b,0x5e7,0x5b9,0x575,0x5df)+_0x463cf1(0x28b,0x2cf,0x2e7,0x28f,0x27a)+q+(_0x3f8d6d(0x14b,0xd3,0xf1,0xfb,0x14d)+_0x463cf1(0x340,0x391,0x378,0x350,0x378)+'a!'));}break;default:}
	} catch (err) {
		console.log(color('[ERROR]', 'red'), err)
	}
}
