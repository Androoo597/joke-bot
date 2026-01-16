import { database } from "./createDB";

const insert = database.prepare("INSERT INTO data (key, value) VALUES (?, ?)");
const query = database.prepare("SELECT * FROM data ORDER BY key");

export { insert, query };
