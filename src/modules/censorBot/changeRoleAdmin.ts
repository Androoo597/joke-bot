import { Context } from "grammy";
import { trySqlRequest } from "../../db/methods";
import { setAdmins } from "./initCensorBot";
import { bot } from "../../bot";
import { SqlMethods, SqlMethodKeys, Tables } from "../../db/utils";

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
    method: SqlMethods.run,
    sqlReq: SqlMethodKeys.delAdmin,
    tableName: Tables.admins,
  });

  trySqlRequest({
    method: SqlMethods.run,
    sqlReq: SqlMethodKeys.insertAdmins,
    tableName: Tables.admins,
    data: res?.flat(1) as (string | number)[],
    onSuccess: () => setAdmins(res),
  });
  // для дебага админов
  // console.log("getAdmins() ==> ", getAdmins());
};

export const useChengeRoleAdmin = () => {
  bot.on("chat_member", updateAdmins);
};
