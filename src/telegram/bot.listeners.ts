import { commandStart } from './commands'
import { callbackDataHandler, recordFinishWork, recordStartWork, saveCommentHandler } from './handlers'
import { parseCallbackData } from './helpers'
import { State } from '../state'
import { bot, stateRepository } from './bot'

const COMMENT_EVENT = 'comment'

bot.onText(/\/start/, (msg) => {
    const reply = commandStart(msg)

    bot.sendMessage(msg.chat.id, reply.text, { reply_markup: reply.keys })
})

bot.on('message', async (msg) => {
    switch (msg.text) {
        case 'Empezar':
            console.log('send start work day');

            await stateRepository.removeState(msg.chat.id)
            await recordStartWork(msg.chat.id).
                then((reply) => {
                    bot.sendMessage(msg.chat.id, reply.text, { parse_mode: 'HTML', reply_markup: reply.keys })
                })
            break;
        case 'Finalizar':
            recordFinishWork(msg.from?.id).
                then((reply) => {
                    bot.sendMessage(msg.chat.id, reply.text, { parse_mode: 'HTML', reply_markup: reply.keys })
                    stateRepository.setState(msg.chat.id, new State(COMMENT_EVENT, { pk: reply.pk }))
                    return reply
                }).then((reply) => {
                    if (reply.pk)
                        bot.sendMessage(msg.chat.id, '<b>Escribeme porfavor tus tareas de hoy</b>', { parse_mode: 'HTML' })
                })
            break;
        default:
            if (!msg.text?.startsWith('/')) {
                const userState = await stateRepository.getState(msg.chat.id).
                    then((state) => { if (state) return JSON.parse(state) })
                if (userState) {
                    bot.emit(userState.name, msg.chat.id, msg.text, userState.data)
                    break
                } else {
                    bot.sendMessage(msg.chat.id, 'No te entiendo')
                }
            }
            break
    }
})

bot.on(COMMENT_EVENT, async (chatId: number, text: string, data: State) => {
    await saveCommentHandler(chatId, data.pk, text).
        then((reply) => {
            stateRepository.removeState(chatId)
            return reply
        }).
        then(reply => bot.sendMessage(chatId, reply.text))
})

bot.on('callback_query', async (msg) => {
    if (msg.data) {
        const [dataName, pk] = parseCallbackData(msg.data)
        const reply = await callbackDataHandler(msg.from?.id, dataName, pk)
        bot.sendMessage(msg.from.id, reply.text)
    } else {
        bot.sendMessage(msg.from.id, 'Algo ha pasado! No puedo procesar tu solicitud😞')
    }
})

export default bot