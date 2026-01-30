import { Bot, Api, RawApi, Context } from "grammy";
import { phrases, menuKeyboard } from "../../utils/constants";

export const useCensorCommands = (
  bot: Bot<Context, Api<RawApi>>,
  setInputMode: (mode: string) => void,
) => {
  bot.command("start", async (ctx) => {
    await bot.api.sendMessage(ctx.chatId, phrases.hello, {
      parse_mode: "HTML",
    });
    await ctx.reply("Главное меню комманд", {
      reply_markup: menuKeyboard,
    });
  });

  bot.command("help", async (ctx) => {
    await bot.api.sendMessage(ctx.chatId, "Помощь");
    await bot.api.sendMessage(ctx.chatId, phrases.help);
  });

  bot.command("menu", async (ctx) => {
    await ctx.reply("Меню цензор бота /help - если нужна помошь", {
      reply_markup: menuKeyboard,
    });
  });

  bot.command("resetAll", async (ctx) => {
    await ctx.reply("Введите Y/Yes для отчистки данных бота");
    setInputMode("delAll");
  });

  bot.command("resetWords", async (ctx) => {
    await ctx.reply("Введите Y/Yes для удаления всех ключевых слов");
    setInputMode("delWors");
  });

  bot.command("resetStat", async (ctx) => {
    await ctx.reply("Введите Y/Yes для удаления статистики");
    setInputMode("delStat");
  });

  bot.callbackQuery("addWord", async (ctx) => {
    await ctx.reply("Введите новое слово в строке ниже");
    setInputMode("add");
  });
};
