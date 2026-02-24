import { InlineKeyboard } from "grammy";
import { trySqlRequest } from "../db/methods";
import { SqlMethodKeys, SqlMethods, Tables } from "../db/utils";

export const makeOwnStatisticKeyboard = (user?: string) => {
  const tableResult = new InlineKeyboard();
  tableResult.text("Имя").text("Слово").text("Кол-во").row();

  const data = trySqlRequest({
    tableName: Tables.data,
    sqlReq: SqlMethodKeys.getOwnResult,
    method: SqlMethods.all,
    data: [user || ""],
  }) as Record<"userName" | "word" | "count", string>[];

  let counter = 0;

  data.forEach((item) => {
    counter = +item.count + counter;
    tableResult
      .text(item.userName || "ошибка")
      .text(item.word || "слово удалено")
      .text(item.count)
      .row();
  });

  tableResult.text("Итог").text("Итог").text(String(counter));

  return tableResult;
};
