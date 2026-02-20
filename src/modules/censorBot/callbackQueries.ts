import { InlineKeyboard, Context, CallbackQueryContext } from "grammy";
import { trySqlRequest } from "../../db/methods";
import { prizeSmiles } from "../../utils/constants";
import { bot } from "../../bot";
import { inputMode, setInputMode, regWords as getRegWords } from "./censorBot";

const escEnter = async (ctx: Context) => {
  await ctx.reply("Отмена ввода");
  setInputMode("");
};

const ownStatistic = (ctx: CallbackQueryContext<Context>) => {
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

  return tableResult;
};

const makeTableResultKeyboard = () => {
  const tableResult = new InlineKeyboard();
  tableResult
    .text("Место")
    .text("Имя")
    .text("Кол. слов")
    .text("Подробнее")
    .row();

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
      .text("... 📋", "ownStatistic")
      .row();
  });

  return tableResult;
};

export const useCallbackQueries = () => {
  bot.chatType("private").callbackQuery("escEnter", async (ctx) => {
    inputMode() && escEnter(ctx);
  });

  bot.chatType("private").callbackQuery("addWord", async (ctx) => {
    await ctx.reply("Введите новое слово в строке ниже");
    setInputMode("add");
  });

  bot.chatType("private").callbackQuery("delWord", async (ctx) => {
    await ctx.reply("Введите удаляемое слово в строке ниже");
    setInputMode("del");
  });

  bot.chatType("private").callbackQuery("alertWords", async (ctx) => {
    const allWords = getRegWords();
    await ctx.reply(
      allWords.length ? allWords.join("\n") : "Нет добавленных слов",
    );
    inputMode() && escEnter(ctx);
  });

  bot.callbackQuery("result", async (ctx) => {
    inputMode() && escEnter(ctx);
    const tableResult = makeTableResultKeyboard();

    // tableResult.append(ownStatistic(ctx));

    await ctx.reply("Таблица результатов", {
      reply_markup: tableResult,
    });
  });

  bot.callbackQuery("ownStatistic", async (ctx) => {
    inputMode() && escEnter(ctx);
    const ownResult = ownStatistic(ctx);

    await ctx.reply(`Детальная таблица для @${ctx.from.username} `, {
      reply_markup: ownResult,
    });
  });
};
