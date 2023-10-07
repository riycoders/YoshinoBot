const moment = require("moment-timezone");
const fs = require("fs");

moment.tz.setDefault("Asia/Jakarta").locale("id");

let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
const ucapanWaktu = "Selamat "+dt.charAt(0).toUpperCase() + dt.slice(1)
let setting = JSON.parse(fs.readFileSync('./config.json'))
const { getLimit, getBalance, cekGLimit } = require("../lib/limit")

const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)

function toCommas(x) {
	x = x.toString()
	var pattern = /(-?\d+)(\d{3})/;
     while (pattern.test(x))
	   x = x.replace(pattern, "$1,$2");
	return x;
}

exports.allmenu = (sender, prefix, pushname, isOwner, isPremium, balance, limit, limitCount, glimit, gcount) => {
	return `${ucapanWaktu} ${pushname !== undefined ? pushname : 'Kak'}

Status : ${isOwner ? 'Owner' : isPremium ? 'Premium' : 'Free'}
Limit Harian : ${isOwner ? '-' : isPremium ? 'Unlimited' : getLimit(sender, limitCount, limit)}
Limit Game : ${isOwner ? '-' : cekGLimit(sender, gcount, glimit)}
Balance : $${toCommas(getBalance(sender, balance))}

*Main Menu*
${prefix}menu
${prefix}owner
${prefix}donasi
${prefix}speed
${prefix}runtime
${prefix}cekprem
${prefix}listprem

*Converter/Tools*
${prefix}sticker
${prefix}toimg
${prefix}tovid
${prefix}tomp3
${prefix}ttp
${prefix}attp
${prefix}emojimix
${prefix}say
${prefix}qc
${prefix}openai
 
*Anonymous Chat*
${prefix}anonymous
${prefix}start
${prefix}skip
${prefix}stop
${prefix}sendprofile
${prefix}menfess

*Downloader*
${prefix}tiktok
${prefix}instagram
${prefix}play
${prefix}ytmp4
${prefix}ytmp3
  
*Random Menu*
${prefix}quote
${prefix}fakta
${prefix}quoteanime
${prefix}waifu

*PhotoOxy Menu*
${prefix}flaming
${prefix}night
${prefix}shadow
${prefix}paper
${prefix}grass
${prefix}cube
${prefix}glow
${prefix}rainbow
${prefix}fabric
${prefix}glowing
${prefix}honey
${prefix}vintage
${prefix}fur
${prefix}striking
  
*Search Menu*
${prefix}yts
${prefix}lirik
${prefix}gimage

*Game Menu*
${prefix}tebaklagu
${prefix}asahotak
${prefix}caklontong
${prefix}family100
${prefix}siapakahaku
${prefix}susunkata
${prefix}tebakbendera
${prefix}tebakgambar
${prefix}tebakkalimat
${prefix}tebakkata
${prefix}tebakkimia
${prefix}tebaklirik
${prefix}kuis
${prefix}math
${prefix}nyerah
${prefix}tictactoe
${prefix}delttt
${prefix}casino
${prefix}delcasino
${prefix}bet
${prefix}werewolf
  
*Payment & Bank*
${prefix}buylimit
${prefix}buyglimit
${prefix}transfer
${prefix}limit
${prefix}balance
  
*Group Menu*
${prefix}linkgrup
${prefix}setnamegc
${prefix}setdesc
${prefix}group
${prefix}revoke
${prefix}delete
${prefix}tagall
${prefix}hidetag
${prefix}antilink
${prefix}welcome
  
*Owner Menu*
> evalcode
x evalcode-2
$ executor
${prefix}join
${prefix}broadcast
${prefix}exif
${prefix}leave
${prefix}addprem
${prefix}delprem`
}
