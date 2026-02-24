import { database } from "./createDB";
import { myReg } from "../utils/constants";
import { sqlMethods, TrySQLReq } from "./utils";

let sql;

const trySqlRequest = ({
  tableName,
  sqlReq,
  method,
  data,
  onError,
  onSuccess,
}: TrySQLReq) => {
  try {
    sql = sqlMethods[sqlReq].replace("tableName", tableName);
    const divider = sqlMethods[sqlReq]
      .match(/\(([^)]+)\)/i)?.[1]
      .split(", ").length;
    if (sqlReq.startsWith("insert")) {
      const replacedText = sql.match(myReg.matcherAsk);
      const newText = (replacedText?.[1] + ",")?.repeat(
        (data?.length || 1) / (divider || 1),
      );
      sql = sql.replace(replacedText?.[1] || "", newText.slice(0, -1));
    }
    if (sqlReq === "delwords") {
      const newText = `(${"?,".repeat(data?.length || 0).slice(0, -1)})`;
      sql = sql.replace("(?)", newText);
    }
    const statement = database.prepare(sql);
    onSuccess?.();
    return statement[method](...(data || []));
  } catch (error) {
    console.log(error);
    onError?.();
  }
};

export { trySqlRequest };
