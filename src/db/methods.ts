import { StatementSync } from "node:sqlite";
import { database } from "./createDB";

const insert = (tableName: string) =>
  database.prepare(`INSERT INTO ${tableName} (key, value) VALUES (?, ?)")`);
const getAll = (tableName: string) =>
  database.prepare(`SELECT * FROM ${tableName} ORDER BY key`);
const getByKey = (tableName: string) =>
  database.prepare(`SELECT * FROM ${tableName} WHERE key=?`);
const delById = (tableName: string) =>
  database.prepare(`DELETE FROM ${tableName} WHERE key=?`);

const tryDbMethod = (
  dbName: string,
  method: (tableName: string) => StatementSync
) => {
  try {
    const state = method(dbName);
    return state;
  } catch (error) {
    console.log(error);
  }
};

export { insert, getAll, delById, getByKey, tryDbMethod };
