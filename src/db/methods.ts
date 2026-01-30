import { SQLInputValue } from "node:sqlite";
import { database } from "./createDB";
import { myReg, Tables } from "../utils/constants";

interface TrySQLReq {
  tableName: keyof typeof Tables;
  sqlReq: keyof typeof sqlMethods;
  method: "all" | "get" | "run" | "columns" | "iterate";
  data?: SQLInputValue[];
  onError?: () => void;
}

const sqlMethods = {
  getAll: "SELECT * FROM tableName ORDER BY id",
  getTableResult:
    "SELECT userName, COUNT(userName) as result FROM tableName GROUP BY userName ORDER BY result DESC",
  getOwnResult:
    "SELECT userName, word, COUNT(word) as count FROM tableName WHERE userName=? GROUP BY word ORDER BY count DESC",
  getAllWords: "SELECT word FROM tableName ORDER BY id",
  insert: "INSERT or IGNORE INTO tableName (userName, word) VALUES (?, ?)",
  insertWord: "INSERT or IGNORE INTO tableName (word) VALUES (?)",
  delAll: "DELETE FROM tableName",
  delwords: "DELETE FROM tableName WHERE word IN (?)",
};

let sql;

const trySqlRequest = ({
  tableName,
  sqlReq,
  method,
  data,
  onError,
}: TrySQLReq) => {
  try {
    sql = sqlMethods[sqlReq].replace("tableName", tableName);
    const divider = sqlReq === "insert" ? 2 : 1;
    if (sqlReq.startsWith("insert")) {
      const replacedText = sql.match(myReg.matcherAsk);
      const newText = (replacedText?.[1] + ",")?.repeat(
        (data?.length || 1) / divider,
      );
      sql = sql.replace(replacedText?.[1] || "", newText.slice(0, -1));
    }
    if (sqlReq === "delwords") {
      const newText = `(${"?,".repeat(data?.length || 0).slice(0, -1)})`;
      sql = sql.replace("(?)", newText);
    }
    const statement = database.prepare(sql);
    return statement[method](...(data || []));
  } catch (error) {
    console.log(error);
    onError?.();
  }
};

export { trySqlRequest };
