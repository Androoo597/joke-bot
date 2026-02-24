import { trySqlRequest } from "../../db/methods";
import { getAllWords } from "../../utils/getAllWords";
import {
  setInputMode,
  inputMode as getInputMode,
  setRegWords,
  proxyReg,
} from "./initCensorBot";
import { bot } from "../../bot";
import { botFuckReaction, myReg, phrases } from "../../utils/constants";
import { Tables, SqlMethodKeys, SqlMethods } from "../../db/utils";

export const useMessageHandler = () => {
  bot.chatType("private").on("message:text", async (ctx) => {
    const message = ctx.update.message.text;
    switch (getInputMode()) {
      case "add":
        trySqlRequest({
          tableName: Tables.words,
          sqlReq: SqlMethodKeys.insertWord,
          method: SqlMethods.run,
          data: message.split(myReg.splitter),
        });

        setRegWords(getAllWords());
        ctx.reply(phrases.resultAddWord(ctx.update.message.text));
        break;

      case "del":
        const wordsToDel = message.split(myReg.splitter);
        trySqlRequest({
          tableName: Tables.words,
          sqlReq: SqlMethodKeys.delwords,
          method: SqlMethods.run,
          data: wordsToDel,
        });

        setRegWords(getAllWords());
        ctx.reply(phrases.resultDelWord(ctx.update.message.text));
        break;

      case "delWors":
        if (myReg.yesNo.test(message)) {
          trySqlRequest({
            tableName: Tables.words,
            sqlReq: SqlMethodKeys.delAll,
            method: SqlMethods.run,
          });

          setRegWords(getAllWords());
          await ctx.reply(phrases.resuldResetWords);
        } else {
          await ctx.reply(phrases.esc);
        }
        break;

      case "delStat":
        if (myReg.yesNo.test(message)) {
          trySqlRequest({
            tableName: Tables.data,
            sqlReq: SqlMethodKeys.delAll,
            method: SqlMethods.run,
          });
          await ctx.reply(phrases.resultResetStat);
        } else {
          await ctx.reply(phrases.esc);
        }
        break;

      case "delAll":
        if (myReg.yesNo.test(message)) {
          trySqlRequest({
            tableName: Tables.data,
            sqlReq: SqlMethodKeys.delAll,
            method: SqlMethods.run,
          });
          trySqlRequest({
            tableName: Tables.words,
            sqlReq: SqlMethodKeys.delAll,
            method: SqlMethods.run,
          });

          setRegWords(getAllWords());
          await ctx.reply(phrases.resultResetAll);
        } else {
          await ctx.reply(phrases.esc);
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
            tableName: Tables.data,
            sqlReq: SqlMethodKeys.insert,
            method: SqlMethods.run,
            data: res.map((word) => [ctx.from?.username || "", word]).flat(1),
            onSuccess: () => ctx.react(botFuckReaction),
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
          tableName: Tables.data,
          sqlReq: SqlMethodKeys.insert,
          method: SqlMethods.run,
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
