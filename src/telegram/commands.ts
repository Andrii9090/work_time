import { Message } from "node-telegram-bot-api"
import { keyStart, keyStop, keyWorkTimeTotal } from "./keyboards"
import { IReturnHandler } from './contracts'

const commandStart = (msg: Message): IReturnHandler => {
    return {
        text: "Hola, voy a ayudarte contar tus horas de trabajo",
        keys: {
            keyboard: [
                [keyStart, keyStop],
            ]
        }
    }
}

export { commandStart }