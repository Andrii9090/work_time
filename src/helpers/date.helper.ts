type converType = 'horas' | 'days' | 'minuts'


const SECONDS_FOR_MINUTS = 60
const MINUTS_FOR_HOUR = 60

const converToLocalDate = (date: Date) => {
    const dateTime = date.toLocaleString(process.env.LOCALE, { timeZone: process.env.TIME_ZONE })
    const dateTimeArr = dateTime.split(',')
    let time = dateTimeArr[1].trim()
    if (+time < 10) {
        time = `0${time}`
    }
    return {
        date: dateTimeArr[0].trim(),
        time: time
    }
}

const getTimeDiff = (start: number, finish: number) => {
    return finish - start
}

const getHoursTotal = (miliseconds: number) => {
    const timeOdj = new Date(miliseconds).toISOString().match(/\d\d:\d\d:\d\d/)
    if (timeOdj)
        return timeOdj[0]
}

const dateParser = (dateStr: string) => {
    const dateArr = dateStr.split('-')
    return {
        start: dateArr[0].split('/'),
        end: dateArr[1].split('/')
    }
}

export { converToLocalDate, getHoursTotal, dateParser, getTimeDiff }