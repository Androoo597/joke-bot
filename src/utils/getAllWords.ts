import { trySqlRequest } from "../db/methods";
import { SqlMethodKeys, SqlMethods, Tables } from "../db/utils";
import { myReg } from "./constants";

export const getAllWords = () => {
  const allWords = trySqlRequest({
    tableName: Tables.words,
    sqlReq: SqlMethodKeys.getAllWords,
    method: SqlMethods.all,
  }) as Record<"word", string>[];
  if (Array.isArray(allWords)) {
    const stringWords = allWords
      ?.map((item) => item.word?.split(myReg.addWord))
      .flat(1);
    return stringWords;
  }
  return [];
};
