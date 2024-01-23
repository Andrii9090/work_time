import dbClient from "../db"

const parseCallbackData = (data: string) => {
    return data.split('_')
}


export { parseCallbackData, }