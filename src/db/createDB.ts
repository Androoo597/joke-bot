import { DatabaseSync } from "node:sqlite";
const database = new DatabaseSync(":memory:");

// Execute SQL statements from strings.
database.exec(`
  CREATE TABLE IF NOT EXISTS data (
    key INTEGER PRIMARY KEY,
    value TEXT
  ) STRICT
`);

export { database };
