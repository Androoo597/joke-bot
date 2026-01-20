import { Api, Bot, Context, InlineKeyboard, RawApi } from "grammy";
import { myReg, phrases, prizeSmiles } from "../utils/constants";
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
  const allWords = trySqlRequest("words", "getAllWords", "all") as Record<
    "word",
    string
  >[];
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
  const word = trySqlRequest("words", "selectByWord", "get", [
    `%${message}%`,
  ]) as Record<"word", string>;
  return word.word;
};

export const censorBot = (bot: Bot<Context, Api<RawApi>>) => {
  bot.command("start", async (ctx) => {
    await bot.api.sendMessage(ctx.chatId, phrases.hello, {
      parse_mode: "HTML",
    });
    await ctx.reply("Главное меню комманд", {
      reply_markup: inlineKeyboard,
    });
  });

  bot.command("help", async (ctx) => {
    await bot.api.sendMessage(ctx.chatId, "Помощь");
    await bot.api.sendMessage(ctx.chatId, phrases.help);
  });

  bot.command("menu", async (ctx) => {
    await ctx.reply("Меню цензор бота /help - если нужна помошь", {
      reply_markup: inlineKeyboard,
    });
  });

  bot.command("resetAll", async (ctx) => {
    await ctx.reply("Введите Y/Yes для отчистки данных бота");
    inputMode = "delAll";
  });

  bot.command("resetWords", async (ctx) => {
    await ctx.reply("Введите Y/Yes для удаления всех ключевых слов");
    inputMode = "delWors";
  });

  bot.command("resetStat", async (ctx) => {
    await ctx.reply("Введите Y/Yes для удаления статистики");
    inputMode = "delStat";
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
    const tableResult = new InlineKeyboard();
    tableResult.text("Место").text("Имя").text("Кол. слов").row();

    const data = trySqlRequest("data", "getTableResult", "all") as Record<
      "userName" | "result",
      string
    >[];

    data.forEach((item, index) => {
      tableResult
        .text(
          `${index + 1} место ${
            index <= 2 ? prizeSmiles[index] : prizeSmiles[3]
          }`
        )
        .text(item.userName)
        .text(item.result)
        .row();
    });

    await ctx.reply("Таблица результатов", {
      reply_markup: tableResult,
    });
  });

  bot.callbackQuery("ownStatistic", async (ctx) => {
    const tableResult = new InlineKeyboard();
    tableResult.text("Имя").text("Слово").text("Кол-во").row();

    const data = trySqlRequest("data", "getOwnResult", "all", [
      ctx.from.username || "",
    ]) as Record<"userName" | "word" | "count", string>[];

    let counter = 0;

    data.forEach((item) => {
      counter = +item.count + counter;
      tableResult.text(item.userName).text(item.word).text(item.count).row();
    });

    tableResult.text("Итог").text("Итог").text(String(counter));

    await ctx.reply(`Детальная таблица для @${ctx.from.username} `, {
      reply_markup: tableResult,
    });
  });

  bot.on("message:text", async (ctx) => {
    const message = ctx.update.message.text;

    switch (inputMode) {
      case "add":
        trySqlRequest("words", "insertWord", "run", [
          message.replace(myReg.addWord, "|"),
        ]);
        ctx.reply(`Слово: "${ctx.update.message.text}" успешно добавлено`);
        break;

      case "del":
        const word = getWord(message);

        message.length !== word.length
          ? updateWord(word, message)
          : deleteWord(message);

        ctx.reply(`Слово: "${ctx.update.message.text}" успешно удалено`);
        break;

      case "delWors":
        if (/Y|YES/im.test(message)) {
          trySqlRequest("words", "delAll", "run");
          await ctx.reply("Все ключевые слова были удалены");
        } else {
          await ctx.reply("Отмена");
        }
        break;

      case "delStat":
        if (/Y|YES/im.test(message)) {
          trySqlRequest("data", "delAll", "run");
          await ctx.reply("Статистика была отчищена");
        } else {
          await ctx.reply("Отмена");
        }
        break;

      case "delAll":
        if (/Y|YES/im.test(message)) {
          trySqlRequest("data", "delAll", "run");
          trySqlRequest("words", "delAll", "run");
          await ctx.reply("Ваш Цензор бот был сброшен до заводских настроек");
        } else {
          await ctx.reply("Отмена");
        }
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
    inputMode = "";
  });

  bot.callbackQuery("alertWords", async (ctx) => {
    const allWords = getAllWords();
    await ctx.reply(
      allWords.length ? allWords.join("\n") : "Нет добавленных слов"
    );
  });
};
