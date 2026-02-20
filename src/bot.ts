import "dotenv/config";
import { Bot, Context } from "grammy";
import { initErrorObserver } from "./modules/error";
import { censorBot } from "./modules/censorBot";
import { hydrate, HydrateFlavor } from "@grammyjs/hydrate";
import { reactions } from "./modules/reactions";

export type MyContext = HydrateFlavor<Context>;

const bot = new Bot<MyContext>(`${process.env.TG_TOKEN}`);
bot.use(hydrate());

censorBot();
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
