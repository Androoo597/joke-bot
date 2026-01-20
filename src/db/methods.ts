import { SQLInputValue } from "node:sqlite";
import { database } from "./createDB";
import { Tables } from "../utils/constants";

const sqlMethods = {
  getAll: "SELECT * FROM tableName ORDER BY id",
  getTableResult:
    "SELECT userName, COUNT(userName) as result FROM tableName GROUP BY userName ORDER BY result DESC",
  getOwnResult:
    "SELECT userName, word, COUNT(word) as count FROM tableName WHERE userName=? GROUP BY word ORDER BY count DESC",
  getAllWords: "SELECT word FROM tableName ORDER BY id",
  insert: "INSERT or IGNORE INTO tableName (userName, word) VALUES (?, ?)",
  insertWord: "INSERT or IGNORE INTO tableName (word) VALUES (?)",
  getById: "SELECT * FROM tableName WHERE id=?",
  delAll: "DELETE FROM tableName",
  delById: "DELETE FROM tableName WHERE id=?",
  delByWord: "DELETE FROM tableName WHERE word LIKE ?",
  selectByWord: "SELECT word FROM tableName WHERE word LIKE ?",
  updateWord: "UPDATE tableName SET word=? WHERE word LIKE ?",
};

const trySqlRequest = (
  tableName: keyof typeof Tables,
  sqlReq: keyof typeof sqlMethods,
  method: "all" | "get" | "run" | "columns" | "iterate",
  data?: SQLInputValue[]
) => {
  try {
    const sql = sqlMethods[sqlReq].replace("tableName", tableName);
    const statement = database.prepare(sql);
    return statement[method](...(data || []));
  } catch (error) {
    console.log(error);
  }
};

export { trySqlRequest };
