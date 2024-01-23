import { callbackDataHandler, saveCommentHandler, allMsgHandler, getStatistics, commandStart } from './handlers'
import { parseCallbackData } from './helpers'
import { State } from '../state'
import { bot, stateRepository } from './bot'
import constants from './constants'
import { Message } from 'node-telegram-bot-api'

bot.setMyCommands([
    {
        command: 'start',
        description: 'Init the bot'
    },
    {
        command: 'get_stat',
        description: 'Get document with statistic'
    }
])
    .catch((e) => {
        console.log(e);
    })

bot.onText(/\/start/, (msg) => {
    commandStart(msg)
})

bot.onText(/\/get_stat/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Mandame un periodo en siguiente formato, ej. <b><i>01/01/2023-31/12/2023</i></b>',
        { parse_mode: "HTML" })
        .then((msgNew) => {
            const state = new State(constants.STAT_EVENT, { msgId: msgNew.message_id })
            stateRepository.setState(msg.chat.id, state)
        })
})

bot.on('message', async (msg) => {
    allMsgHandler(msg)
})

bot.on(constants.COMMENT_EVENT, async (msg: Message, chatId: number, text: string, data: State) => {
    saveCommentHandler(msg, chatId, data.pk, text)
})

bot.on(constants.STAT_EVENT, async (msg: Message) => {
    getStatistics(msg)
})

bot.on('callback_query', async (msg) => {
    if (msg.data) {
        const [dataName, pk] = parseCallbackData(msg.data)
        callbackDataHandler(msg.from.id, dataName, pk, msg)
    } else {
        bot.sendMessage(msg.from.id, 'Algo ha pasado! No puedo procesar tu solicitud😞')
    }
})

export default bot