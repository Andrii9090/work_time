type converType = 'horas' | 'days' | 'minuts'

const converToLocalDate = (date: Date) => {
    const dateTime = date.toLocaleString(process.env.LOCALE, { timeZone: process.env.TIME_ZONE })
    return {
        date: dateTime.split(',')[0].trim(),
        time: dateTime.split(',')[1].trim()
    }
}

const getTimeTotal = (start: number, finish: number) => {
    return finish - start
}

const convertMiliseconds = (diff: number, type: converType) => {
    const seconds = diff / 1000
}

export { converToLocalDate, getTimeTotal }