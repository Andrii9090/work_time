import { config } from 'dotenv'
config()

export const BOT_TOKEN = process.env.BOT_TOKEN || ''
export const LOCALE = process.env.LOCALE || 'es-ES'
export const TIME_ZONE = process.env.TIME_ZONE || 'Europe/Madrid'

