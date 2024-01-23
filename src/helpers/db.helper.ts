import { userInfo } from "os"
import dbClient from "../db"
import logger from "../logger"
import { workTime } from "@prisma/client"

const getStartedWorkDay = async (userId: number) => {
    return await dbClient.workTime.findFirst({
        where: {
            userId: userId,
            finish: 0
        }
    })
}

const getWorkDayByPk = async (pk: number) => {
    return await dbClient.workTime.findUnique({
        where: {
            id: pk
        }
    })
}
const addFinishTime = async (id: number, timestamp: number) => {
    return dbClient.workTime.update({
        data: {
            finish: timestamp
        },
        where: {
            id
        }
    })
}

const createWorkDay = async (userId: number, timestamp: number) => {
    return dbClient.workTime.create({
        data: {
            userId,
            start: timestamp,
        }
    })
}

const updateWorkDay = async (id: number, data: object) => {
    return dbClient.workTime.update({
        data: data,
        where: {
            id: id
        }
    })
}

const getWorkDays = async (dateStart: number, dateFinish: number) => {
    return await dbClient.workTime.findMany({
        where: {
            AND: {
                start: {
                    gte: dateStart,
                    lte: dateFinish
                }
            }
        }
    })
}

export {
    addFinishTime,
    createWorkDay,
    getStartedWorkDay,
    getWorkDayByPk,
    updateWorkDay,
    getWorkDays
}