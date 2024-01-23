import { CallbackQuery, Message } from "node-telegram-bot-api"
import { converToLocalDate, dateParser, getHoursTotal, getTimeDiff } from "../helpers/date.helper"
import { State } from "../state"
import { bot, stateRepository } from "./bot"
import { getInlineKey, getInlineKeyboardOptions, keyStart } from "./keyboards"
import logger from "../logger"
import { addFinishTime, createWorkDay, getStartedWorkDay, getWorkDayByPk, getWorkDays, updateWorkDay } from "../helpers/db.helper"
import constants from "./constants"
import dbClient from "../db"
import { formatDateObj } from "../helpers/statistic.helper"

const commandStart = (msg: Message) => {
    dbClient.user.findFirstOrThrow({
        where: {
            userId: msg.chat.id
        }
    })
        .then(() => {
            bot.sendMessage(msg.chat.id, "Hola, voy a ayudarte contar tus horas de trabajo", { parse_mode: 'HTML', reply_markup: { keyboard: [[keyStart]] } })
        })
        .catch((e) => {
            dbClient.user.create({
                data: {
                    userId: msg.chat.id,
                    name: msg.from?.first_name ? msg.from?.first_name : ''
                }
            })
                .then(() => {
                    bot.sendMessage(msg.chat.id, "Hola, voy a ayudarte contar tus horas de trabajo", { parse_mode: 'HTML', reply_markup: { keyboard: [[keyStart]] } })
                })
                .catch((e) => {
                    logger.error(e)
                    bot.sendMessage(msg.chat.id, 'No puedo guardar tus datos! Intenta de nuevo!')
                })
        })
}

const allMsgHandler = async (msg: Message) => {
    switch (msg.text) {
        case 'Empezar':
            await recordStartWork(msg.chat.id, msg.date)
            break
        default:
            if (!msg.text?.startsWith('/')) {
                stateRepository.getState(msg.chat.id)
                    .then((state) => {
                        logger.debug(`State ${state}`)
                        if (state) {
                            const userState = JSON.parse(state)
                            bot.emit(userState.name, msg, msg.chat.id, msg.text, userState.data)
                        }
                    })
            }
            break
    }
}

const recordStartWork = async (userId: number, timestamp: number) => {
    const workDay = await getStartedWorkDay(userId)
    if (workDay) {
        bot.sendMessage(userId, 'Hay un cronomentro en marcha!')
        return
    }
    await stateRepository.removeState(userId)
    const now = new Date(timestamp * 1000)

    const { time } = converToLocalDate(now)
    createWorkDay(userId, now.getTime())
        .then((item) => {
            bot.sendMessage(userId, `Has empezado ${time}`, {
                parse_mode: 'HTML', reply_markup: {
                    inline_keyboard: [[getInlineKey('Finalizar', 'finish_' + item.id)]]
                }
            }).then((msg) => {
                updateWorkDay(item.id, {
                    messageId: msg.message_id
                })
            })
        })
        .catch(e => {
            logger.fatal(e)
            bot.sendMessage(userId, 'Halgo ha pasado raro')
        })
}

const recordFinishWork = async (userId: number, timestamp: number) => {
    const workday = await getStartedWorkDay(userId)

    const now = new Date(timestamp)
    if (workday) {
        addFinishTime(workday.id, now.getTime())
            .then((item) => {
                const startDateTime = converToLocalDate(new Date(Number(item.start)))
                const finishDateTime = converToLocalDate(new Date(Number(item.finish)))
                const totalHoras = getHoursTotal(getTimeDiff(Number(item.start), Number(item.finish)))
                bot.editMessageText(`Tu horario de hoy ${startDateTime.time} - ${finishDateTime.time}. \n <b>En total ${totalHoras}</b> \nPuedes elegir las opciónes:`, {
                    chat_id: userId,
                    message_id: Number(workday.messageId),
                    reply_markup: getInlineKeyboardOptions(workday.id),
                    parse_mode: "HTML"
                })
            })
            .catch((e) => {
                logger.fatal(e)
            })
    }
}

const dinnerHandler = async (hours: number, userId: number, pk: string, msg: CallbackQuery) => {
    const workDay = await getWorkDayByPk(Number(pk))
    if (workDay) {
        updateWorkDay(Number(pk), {
            dinnerHour: hours
        })
            .then((item) => {
                bot.answerCallbackQuery(msg.id, { text: 'Guardado👍' })
            })
            .catch((e) => {
                logger.error(e)
            })
    }
}

const startComment = async (userId: number, pk: number) => {
    const currentState = new State(constants.COMMENT_EVENT, { pk })
    await stateRepository.setState(userId, currentState)
    const workDay = await getWorkDayByPk(pk)
    if (workDay) {
        bot.editMessageText('<b>Escribe comentario</b>', {
            parse_mode: "HTML",
            message_id: workDay.messageId ? workDay.messageId : undefined,
            chat_id: userId,
        })
    }
}

const saveCommentHandler = async (msg: Message, userId: number, pk: string, text: string) => {
    const workDay = await getWorkDayByPk(Number(pk))
    if (workDay) {
        updateWorkDay(Number(pk), {
            comment: text
        })
            .then(() => {
                bot.deleteMessage(userId, msg.message_id).then(() => {
                    bot.editMessageText('Tu comentario guardado!\n\n<b>Puedes elegir una opción:</b>', {
                        message_id: workDay.messageId ? workDay.messageId : undefined,
                        chat_id: userId,
                        parse_mode: "HTML",
                        reply_markup: getInlineKeyboardOptions(workDay.id, false)
                    })
                        .then(() => stateRepository.removeState(userId))
                })
                    .catch((e) => {
                        logger.error(e)
                    })
            })
    }
}

const festiveHandler = async (userId: number, pk: string, msg: CallbackQuery) => {
    const workDay = await getWorkDayByPk(Number(pk))
    if (workDay) {
        updateWorkDay(Number(pk), {
            isFestive: true
        })
            .then(() => {
                bot.answerCallbackQuery(msg.id, { text: 'Guardado!' })
            }).catch((e) => {
                logger.error(e)
            })
    }
}

const callbackDataHandler = async (userId: number, dataName: string, pk: string, msg: CallbackQuery) => {
    switch (dataName) {
        case 'dinner':
            dinnerHandler(1, userId, pk, msg)
            break;
        case 'sandwich':
            dinnerHandler(0.5, userId, pk, msg)
            break;
        case 'festive':
            festiveHandler(userId, pk, msg)
            break;
        case 'finish':
            recordFinishWork(userId, msg.message?.forward_date ? msg.message.forward_date : new Date().getTime())
            break;
        case 'comment':
            startComment(userId, Number(pk))
            break;
    }
}

const getStatistics = async (msg: Message) => {
    if (msg.text) {
        stateRepository.getState(msg.chat.id).then((state) => {
            if (state) {
                let dataState = JSON.parse(state)
                const messageId = dataState.data.msgId
                bot.editMessageText('Espera un momento...Estoy trabajando...', {
                    chat_id: msg.chat.id,
                    message_id: messageId,
                })
                return messageId
            }
        })
            .then((messageId) => {
                console.log(messageId);

                if (msg.text) {
                    const { start, end } = dateParser(msg.text)
                    const dateStart = new Date(`${start[2]}-${start[1]}-${start[0]}T00:00:00`)
                    const dateEnd = new Date(`${end[2]}-${end[1]}-${end[0]}T00:00:00`)

                    getWorkDays(dateStart.getTime(), dateEnd.getTime())
                        .then((workDays) => {
                            formatDateObj(workDays).then((obj) => {
                                const timeStr = getHoursTotal(obj[obj.length - 1])
                                console.log(timeStr);
                                bot.sendMessage(msg.chat.id, `Tus horas ${timeStr}`)
                            })
                            stateRepository.removeState(msg.chat.id)
                        })
                }
            })
    } else {
        bot.sendMessage(msg.chat.id, 'Mandame un periodo en siguiente formato, ej. <b><i>01/01/2023-31/12/2023</i></b>',
            { parse_mode: 'HTML' })
    }
}

export {
    callbackDataHandler,
    saveCommentHandler,
    allMsgHandler,
    getStatistics,
    commandStart
}