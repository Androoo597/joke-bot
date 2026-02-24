import { bot } from "../../bot";
import * as cron from "cron";
import { everyFriday, everyMonday, phrases } from "../../utils/constants";
import { admins } from "./initCensorBot";
import { trySqlRequest } from "../../db/methods";
import { makeTableResultKeyboard } from "../../utils/makeResultKeyboard";
import { Tables, SqlMethodKeys, SqlMethods } from "../../db/utils";

const printWeekResult = (chatId: number | string) => {
  bot.api.sendMessage(chatId, phrases.weekResult, {
    reply_markup: makeTableResultKeyboard(),
  });
};

const cleanUpWeekResults = () => {
  trySqlRequest({
    tableName: Tables.data,
    sqlReq: SqlMethodKeys.delAll,
    method: SqlMethods.run,
  });
};

export const useBotRunCronJobs = () => {
  const chatId = admins()?.[0]?.[3] || -1;
  new cron.CronJob(everyFriday, () => printWeekResult(chatId)).start();
  new cron.CronJob(everyMonday, cleanUpWeekResults).start();
};
