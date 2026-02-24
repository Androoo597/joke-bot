import { InlineKeyboard, Context, CallbackQueryContext } from "grammy";
import { trySqlRequest } from "../../db/methods";
import { prizeSmiles } from "../../utils/constants";
import { bot } from "../../bot";
import {
  inputMode,
  setInputMode,
  regWords as getRegWords,
  tableState,
} from "./initCensorBot";

const escEnter = async (ctx: Context) => {
  await ctx.reply("Отмена ввода");
  setInputMode("");
};

const makeOwnStatisticKeyboard = (user?: string) => {
  const tableResult = new InlineKeyboard();
  tableResult.text("Имя").text("Слово").text("Кол-во").row();

  const data = trySqlRequest({
    tableName: "data",
    sqlReq: "getOwnResult",
    method: "all",
    data: [user || ""],
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

const detailStateToggle = (user?: string) => {
  if (user && !tableState.value?.[user]) {
    tableState.value[user] = "opened";
  } else if (user && tableState.value[user] === "opened") {
    tableState.value[user] = "closed";
  } else if (user && tableState.value[user] === "closed") {
    tableState.value[user] = "opened";
  }
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
    const isOpened =
      tableState.value?.[item.userName] &&
      tableState.value?.[item.userName] === "opened";
    // console.log("isOpened ==> ", isOpened);

    tableResult
      .text(
        `${index + 1} место ${
          index <= 2 ? prizeSmiles[index] : prizeSmiles[3]
        }`,
      )
      .text(item.userName ?? "Другие")
      .text(item.result)
      .text(isOpened ? "🔻...🔻" : "🔺...🔺", `ownStatistic:${item.userName}`);

    if (isOpened) {
      tableResult.append(makeOwnStatisticKeyboard(item.userName));
    }

    tableResult.row();
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

    await ctx.reply("Таблица результатов", {
      reply_markup: tableResult,
    });
  });

  bot.callbackQuery(/ownStatistic[:]?(\w+)?/, async (ctx) => {
    inputMode() && escEnter(ctx);

    const user = ctx.match[1];
    detailStateToggle(user);

    if (user) {
      ctx.callbackQuery.message?.editText("Таблица результатов", {
        reply_markup: makeTableResultKeyboard(),
      });
      ctx.answerCallbackQuery();
    } else {
      await ctx.reply(`Детальная таблица для @${ctx.from.username} `, {
        reply_markup: makeOwnStatisticKeyboard(ctx.from.username),
      });
    }
  });
};
