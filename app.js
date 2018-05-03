const config = require('./config.json')
const request = require('request')
const cheerio = require('cheerio')

const tgbotapi = require('node-telegram-bot-api')

const bot = new tgbotapi(config.token, {
    polling: true
})

let count = 0
var intervalId = setInterval(() => {
    let url = 'http://toi.csie.ntnu.edu.tw/'
    request.get(url, (err, res, body) => {
        let $ = cheerio.load(body, {decodeEntities: false})
        if( $('li').eq(6).text().indexOf('2018-04-09') === '-1' ) {
            let msg = 'something happened.\n'
            msg += $('li').eq(6).text().replace(/[\n\r]/g, '') + '\n'
            msg += 'http://toi.csie.ntnu.edu.tw/' + $('li').eq(6).find('a').attr('href') + '\n'
            msg += $('li').eq(7).text().replace(/[\n\r]/g, '') + '\n'
            msg += 'http://toi.csie.ntnu.edu.tw/' + $('li').eq(7).find('a').attr('href') + '\n'

            console.log(msg)
            bot.sendMessage(config.self_tgID, msg)
            clearInterval(intervalId)
        }
        count++
        if( count % 3600 === 0 ) {
            bot.sendMessage(config.self_tgID, 'nothing happend.')
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
