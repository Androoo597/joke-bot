import { bot } from "../../bot";
import * as cron from "cron";
import { everyFriday, everyMonday } from "../../utils/constants";
import { admins } from "./initCensorBot";
import { makeTableResultKeyboard } from "./callbackQueries";
import { trySqlRequest } from "../../db/methods";

const printWeekResult = (chatId: number | string) => {
  bot.api.sendMessage(chatId, "А вот и результаты чаты за неделю", {
    reply_markup: makeTableResultKeyboard(),
  });
};

const cleanUpWeekResults = () => {
  trySqlRequest({ tableName: "data", sqlReq: "delAll", method: "run" });
};

export const useBotRunCronJobs = () => {
  const chatId = admins()[0][3] || -1;
  new cron.CronJob(everyFriday, () => printWeekResult(chatId)).start();
  new cron.CronJob(everyMonday, cleanUpWeekResults).start();
};
