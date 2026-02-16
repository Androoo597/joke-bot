import { type Context } from "grammy";

export const isPrivateChat = async (ctx: Context) => {
  const chat = await ctx.getChat();
  return chat.type === "private";
};
