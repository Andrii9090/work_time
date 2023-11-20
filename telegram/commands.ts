import { Context } from "telegraf"
import { keyStart, keyStop, keyWorkTimeTotal } from "./keyboards"

const commandStart = (ctx: Context) => {
    ctx.reply("Hola, voy a ayudarte contar tus horas de trabajo", {
        reply_markup: {
            keyboard: [
                [keyStart, keyStop],
                [keyWorkTimeTotal]
            ]
        }
    })
}

export { commandStart }