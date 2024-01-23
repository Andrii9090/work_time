import { workTime } from "@prisma/client";
import { converToLocalDate, getHoursTotal, getTimeDiff } from "./date.helper";

const formatDateObj = async (data: workTime[]) => {
    const arrObj = []
    let totalAll = 0
    data.forEach((item) => {
        const dateLocalStart = converToLocalDate(new Date(Number(item.start)))
        const dateLocalEnd = converToLocalDate(new Date(Number(item.finish)))
        totalAll += (Number(item.finish) - Number(item.start))
        arrObj.push({
            date: dateLocalStart.date,
            startTime: dateLocalStart.time,
            endTime: dateLocalEnd.time,
            total: getHoursTotal(getTimeDiff(Number(item.start), Number(item.finish)))
        })
    })
    arrObj.push(totalAll)
    return arrObj
}


export {
    formatDateObj
}