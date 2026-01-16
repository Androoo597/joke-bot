import { Bot, Api, RawApi, Context } from "grammy";

const myReg = {
  badWords: /ты\s([а-яА-Я\w]+)/im,
};

export const parserReg = (bot: Bot<Context, Api<RawApi>>) => {
  bot.hears(myReg.badWords, async (ctx) => {
    ctx.reply(`Нет ты ${ctx.match[1]}`);
  });
};
