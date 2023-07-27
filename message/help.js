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
${prefix}emojimix
${prefix}nulis
${prefix}qc
 
*Anonymous Chat*
${prefix}anonymous
${prefix}start
${prefix}skip
${prefix}stop
${prefix}sendprofile

*Downloader*
${prefix}play
${prefix}tiktok
${prefix}ytmp4
${prefix}ytmp3
${prefix}getvideo
${prefix}getmusic
 
*Storage Menu*
${prefix}addvn
${prefix}listvn
${prefix}getvn
${prefix}delvn
  
*Random Menu*
${prefix}waifu
  
*Search Menu*
${prefix}ytsearch
${prefix}igstalk
  
*Game Menu*
${prefix}tebaklagu
${prefix}family100
${prefix}math
${prefix}nyerah
  
*Payment & Bank*
${prefix}buylimit
${prefix}buyglimit
${prefix}transfer
${prefix}limit
${prefix}balance
  
*Group Menu*
${prefix}linkgrup
${prefix}setppgrup
${prefix}setnamegc
${prefix}setdesc
${prefix}group
${prefix}revoke
${prefix}tagall
${prefix}hidetag
  
*Owner Menu*
> evalcode
x evalcode-2
$ executor
${prefix}join
${prefix}broadcast
${prefix}setppbot
${prefix}exif
${prefix}leave
${prefix}addprem
${prefix}delprem`
}
