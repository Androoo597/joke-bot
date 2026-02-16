import { SQLInputValue } from "node:sqlite";
import { database } from "./createDB";
import { myReg, Tables } from "../utils/constants";

interface TrySQLReq {
  tableName: keyof typeof Tables;
  sqlReq: keyof typeof sqlMethods;
  method: "all" | "get" | "run" | "columns" | "iterate";
  data?: SQLInputValue[];
  onError?: () => void;
  onSuccess?: () => void;
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
  getAdmins:
    "SELECT userName, userID, status, chatID, chatTitle FROM tableName ORDER BY status",
  delAdmin: "DELETE FROM tableName",
  insertAdmins:
    "INSERT or IGNORE INTO tableName (userName, userID, status, chatID, chatTitle) VALUES (?, ?, ?, ?, ?)",
};

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
