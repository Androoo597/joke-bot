import "dotenv/config";
import { Bot, Context } from "grammy";
import { initErrorObserver } from "./modules/error";
import { hydrate, HydrateFlavor } from "@grammyjs/hydrate";
import { initCensorBot } from "./modules/censorBot";

export type MyContext = HydrateFlavor<Context>;

const bot = new Bot<MyContext>(`${process.env.TG_TOKEN}`);
bot.use(hydrate());

initCensorBot();
initErrorObserver();

bot.start({
  allowed_updates: [
    "message",
    "message_reaction",
    "message_reaction_count",
    "callback_query",
    "chat_member",
  ],
});

export { bot };
