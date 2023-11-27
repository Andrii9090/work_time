import { BOT_TOKEN } from '../config'
import TelegramBot from "node-telegram-bot-api"
import { StateRepository } from '../state'

if (!BOT_TOKEN) {
    throw new Error('Bot token is not set')
}

const stateRepository = new StateRepository()
const bot = new TelegramBot(BOT_TOKEN)
bot.setMyCommands([{ command: '/start', description: 'Start command' }])

export { bot, stateRepository }