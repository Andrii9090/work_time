import { InlineKeyboardMarkup, ReplyKeyboardMarkup } from "node-telegram-bot-api";

interface IReturnHandler {
    pk?: number
    text: string
    keys?: InlineKeyboardMarkup | ReplyKeyboardMarkup
}

export { IReturnHandler }
