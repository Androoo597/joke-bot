import "dotenv/config";
import { Bot } from "grammy";
import { keyboardMsg } from "./modules/keyboard";
import { parserReg } from "./modules/parserReg";
import { reactions } from "./modules/reactions";
import { msgEdit } from "./modules/msgEdit";
import { initErrorObserver } from "./modules/error";
import { menuBot } from "./modules/menu";
import { insert, query } from "./db/methods";

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

// Execute the prepared statement with bound values.
// insert.run(1, "hello");
// insert.run(2, "world");
// Create a prepared statement to read data from the database.
// Execute the prepared statement and log the result set.
console.log(query.all());
// Prints: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]

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
