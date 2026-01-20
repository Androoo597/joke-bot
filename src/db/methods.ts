import { SQLInputValue } from "node:sqlite";
import { database } from "./createDB";
import { Tables } from "../utils/constants";

const sqlMethods = {
  getAll: "SELECT * FROM tableName ORDER BY id",
  getAllWords: "SELECT word FROM tableName ORDER BY id",
  insert: "INSERT or IGNORE INTO tableName (userName, word) VALUES (?, ?)",
  insertWord: "INSERT or IGNORE INTO tableName (word) VALUES (?)",
  getById: "SELECT * FROM tableName WHERE id=?",
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
