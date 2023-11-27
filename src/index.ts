import { config } from "dotenv";
import bot from "./telegram/bot.listeners";

bot.startPolling({ polling: true })