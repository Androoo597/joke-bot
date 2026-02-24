import { Context } from "grammy";
import { bot } from "../../bot";
import {
  inputMode,
  setInputMode,
  regWords as getRegWords,
  tableState,
} from "./initCensorBot";
import { makeOwnStatisticKeyboard } from "../../utils/makeOwnKeyboard";
import { makeTableResultKeyboard } from "../../utils/makeResultKeyboard";
import { phrases } from "../../utils/constants";

const escEnter = async (ctx: Context) => {
  await ctx.reply(phrases.escEnter);
  setInputMode("");
};

const detailStateToggle = (user?: string) => {
  if (user && !tableState()?.[user]) {
    tableState()[user] = "opened";
  } else if (user && tableState()?.[user] === "opened") {
    tableState()[user] = "closed";
  } else if (user && tableState()?.[user] === "closed") {
    tableState()[user] = "opened";
  }
};

export const useCallbackQueries = () => {
  bot.chatType("private").callbackQuery("escEnter", async (ctx) => {
    inputMode() && escEnter(ctx);
  });

  bot.chatType("private").callbackQuery("addWord", async (ctx) => {
    await ctx.reply(phrases.addWord);
    setInputMode("add");
  });

  bot.chatType("private").callbackQuery("delWord", async (ctx) => {
    await ctx.reply(phrases.delWord);
    setInputMode("del");
  });

  bot.chatType("private").callbackQuery("alertWords", async (ctx) => {
    const allWords = getRegWords();
    await ctx.reply(allWords.length ? allWords.join("\n") : phrases.emptyWords);
    inputMode() && escEnter(ctx);
  });

  bot.callbackQuery("result", async (ctx) => {
    inputMode() && escEnter(ctx);
    const tableResult = makeTableResultKeyboard();

    await ctx.reply(phrases.tableResult, {
      reply_markup: tableResult,
    });
  });

  bot.callbackQuery(/ownStatistic[:]?(\w+)?/, async (ctx) => {
    inputMode() && escEnter(ctx);

    const user = ctx.match[1];
    detailStateToggle(user);

    if (user) {
      ctx.callbackQuery.message?.editText(phrases.tableResult, {
        reply_markup: makeTableResultKeyboard(),
      });
      ctx.answerCallbackQuery();
    } else {
      await ctx.reply(phrases.detailInfo(ctx.from.username), {
        reply_markup: makeOwnStatisticKeyboard(ctx.from.username),
      });
    }
  });
};
export { makeTableResultKeyboard };
