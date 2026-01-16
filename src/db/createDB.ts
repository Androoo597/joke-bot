import { DatabaseSync } from "node:sqlite";
const database = new DatabaseSync("db");

database.exec(`
  CREATE TABLE IF NOT EXISTS data (
    key INTEGER PRIMARY KEY,
    value TEXT
  ) STRICT
`);

database.exec(`
  CREATE TABLE IF NOT EXISTS questions (
    key INTEGER PRIMARY KEY,
    value TEXT
  ) STRICT
`);

export { database };
