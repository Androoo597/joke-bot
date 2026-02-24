import { trySqlRequest } from "../../db/methods";
import { getAllWords } from "../../utils/getAllWords";
import {
  setInputMode,
  inputMode as getInputMode,
  setRegWords,
  proxyReg,
} from "./initCensorBot";
import { bot } from "../../bot";
import { myReg } from "../../utils/constants";

export const useMessageHandler = () => {
  bot.chatType("private").on("message:text", async (ctx) => {
    const message = ctx.update.message.text;
    switch (getInputMode()) {
      case "add":
        trySqlRequest({
          tableName: "words",
          sqlReq: "insertWord",
          method: "run",
          data: message.split(myReg.splitter),
        });

        setRegWords(getAllWords());
        ctx.reply(`Слова: "${ctx.update.message.text}" успешно добавлены`);
        break;

      case "del":
        const wordsToDel = message.split(myReg.splitter);
        trySqlRequest({
          tableName: "words",
          sqlReq: "delwords",
          method: "run",
          data: wordsToDel,
        });

        setRegWords(getAllWords());
        ctx.reply(`Слово: "${ctx.update.message.text}" успешно удалено`);
        break;

      case "delWors":
        if (myReg.yesNo.test(message)) {
          trySqlRequest({
            tableName: "words",
            sqlReq: "delAll",
            method: "run",
          });

          setRegWords(getAllWords());
          await ctx.reply("Все ключевые слова были удалены");
        } else {
          await ctx.reply("Отмена");
        }
        break;

      case "delStat":
        if (myReg.yesNo.test(message)) {
          trySqlRequest({ tableName: "data", sqlReq: "delAll", method: "run" });
          await ctx.reply("Статистика была отчищена");
        } else {
          await ctx.reply("Отмена");
        }
        break;

      case "delAll":
        if (myReg.yesNo.test(message)) {
          trySqlRequest({ tableName: "data", sqlReq: "delAll", method: "run" });
          trySqlRequest({
            tableName: "words",
            sqlReq: "delAll",
            method: "run",
          });

          setRegWords(getAllWords());
          await ctx.reply("Ваш DICK-BOT был сброшен до заводских настроек");
        } else {
          await ctx.reply("Отмена");
        }
        break;

      default:
        // для дебага регулярки
        // console.log("proxyReg.dymanicReg ==> ", proxyReg.dymanicReg);
        // для дебага слов в бд
        // console.log("words ==> ", getAllWords());
        const searchRes = (message + " ").match(proxyReg.dymanicReg);
        // для дебага результата поиска
        // console.log("searchRes ==> ", searchRes);
        const res = searchRes?.map((item) => item.slice(0, -1).trim());

        if (res?.length) {
          trySqlRequest({
            tableName: "data",
            sqlReq: "insert",
            method: "run",
            data: res.map((word) => [ctx.from?.username || "", word]).flat(1),
            onSuccess: () => ctx.react("👀"),
          });
        }

        break;
    }
    setInputMode("");
  });

  bot
    .chatType(["channel", "group", "supergroup"])
    .on("message:text", async (ctx) => {
      const message = ctx.update.message.text;
      const searchRes = (message + " ").match(proxyReg.dymanicReg);
      const res = searchRes?.map((item) => item.slice(0, -1).trim());

      if (res?.length) {
        trySqlRequest({
          tableName: "data",
          sqlReq: "insert",
          method: "run",
          data: res.map((word) => [ctx.from?.username || "", word]).flat(1),
          onSuccess: () =>
            ctx.reply(
              `Ваши слова: "${res.toString()}" дабавлены в статистику!`,
            ),
        });
      }

      setInputMode("");
    });
};
