import { BOT_TOKEN } from '../config'
import TelegramBot from "node-telegram-bot-api"
import { StateRepository } from '../state'

if (!BOT_TOKEN) {
    throw new Error('Bot token is not set')
}

const stateRepository = new StateRepository()
const bot = new TelegramBot(BOT_TOKEN)
bot.setMyCommands([
    { command: '/start', description: 'Start command' },
    { command: '/mis_horas', description: 'Get statistics' }
]).then((val) => {
    console.log(val);
})
bot.getMyCommands().then((cmd) => {
    console.log(cmd)
})
export { bot, stateRepository }