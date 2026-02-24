import {
  phrases,
  menuKeyboard,
  listMyComands,
  userMenuKeyboard,
} from "../../utils/constants";
import { bot } from "../../bot";
import { admins, setInputMode } from "./initCensorBot";
import { updateAdmins } from ".";
import { InlineKeyboard, type Context } from "grammy";

const isAdmin = (chat: Context["chat"], userName?: string) => {
  // admins();
  // console.log("userName ==> ", userName);
  // console.log("chat ==> ", chat);
  // console.log("admins() ==> ", admins());
  const chatInfo = admins().flat(1);
  const isAdmin = chatInfo.some((value) => value === userName);
  return isAdmin && chat?.type === "private";
};

const showStartMessages = async (ctx: Context, keyboard: InlineKeyboard) => {
  await bot.api.sendMessage(ctx?.chatId || -1, phrases.hello, {
    parse_mode: "HTML",
  });
  await ctx.reply(phrases.menu, {
    reply_markup: keyboard,
  });
};

export const useCensorCommands = () => {
  bot.api.setMyCommands(listMyComands);

  bot.chatType(["group", "channel", "supergroup"]).command("start", (ctx) => {
    updateAdmins(ctx);
    showStartMessages(ctx, userMenuKeyboard);
  });

  bot.chatType("private").command("help", async (ctx) => {
    await bot.api.sendMessage(ctx.chatId, phrases.helpCommand);
    await bot.api.sendMessage(ctx.chatId, phrases.help);
  });

  bot.chatType("private").command("reset_all", async (ctx) => {
    if (!isAdmin(ctx.chat, ctx.from?.username)) {
      await ctx.reply(phrases.adminOnly);
      return;
    }
    await ctx.reply(phrases.resetAll);
    setInputMode("delAll");
  });

  bot.chatType("private").command("reset_words", async (ctx) => {
    if (!isAdmin(ctx.chat, ctx.from?.username)) {
      await ctx.reply(phrases.adminOnly);
      return;
    }
    await ctx.reply(phrases.resetWords);
    setInputMode("delWors");
  });

  bot.chatType("private").command("reset_stat", async (ctx) => {
    if (!isAdmin(ctx.chat, ctx.from?.username)) {
      await ctx.reply(phrases.adminOnly);
      return;
    }
    await ctx.reply(phrases.resetStat);
    setInputMode("delStat");
  });

  bot.command("start", (ctx) => showStartMessages(ctx, menuKeyboard));

  bot.command("help", async (ctx) => {
    await bot.api.sendMessage(ctx.chatId, phrases.helpCommand);
    await bot.api.sendMessage(ctx.chatId, phrases.userHelp);
  });

  bot.command("menu", async (ctx) => {
    await ctx.reply(phrases.menuIfHelp, {
      reply_markup: isAdmin(ctx.chat, ctx.from?.username)
        ? menuKeyboard
        : userMenuKeyboard,
    });
  });
};
