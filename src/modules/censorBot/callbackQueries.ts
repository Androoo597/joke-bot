import { Bot, Api, RawApi, InlineKeyboard, Context } from "grammy";
import { trySqlRequest } from "../../db/methods";
import { prizeSmiles } from "../../utils/constants";

export const useCallbackQueries = (
  bot: Bot<Context, Api<RawApi>>,
  setInputMode: (mode: string) => void,
  getRegWords: () => string[],
) => {
  bot.callbackQuery("addWord", async (ctx) => {
    await ctx.reply("Введите новое слово в строке ниже");
    setInputMode("add");
  });

  bot.callbackQuery("delWord", async (ctx) => {
    await ctx.reply("Введите удаляемое слово в строке ниже");
    setInputMode("del");
  });

  bot.callbackQuery("result", async (ctx) => {
    const tableResult = new InlineKeyboard();
    tableResult.text("Место").text("Имя").text("Кол. слов").row();

    const data = trySqlRequest({
      tableName: "data",
      sqlReq: "getTableResult",
      method: "all",
    }) as Record<"userName" | "result", string>[];

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

  bot.callbackQuery("alertWords", async (ctx) => {
    const allWords = getRegWords();
    await ctx.reply(
      allWords.length ? allWords.join("\n") : "Нет добавленных слов",
    );
  });
};
