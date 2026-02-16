import "dotenv/config";
import { Bot } from "grammy";
import { initErrorObserver } from "./modules/error";
import { censorBot } from "./modules/censorBot";
import { reactions } from "./modules/reactions";

export const bot = new Bot(`${process.env.TG_TOKEN}`);

censorBot();
// reactions(bot);
initErrorObserver(bot);

bot.start({
  allowed_updates: [
    "message",
    "message_reaction",
    "message_reaction_count",
    "edited_message",
    "callback_query",
    "chat_member",
  ],
});
