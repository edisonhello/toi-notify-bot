const config = require('./config.json')
const request = require('request')
const cheerio = require('cheerio')

const tgbotapi = require('node-telegram-bot-api')

const bot = new tgbotapi(config.token, {
    polling: true
})

var intervalId = setInterval(() => {
    let url = 'http://toi.csie.ntnu.edu.tw/'
    request.get(url, (err, res, body) => {
        let $ = cheerio.load(body, {decodeEntities: false})
        let lis = $('li')
        let count = 0
        for(let i=0; i<lis.length; i++) {
            if(lis.eq(i).text().indexOf('2018-04-09') !== -1) {
                count++
            }
        }
        if( count !== 1 ) {
            bot.sendMessage(config.self_tgID, 'something happened, count: ' + count)
            clearInterval(intervalId)
        }
    })
}, 1000)

bot.sendMessage(config.self_tgID, 'I\'m running now.')

bot.on('message', msg => {
    if( msg.from.id != config.self_tgID ) return
    if( msg.text === 'stop' ) {
        clearInterval(intervalId)
        bot.sendMessage(msg.from.id, 'Ok.')
    }
    else bot.sendMessage(msg.from.id, 'What?')
})
