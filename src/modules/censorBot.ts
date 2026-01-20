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

const getAllWords = () => {
  const allWords = trySqlRequest("words", "getAllWords", "all");
  if (Array.isArray(allWords)) {
    const stringWords = allWords
      ?.map((item) => item.word?.split(myReg.addWord))
      .flat(1);
    return stringWords;
  }
  return [];
};

const updateWord = (word: string, message: string) => {
  const wwm = word.replace(myReg.updWord(message), "");
  console.log("wwm ==> ", wwm);
  const ecec = trySqlRequest("words", "updateWord", "run", [
    wwm,
    `%${message}%`,
  ]);
  console.log("ecec ==> ", ecec);
};

const deleteWord = (message: string) => {
  trySqlRequest("words", "delByWord", "run", [`%${message}%`]);
};

const getWord = (message: string): string => {
  return trySqlRequest("words", "selectByWord", "get", [`%${message}%`]).word;
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
      'кн. "Добавить слово", позволяет добавить как одно слово, так и несколько через запятую\n\nкн. "Удалить слово", позволяет удалить как одно слово, так и несколько слов через запятую',
      { parse_mode: "HTML" }
    );
  });

  bot.command("menu", async (ctx) => {
    await ctx.reply("Меню цензор бота", {
      reply_markup: inlineKeyboard,
    });
  });

  bot.command("resetAll", async (ctx) => {
    await ctx.reply(
      "Удаляет все данные статистики и все слова (но еще не готова)"
    );
  });

  bot.command("resetWords", async (ctx) => {
    await ctx.reply("Удаляет все слова из списка (но еще не готова)");
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
        ctx.reply(`Слово: "${ctx.update.message.text}" успешно добавлено`);
        break;
      case "del":
        const word = getWord(message);

        message.length !== word.length
          ? updateWord(word, message)
          : deleteWord(message);

        inputMode = "";
        ctx.reply(`Слово: "${ctx.update.message.text}" успешно удалено`);
        break;
      default:
        const regWords = getAllWords();
        const res = message.match(myReg.censorWords(regWords));

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
    const allWords = getAllWords();
    await ctx.reply(
      allWords.length ? allWords.join("\n") : "Нет добавленных слов"
    );
  });
};
