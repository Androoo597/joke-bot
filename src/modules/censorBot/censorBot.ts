import { Api, Bot, Context, RawApi } from "grammy";
import { myReg } from "../../utils/constants";
import { getAllWords } from "../../utils/getAllWords";
import { useCensorCommands } from "./commands";
import { useCallbackQueries } from "./callbackQueries";
import { useMessageHandler } from "./messageHandler";
import { useState } from "../reactFeatures/useState";

const [inputMode, setInputMode] = useState<string>("");
const [regWords, setRegWords] = useState<string[]>(getAllWords());

const targetObj = {
  regWords: getAllWords(),
  dymanicReg: myReg.censorWords(regWords()),
};

export type TargetObj = typeof targetObj;

const proxyHandler = {
  get(target: typeof targetObj) {
    if (target.regWords === regWords()) {
      return target.dymanicReg;
    } else {
      this._set(target, null, myReg.censorWords(regWords()));
      return target.dymanicReg;
    }
  },
  _set(target: typeof targetObj, _: null, value: RegExp) {
    target.regWords = regWords();
    target.dymanicReg = value;
    return true;
  },
};

const proxyReg = new Proxy(targetObj, proxyHandler);

const obg = ["value1", "value2"];

const entr = Object.entries(obg);
console.log("entr ==> ", entr);
const obj = Object.fromEntries(Object.entries(obg));
console.log("obj ==> ", obj);

const useMemo = <V, T>(fn: () => V, depth: T[]) => {
  const targetObj = {
    value: fn(),
    ...Object.fromEntries(Object.entries(depth)),
  };
  type TargetObj = Record<string | number, T | V>;

  const proxyHandler = {
    get(target: TargetObj) {
      if (depth.every((someDepth, index) => someDepth === target[index])) {
        return target.value;
      } else {
        this._set(target, null, fn());
        return target.value;
      }
    },
    _set(target: TargetObj, _: null, newValue: V) {
      target.value = newValue;
      depth.forEach((someDepth, index) => (target[index] = someDepth));

      return true;
    },
  };

  const proxyReg = new Proxy(targetObj, proxyHandler);

  return proxyReg;
};

const proxy = useMemo<RegExp, string[]>(
  () => myReg.censorWords(regWords()),
  regWords(),
);
console.log("proxy ==> ", proxy);

export const censorBot = (bot: Bot<Context, Api<RawApi>>) => {
  useCensorCommands(bot, setInputMode);
  useCallbackQueries(bot, setInputMode, regWords);
  useMessageHandler(bot, setInputMode, inputMode, setRegWords, proxy);
};
