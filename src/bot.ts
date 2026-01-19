import "dotenv/config";
import { Bot } from "grammy";
import { keyboardMsg } from "./modules/keyboard";
import { parserReg } from "./modules/parserReg";
import { reactions } from "./modules/reactions";
import { msgEdit } from "./modules/msgEdit";
import { initErrorObserver } from "./modules/error";
import { menuBot } from "./modules/menu";
import { trySqlRequest } from "./db/methods";
import { censorBot } from "./modules/censorBot";

const bot = new Bot(`${process.env.TG_TOKEN}`);

// bot.command("start", (ctx) =>
//   ctx.reply("Добро пожаловать. Запущен и работает!")
// );

// keyboardMsg(bot);
censorBot(bot);
// parserReg(bot);
// reactions(bot);
// msgEdit(bot);
// menuBot(bot);
initErrorObserver(bot);

// trySqlRequest("data", "insert", "run", ["value1", "value2"]);
// trySqlRequest("data", "delById", "run", [1]);
console.log(trySqlRequest("data", "getAll", "all"));
console.log(trySqlRequest("words", "getAllWords", "all"));

bot.start({
  allowed_updates: [
    "message",
    "message_reaction",
    "message_reaction_count",
    "edited_message",
    "callback_query",
  ],
});
