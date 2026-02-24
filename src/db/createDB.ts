import { DatabaseSync } from "node:sqlite";
import { Tables } from "../utils/constants";
const database = new DatabaseSync("db");

database.exec(`
  CREATE TABLE IF NOT EXISTS ${Tables.data} (
    id INTEGER PRIMARY KEY,
    userName TEXT,
    word TEXT
    ) STRICT
    `);

database.exec(`
  CREATE TABLE IF NOT EXISTS ${Tables.words} (
    id INTEGER PRIMARY KEY,
    word TEXT
  ) STRICT
`);

database.exec(`
  CREATE TABLE IF NOT EXISTS ${Tables.admins} (
    id INTEGER PRIMARY KEY,
    userName TEXT,
    userID INTEGER,
    status TEXT,
    chatID INTEGER,
    chatTitle TEXT
  ) STRICT
`);

export { database };
