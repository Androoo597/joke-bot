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
  const allWords = trySqlRequest({
    tableName: "words",
    sqlReq: "getAllWords",
    method: "all",
  }) as Record<"word", string>[];
  // console.log("allWords ==> ", allWords);
  if (Array.isArray(allWords)) {
    const stringWords = allWords
      ?.map((item) => item.word?.split(myReg.addWord))
      .flat(1);
    return stringWords;
  }
  return [];
};

// const updateWord = (word: string, message: string) => {
//   const wwm = word.replace(myReg.updWord(message), "");
//   console.log("wwm ==> ", wwm);
//   const ecec = trySqlRequest("words", "updateWord", "run", [
//     wwm,
//     `%${message}%`,
//   ]);
//   console.log("ecec ==> ", ecec);
// };

// const deleteWord = (message: string) => {
//   trySqlRequest("words", "delByWord", "run", [`%${message}%`]);
// };

// const getWord = (message: string): string => {
//   const word = trySqlRequest("words", "selectByWord", "get", [
//     `%${message}%`,
//   ]) as Record<"word", string>;
//   return word.word;
// };

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

    const data = trySqlRequest({
      tableName: "data",
      sqlReq: "getTableResult",
      method: "all",
    }) as Record<"userName" | "result", string>[];
    // console.log("data ==> ", data);

    data.forEach((item, index) => {
      tableResult
        .text(
          `${index + 1} место ${
            index <= 2 ? prizeSmiles[index] : prizeSmiles[3]
          }`,
        )
        .text(item.userName ?? "Другие")
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

    const data = trySqlRequest({
      tableName: "data",
      sqlReq: "getOwnResult",
      method: "all",
      data: [ctx.from.username || ""],
    }) as Record<"userName" | "word" | "count", string>[];

    let counter = 0;

    data.forEach((item) => {
      counter = +item.count + counter;
      tableResult
        .text(item.userName || "ошибка")
        .text(item.word || "слово удалено")
        .text(item.count)
        .row();
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
        trySqlRequest({
          tableName: "words",
          sqlReq: "insertWord",
          method: "run",
          data: message.split(myReg.splitter),
        });
        ctx.reply(`Слова: "${ctx.update.message.text}" успешно добавлены`);
        break;

      case "del":
        // const word = getWord(message);
        const wordsToDel = message.split(myReg.splitter);
        // console.log("wordsToDel ==> ", wordsToDel);
        trySqlRequest({
          tableName: "words",
          sqlReq: "delwords",
          method: "run",
          data: wordsToDel,
        });

        // deleteWord(message);
        // trySqlRequest("words", "delByWord", "run", [`%${message}%`]);

        // message.length !== word.length
        //   ? updateWord(word, message)
        //   : deleteWord(message);

        ctx.reply(`Слово: "${ctx.update.message.text}" успешно удалено`);
        break;

      case "delWors":
        if (myReg.yesNo.test(message)) {
          trySqlRequest({
            tableName: "words",
            sqlReq: "delAll",
            method: "run",
          });
          await ctx.reply("Все ключевые слова были удалены");
        } else {
          await ctx.reply("Отмена");
        }
        break;

      case "delStat":
        if (myReg.yesNo.test(message)) {
          trySqlRequest({ tableName: "data", sqlReq: "delAll", method: "run" });
          await ctx.reply("Статистика была отчищена");
        } else {
          await ctx.reply("Отмена");
        }
        break;

      case "delAll":
        if (myReg.yesNo.test(message)) {
          trySqlRequest({ tableName: "data", sqlReq: "delAll", method: "run" });
          trySqlRequest({
            tableName: "words",
            sqlReq: "delAll",
            method: "run",
          });
          await ctx.reply("Ваш Цензор бот был сброшен до заводских настроек");
        } else {
          await ctx.reply("Отмена");
        }
        break;

      default:
        const regWords = getAllWords();
        // console.log("regWords ==> ", regWords);
        const searchRes = (message + " ").match(myReg.censorWords(regWords));
        const res = searchRes?.map((item) => item.slice(0, -1).trim());
        // console.log("res ==> ", res);
        // console.log("myReg.censorWords ==> ", myReg.censorWords(regWords));
        // console.log("message ==> ", message);

        if (res?.length) {
          ctx.reply(`Ваши слова: "${res.toString()}" дабавлены в статистику!`);
          trySqlRequest({
            tableName: "data",
            sqlReq: "insert",
            method: "run",
            data: res.map((word) => [ctx.from?.username || "", word]).flat(1),
          });
        }

        break;
    }
    inputMode = "";
  });

  bot.callbackQuery("alertWords", async (ctx) => {
    const allWords = getAllWords();
    await ctx.reply(
      allWords.length ? allWords.join("\n") : "Нет добавленных слов",
    );
  });
};
