import { Context } from "grammy";
import { trySqlRequest } from "../../db/methods";
import { setAdmins, admins as getAdmins } from "./initCensorBot";
import { bot } from "../../bot";

export const updateAdmins = async (ctx: Context) => {
  const admins = (await ctx.getChatAdministrators()) || [];
  const res = admins.map((admin) => [
    admin.user.username,
    admin.user.id,
    admin.status,
    ctx.chatId,
    ctx?.chat?.title,
  ]);

  trySqlRequest({
    method: "run",
    sqlReq: "delAdmin",
    tableName: "admins",
  });

  trySqlRequest({
    method: "run",
    sqlReq: "insertAdmins",
    tableName: "admins",
    data: res?.flat(1) as (string | number)[],
    onSuccess: () => setAdmins(res),
  });
  // для дебага админов
  // console.log("getAdmins() ==> ", getAdmins());
};

export const useChengeRoleAdmin = () => {
  bot.on("chat_member", updateAdmins);
};
