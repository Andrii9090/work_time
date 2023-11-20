import { Telegraf } from "telegraf"
import { message } from 'telegraf/filters'
import { commandStart } from "./commands"
import { recordFinishWork, recordStartWork } from "./handlers"
import { BOT_TOKEN } from '../config'



if (!BOT_TOKEN) {
    throw new Error('Bot token is not set')
}

const bot = new Telegraf(BOT_TOKEN)

bot.start(ctx => commandStart(ctx))


bot.on(message('text'), async (ctx) => {
    switch (ctx.message.text.toLowerCase()) {
        case 'empezar':
            await recordStartWork(ctx.from.id).then((reply) => {
                ctx.reply(reply.text, { parse_mode: 'HTML', reply_markup: reply.keys })
            })
            break;
        case 'finalizar':
            await recordFinishWork(ctx.from.id).then((reply) => {
                ctx.reply(reply.text, { parse_mode: 'HTML', reply_markup: reply.keys })
            })
            break;
        case 'total de horas':
            getTotalTime(ctx.from.id)
            break;
    }
})

export default bot

function getTotalTime(id: number) {
    throw new Error("Function not implemented.")
}
