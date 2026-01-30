import { Bot, Api, RawApi, Context } from "grammy";

export const reactions = (bot: Bot<Context, Api<RawApi>>) => {
  bot.reaction("💩", (ctx) => {
    ctx.reply(`Да сам ты говно @${ctx.from?.username}!!!`, {
      reply_parameters: { message_id: ctx.msgId },
    });
  });

  bot.on("message_reaction", async (ctx) => {
    const { emojiRemoved } = ctx.reactions();
    if (emojiRemoved.includes("💩")) {
      await ctx.reply(`Ладно, я прощаю тебя @${ctx.from?.username}!!!`, {
        reply_parameters: { message_id: ctx.msgId },
      });
    }
  });
};
