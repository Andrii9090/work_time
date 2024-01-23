import { config } from "dotenv";
import bot from "./telegram/bot.listeners";

config()

bot.startPolling({ polling: true })