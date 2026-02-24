import { getAllWords } from "../../utils/getAllWords";
import { useState } from "../reactFeatures/useState";
import { trySqlRequest } from "../../db/methods";
import { myReg } from "../../utils/constants";
import {
  useBotRunCronJobs,
  useCallbackQueries,
  useCensorCommands,
  useChengeRoleAdmin,
  useMessageHandler,
} from ".";
export interface TargetObj {
  regWords: string[];
  dymanicReg: RegExp;
}
export type Admins = (string | number | undefined)[][];
export const [inputMode, setInputMode] = useState<string>("");
export const [regWords, setRegWords] = useState<string[]>(getAllWords());
export const [tableState] = useState<Record<string, "opened" | "closed">>({});

const adminsSql = (
  trySqlRequest({
    method: "all",
    sqlReq: "getAdmins",
    tableName: "admins",
  }) as Record<string, string>[]
)?.map((admin) => Object.values(admin));

export const [admins, setAdmins] = useState<Admins>(adminsSql);

const targetObj = {
  regWords: getAllWords(),
  dymanicReg: myReg.makeRuEnReg(regWords()),
};

const proxyHandler = {
  get(target: typeof targetObj) {
    if (target.regWords.length === regWords().length) {
      return target.dymanicReg;
    } else {
      this._set(target, null, myReg.makeRuEnReg(regWords()));
      return target.dymanicReg;
    }
  },
  _set(target: typeof targetObj, _: null, value: RegExp) {
    target.regWords = regWords();
    target.dymanicReg = value;
    return true;
  },
};

export const proxyReg = new Proxy(targetObj, proxyHandler);

export const initCensorBot = () => {
  useChengeRoleAdmin();
  useCensorCommands();
  useCallbackQueries();
  useMessageHandler();
  useBotRunCronJobs();
};
