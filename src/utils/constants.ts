export enum Tables {
  "data" = "data",
  "words" = "words",
}

export const TableKeys = ["word", "userName"];

// const words = [
//   "хуй",
//   "волына",
//   "ствол",
//   "пенис",
//   "чл[еэ]н",
//   "пистолет кож[ае]нный",
//   "кож[ае]нный пистолет",
//   "хрен",
//   "хер",
//   "агрегат",
//   "дрын",
//   "фаллос",
//   "елда[к]?",
// ];

const myReg = {
  badWords: /ты\s([а-яА-Я\w]+)/im,
  censorWords: (words: string[]) => new RegExp(`(${words.join("|")})`, "im"),
  addWord: /\s*[,|]\s*/g,
  updWord: (word: string) => new RegExp(`[|]?${word}[|]?`, "im"),
};

export { myReg };
