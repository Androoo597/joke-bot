import "dotenv/config";
import { Bot, InlineKeyboard } from "grammy";
import { keyboardMsg } from "./modules/keyboard";
import { parserReg } from "./modules/parserReg";
import { reactions } from "./modules/reactions";
import { msgEdit } from "./modules/msgEdit";
import { initErrorObserver } from "./modules/error";
import { menuBot } from "./modules/menu";

const bot = new Bot(`${process.env.TG_TOKEN}`);

bot.command("start", (ctx) =>
  ctx.reply("Добро пожаловать. Запущен и работает!")
);

keyboardMsg(bot);
parserReg(bot);
reactions(bot);
msgEdit(bot);
menuBot(bot);
initErrorObserver(bot);

// Запустите бота.
bot.start({
  allowed_updates: [
    "message",
    "message_reaction",
    "message_reaction_count",
    "edited_message",
    "callback_query",
  ],
});
