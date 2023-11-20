import { converToLocalDate, getTimeTotal } from "../helpers/date.helper"
import { WorkTimeModel } from "../db/models/workTime.model"
import { InlineKeyboardMarkup, ReplyKeyboardMarkup } from "telegraf/types"

interface IReturnHandler {
    text: string
    keys?: InlineKeyboardMarkup | ReplyKeyboardMarkup
}

const recordStartWork = async (userId: number): Promise<IReturnHandler> => {
    const now = new Date()
    const { date, time } = converToLocalDate(now)

    WorkTimeModel.create({
        userId: userId,
        date: date,
        start: now.getTime(),
    })
    return {
        text: `Has empezado ${date} ${time}`,
    }
}

const recordFinishWork = async (userId: number): Promise<IReturnHandler> => {
    const now = new Date()

    const { date, time } = converToLocalDate(now)

    const workday = await WorkTimeModel.findOne({
        where: {
            userId: userId,
            finish: null
        }
    })
    if (workday) {
        workday.setDataValue('finish', now.getTime())
        workday.save()
        return {
            text: `Has terminado ${date} ${time}.`,
            keys: {
                inline_keyboard: [[{
                    text: 'Con comida',
                    callback_data: 'dinner'
                },
                {
                    text: 'Con bocata',
                    callback_data: 'sendwizch'
                },], [
                    {
                        text: 'Añadir commentario',
                        callback_data: 'add_comment'
                    }
                ]]
            }
        }
    }
    return {
        text: 'No hay cronometro en la marcha'
    }

}

export { recordFinishWork, recordStartWork }