import { Api, Bot, Context, InlineKeyboard, RawApi } from "grammy";
import { myReg } from "../utils/constants";
import { trySqlRequest } from "../db/methods";

const inlineKeyboard = new InlineKeyboard()
  .text("Добавить слово", "addWord")
  .text("Удалить слово", "delWord")
  .text("Показать слова", "alertWords")
  .row()
  .text("Таблица", "result")
  .text("Моя статистика", "ownStatistic");

let inputMode = "";

const getWords = () => {
  const allWords = trySqlRequest("words", "getAllWords", "all");
  if (Array.isArray(allWords)) {
    const stringWords = allWords
      ?.map((item) => item.word?.split(myReg.addWord))
      .flat(1);
    return stringWords;
  }
  return [];
};

export const censorBot = (bot: Bot<Context, Api<RawApi>>) => {
  bot.command("start", async (ctx) => {
    await bot.api.sendMessage(
      ctx.chatId,
      "Добрый день! Вас приветсвует Цензор бот.\nВы можете добавлять слова для подсчета статистики использования нецензурных слов из сообщений в чате.\n \nЧтобы вызвать Меню используйте команду /menu \n \nЧтобы вызвать Справку используйте команду /help",
      { parse_mode: "HTML" }
    );
    await ctx.reply("Главное меню комманд", {
      reply_markup: inlineKeyboard,
    });
  });

  bot.command("help", async (ctx) => {
    await bot.api.sendMessage(ctx.chatId, "Помощь");
    await bot.api.sendMessage(
      ctx.chatId,
      'Используйте кнопку: "Добавить слово", чтобы добавить слова для отслеживания\n\nВы можете добавить как одно слово, так и несколько через запятую\n\nИспользуйте кнопку: "Удалить слово", чтобы удалить слова для отслеживания\n\nВы можете удалить как одно слово, так и несколько через запятую',
      { parse_mode: "HTML" }
    );
  });

  bot.command("menu", async (ctx) => {
    await ctx.reply("Держи клаву", {
      reply_markup: inlineKeyboard,
    });
  });

  bot.callbackQuery("addWord", async (ctx) => {
    await ctx.reply("Введите новое слово в строке ниже");
    inputMode = "add";
  });

  bot.callbackQuery("delWord", async (ctx) => {
    await ctx.reply("Введите удаляемое слово в строке ниже");
    inputMode = "del";
  });

  bot.callbackQuery("result", async (ctx) => {
    await ctx.answerCallbackQuery();
  });

  bot.callbackQuery("ownStatistic", async (ctx) => {
    await ctx.answerCallbackQuery({
      text: "You were curious, indeed!",
    });
  });

  bot.on("message:text", async (ctx) => {
    const message = ctx.update.message.text;

    switch (inputMode) {
      case "add":
        trySqlRequest("words", "insertWord", "run", [
          message.replace(myReg.addWord, "|"),
        ]);
        inputMode = "";
        // console.log(trySqlRequest("words", "getAllWords", "all"));
        ctx.reply(`Слово: "${ctx.update.message.text}" успешно добавлено`);
        break;
      case "del":
        trySqlRequest("words", "delByWord", "run", [message]);
        inputMode = "";
        ctx.reply(`Слово: "${ctx.update.message.text}" успешно удалено`);
        break;
      default:
        const ererve = getWords();
        const res = message.match(myReg.censorWords(ererve));

        if (res) {
          ctx.reply(`Ваше выражение: "${res?.[0]}" дабавлено в статистику!`);
          trySqlRequest("data", "insert", "run", [
            ctx.from?.username || "",
            res?.[0],
          ]);
        }
        break;
    }
  });

  bot.callbackQuery("alertWords", async (ctx) => {
    const allWords = getWords();
    await ctx.reply(
      allWords.length ? allWords.join("\n") : "Нет добавленных слов"
    );
  });
};
