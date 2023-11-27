import WorkTimeModel from "../db/models/workTime.model"
import { converToLocalDate } from "../helpers/date.helper"
import { IReturnHandler } from "./contracts"
import { getStartedWorkDay, getWorkDayByPk } from "./helpers"

const recordStartWork = async (userId: number): Promise<IReturnHandler> => {
    const workDay = await getStartedWorkDay(userId)
    if (workDay) {
        return {
            text: 'Hay un cronomentro en marcha!',
        }
    }
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

const recordFinishWork = async (userId: number | undefined): Promise<IReturnHandler> => {
    if (!userId) {
        return { text: 'Algo ha pasado. No puedo guardar los datos!' }
    }

    const now = new Date()
    const { date, time } = converToLocalDate(now)
    const workday = await getStartedWorkDay(userId)

    if (workday) {
        workday.setDataValue('finish', now.getTime())
        const dbItem = await workday.save()

        return {
            pk: workday.dataValues.id,
            text: `Has terminado ${date} ${time}.`,
            keys: {
                inline_keyboard: [[{
                    text: 'Con comida',
                    callback_data: 'dinner_' + dbItem.dataValues.id
                },
                {
                    text: 'Con bocata',
                    callback_data: 'sandwich_' + dbItem.dataValues.id
                },], [
                    {
                        text: 'Festivo',
                        callback_data: 'festive_' + dbItem.dataValues.id
                    },], [
                ]]
            }
        }
    }

    return {
        text: 'No hay cronometro de hoy!'
    }
}

const dinnerHandler = async (hours: number, userId: number | undefined, pk: string) => {
    const workDay = await getWorkDayByPk(pk)
    if (userId === workDay?.dataValues.userId) {
        workDay?.setDataValue('dinner', hours)
        workDay?.save()
        return true
    }

    return false
}

const saveCommentHandler = async (userId: number, pk: string, text: string): Promise<IReturnHandler> => {
    const workDay = await getWorkDayByPk(pk)
    if (workDay?.dataValues.userId == userId) {
        workDay.setDataValue('comment', text)
        workDay.save()
        return {
            text: 'Las horas guardadas.'
        }
    }

    return {
        text: 'Algo ha pasado raro! Intenta de nuevo!'
    }
}

const festiveHandler = async (userId: number, pk: string): Promise<boolean> => {
    return await getWorkDayByPk(pk).
        then((item) => {
            if (userId === item?.dataValues.userId) {
                item?.setDataValue('festive', true)
                item?.save()
                return true
            } else {
                throw new Error('Error! User not have permission!')
            }
        })
        .catch(err => false)
}

const callbackDataHandler = async (userId: number, dataName: string, pk: string) => {

    let reply: IReturnHandler = {
        text: 'Algo ha pasado, no puedo procesar tu solicitud!'
    }
    switch (dataName) {
        case 'dinner':
            if (await dinnerHandler(1, userId, pk)) {
                reply.text = 'Guardado!'
            }
            break;
        case 'sandwich':
            if (await dinnerHandler(0.5, userId, pk)) {
                reply.text = 'Guardado!'
            }
            break;
        case 'festive':
            if (await festiveHandler(userId, pk)) {
                reply.text = 'Guardado!'
            }
            break;
    }

    return reply
}

const messageHandler = async (userId: number, text: string | undefined): Promise<IReturnHandler> => {
    return {
        text: 'No entiendo!'
    }
}

export { recordFinishWork, recordStartWork, callbackDataHandler, messageHandler, saveCommentHandler }