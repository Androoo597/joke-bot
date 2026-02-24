import "dotenv/config";
import { Bot, Context } from "grammy";
import { initErrorObserver } from "./modules/error";
import { hydrate, HydrateFlavor } from "@grammyjs/hydrate";
import { reactions } from "./modules/reactions";
import { initCensorBot } from "./modules/censorBot";
import * as cron from "cron";
import { everyFriday } from "./utils/constants";

export type MyContext = HydrateFlavor<Context>;

const bot = new Bot<MyContext>(`${process.env.TG_TOKEN}`);
bot.use(hydrate());

// cron.sendAt(everyFriday).toISO();
console.log("everyFriday==> ", cron.sendAt(everyFriday).toISO());
// console.log("everyMonday==> ", cron.sendAt(everyMonday).toISO());

initCensorBot();
// reactions(bot);
initErrorObserver();

bot.start({
  allowed_updates: [
    "message",
    "message_reaction",
    "message_reaction_count",
    // "edited_message",
    "callback_query",
    "chat_member",
  ],
});

export { bot };
