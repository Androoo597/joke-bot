import { InlineKeyboard } from "grammy";
import { trySqlRequest } from "../db/methods";
import { tableState } from "../modules/censorBot/initCensorBot";
import { prizeSmiles } from "./constants";
import { makeOwnStatisticKeyboard } from "./makeOwnKeyboard";
import { SqlMethodKeys, SqlMethods, Tables } from "../db/utils";

export const makeTableResultKeyboard = () => {
  const tableResult = new InlineKeyboard();
  tableResult
    .text("Место")
    .text("Имя")
    .text("Кол. слов")
    .text("Подробнее")
    .row();

  const data = trySqlRequest({
    tableName: Tables.data,
    sqlReq: SqlMethodKeys.getTableResult,
    method: SqlMethods.all,
  }) as Record<"userName" | "result", string>[];

  data.forEach((item, index) => {
    const isOpened =
      tableState()?.[item.userName] &&
      tableState()?.[item.userName] === "opened";

    tableResult
      .text(
        `${index + 1} место ${
          index <= 2 ? prizeSmiles[index] : prizeSmiles[3]
        }`,
      )
      .text(item.userName ?? "Другие")
      .text(item.result)
      .text(isOpened ? "🔻...🔻" : "🔺...🔺", `ownStatistic:${item.userName}`);

    if (isOpened) {
      tableResult.append(makeOwnStatisticKeyboard(item.userName));
    }

    tableResult.row();
  });

  return tableResult;
};
