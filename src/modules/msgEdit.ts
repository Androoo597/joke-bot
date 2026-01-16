import { Bot, Api, RawApi, Context } from "grammy";

export const msgEdit = (bot: Bot<Context, Api<RawApi>>) => {
  bot.on(
    "edit:text",
    async (ctx) =>
      await ctx.reply(
        "Зачем радактируешь сообщение, редиска? " + `@${ctx.from?.username}`,
        {
          reply_parameters: { message_id: ctx.msgId },
        }
      )
  );
};
