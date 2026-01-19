import { Bot, Api, RawApi, Context } from "grammy";
import { trySqlRequest } from "../db/methods";
import { myReg } from "../utils/constants";

export const parserReg = (bot: Bot<Context, Api<RawApi>>) => {
  bot.hears(myReg.badWords, async (ctx) => {
    ctx.reply(`Нет ты ${ctx.match[1]}`);
  });
};
