import WorkTimeModel from "../db/models/workTime.model"

const parseCallbackData = (data: string) => {
    return data.split('_')
}

const getStartedWorkDay = async (userId: number) => {
    return await WorkTimeModel.findOne({
        where: {
            userId: userId,
            finish: null
        }
    })
}

const getWorkDayByPk = async (pk: string) => {
    return await WorkTimeModel.findByPk(pk)
}

export { parseCallbackData, getStartedWorkDay, getWorkDayByPk }