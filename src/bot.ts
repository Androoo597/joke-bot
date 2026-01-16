import "dotenv/config";
import { Bot } from "grammy";
import { keyboardMsg } from "./modules/keyboard";
import { parserReg } from "./modules/parserReg";
import { reactions } from "./modules/reactions";
import { msgEdit } from "./modules/msgEdit";
import { initErrorObserver } from "./modules/error";
import { menuBot } from "./modules/menu";
import { delById, insert, getAll, getByKey, tryDbMethod } from "./db/methods";

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

// delById.run(1);
// delById.run(2);
// insert.run(1, "hello");
// insert.run(2, "world");
console.log(tryDbMethod("questions", getAll)?.all());
console.log(tryDbMethod("questions", getByKey)?.all(1));

bot.start({
  allowed_updates: [
    "message",
    "message_reaction",
    "message_reaction_count",
    "edited_message",
    "callback_query",
  ],
});
