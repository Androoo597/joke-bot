import "dotenv/config";
import { Bot, GrammyError, HttpError } from "grammy";
// import { EmojiFlavor, emojiParser } from "@grammyjs/emoji";

// type MyContext = EmojiFlavor<Context>;
// Создайте экземпляр класса `Bot` и передайте ему токен вашего бота.
// const bot = new Bot<MyContext>(`${process.env.TG_TOKEN}`); // <-- поместите токен вашего бота между "".
const bot = new Bot(`${process.env.TG_TOKEN}`); // <-- поместите токен вашего бота между "".

// bot.use(emojiParser());
// Теперь вы можете зарегистрировать слушателей на объекте вашего бота `bot`.
// grammY будет вызывать слушателей, когда пользователи будут отправлять сообщения вашему боту.

// Обработайте команду /start.
bot.command("start", (ctx) =>
  ctx.reply("Добро пожаловать. Запущен и работает!")
);

bot.start({
  allowed_updates: [
    "message",
    "message_reaction",
    "message_reaction_count",
    "edited_message",
  ],
});

// bot.command("delete_all", (ctx) => {
//   ctx.reply("Ты хочешь вот так вот забыть все что между нами было?");
//   ctx.deleteMessages([1, 2]);
// });

// bot.on("message", (ctx) => ctx.react(Reactions.thumbs_up));
// Обработайте другие сообщения.

const testReg = /ты\s([а-яА-Я\w]+)/im;

bot.hears(testReg, async (ctx) => {
  ctx.reply(`Нет ты ${ctx.match[1]}`);
});

// bot.on("message", async (ctx) => {
//   ctx.reply("Получил другое сообщение!");

//   await bot.api.sendMessage(
//     ctx.from.id,
//     '<b>Привет!</b> <i>Добро пожаловать</i> в <a href="https://grammy.dev">grammY</a>.',
//     { parse_mode: "HTML" }
//   );
// });
// фильтр на редактирование сообщения текстового
bot.on(
  "edit:text",
  async (ctx) =>
    await ctx.reply(
      "Зачем радактируешь сообщение, редиска? " + `@${ctx.from?.username}`,
      {
        reply_parameters: { message_id: ctx.msgId },
      }
    )
);

bot.reaction("💩", (ctx) => {
  ctx.reply(`Да сам ты говно @${ctx.from?.username}!!!`, {
    reply_parameters: { message_id: ctx.msgId },
  });
});

// bot.reaction("🙏", (ctx) => {
//   ctx.update.message_reaction.old_reaction;
// });

bot.on("message_reaction", async (ctx) => {
  const { emojiRemoved } = ctx.reactions();
  if (emojiRemoved.includes("💩")) {
    await ctx.reply(`Ладно, я прощаю тебя @${ctx.from?.username}!!!`, {
      reply_parameters: { message_id: ctx.msgId },
    });
  }
});

const initErrorObserver = () => {
  //============================================================
  // Обработка ошибок
  //============================================================

  bot.catch(async (err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;

    if (ctx && ctx.reply) {
      try {
        await ctx.reply("Извините, произошла ошибка. Попробуйте позже.");
      } catch (replyError) {
        console.error("Не удалось отправить сообщение об ошибке:", replyError);
      }
    }

    if (e instanceof GrammyError) {
      console.error("Ошибка в запросе:", e.description);
    } else if (e instanceof HttpError) {
      console.error("Не удалось связаться с Telegram:", e);
    } else {
      console.error("Неизвестная ошибка:", e);
    }
  });
};

initErrorObserver();

// Запустите бота.
bot.start();
