const axios = require("axios")
const cheerio = require("cheerio")

function randomNomor(min, max = null) {
   if (max !== null) {
     min = Math.ceil(min);
     max = Math.floor(max);
     return Math.floor(Math.random() * (max - min + 1)) + min;
   } else {
     return Math.floor(Math.random() * min) + 1
     }
}

exports.quoteAnime = async() => {
     var nomor = randomNomor(1, 5)
     const a = await axios.get("https://otakotaku.com/quote/feed/"+nomor);
     const $ = cheerio.load(a.data);
     let array = [];
     $("div.kotodama-list").each(function(l, h) {
        array.push({ 
           link: $(h).find("a").attr("href"),
           image: $(h).find("img").attr("data-src"),
           char_name: $(h).find("div.char-name").text().trim(),
           anime_title: $(h).find('div.anime-title').text().trim(),
           quote: $(h).find('div.quote').text().trim(),
           at_ep: $(h).find('div.meta').text().replace(/Episode/g, "").trim()
        });
     })
     return array
}