import { InlineKeyboardButton, KeyboardButton } from "node-telegram-bot-api"


const keyStart: KeyboardButton = {
    text: 'Empezar'
}

const keyStop: InlineKeyboardButton = {
    text: 'Finalizar'
}

const getInlineKey = (text: string, callback_data: string): InlineKeyboardButton => {
    return {
        text,
        callback_data
    }
}



const getInlineKeyboardOptions = (pk: number, withComment = true) => {
    if (!withComment) {
        return {
            inline_keyboard: [
                [
                    getInlineKey('Comida', 'dinner_' + pk),
                    getInlineKey('Bocata', 'sandwich_' + pk),
                    getInlineKey('Festivo', 'festive_' + pk)
                ]
            ]
        }
    }
    return {
        inline_keyboard: [
            [
                getInlineKey('Comida', 'dinner_' + pk),
                getInlineKey('Bocata', 'sandwich_' + pk),
                getInlineKey('Festivo', 'festive_' + pk)
            ],
            [
                getInlineKey('Añadir commentario (tareas de hoy)', 'comment_' + pk)
            ]
        ]
    }
}



export { keyStart, keyStop, getInlineKey, getInlineKeyboardOptions }
