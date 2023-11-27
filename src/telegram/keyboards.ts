import { KeyboardButton } from "node-telegram-bot-api"


const keyStart: KeyboardButton = {
    text: 'Empezar'
}

const keyStop: KeyboardButton = {
    text: 'Finalizar'
}

const keyWorkTimeTotal: KeyboardButton = {
    text: 'Total de horas'
}


export { keyStart, keyStop, keyWorkTimeTotal }
