import { trySqlRequest } from "../db/methods";
import { myReg } from "./constants";

export const getAllWords = () => {
  const allWords = trySqlRequest({
    tableName: "words",
    sqlReq: "getAllWords",
    method: "all",
  }) as Record<"word", string>[];
  if (Array.isArray(allWords)) {
    const stringWords = allWords
      ?.map((item) => item.word?.split(myReg.addWord))
      .flat(1);
    return stringWords;
  }
  return [];
};
