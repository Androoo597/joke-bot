import { InlineKeyboard } from "grammy";

export enum Tables {
  "data" = "data",
  "words" = "words",
  "admins" = "admins",
}

const everyFriday = "59 59 17 * * 5";
const everyMonday = "0 0 0 * * 1";

const prizeSmiles = ["🥇", "🥈", "🥉", "🍻"];

const RU_EN_MAP_SYMBOLS = new Map([
  ["а", "(a|а)"],
  ["б", "(b|6|б)"],
  ["в", "(v|B|w|в)"],
  ["г", "(g|г)"],
  ["д", "(d|д)"],
  ["е", "(e|е|ё)"],
  ["ё", "(e|е|ё)"],
  ["ж", "(j|ж)"],
  ["з", "(3|z)"],
  ["и", "(i|u|и)"],
  ["й", "(i|й)"],
  ["к", "(c|k|ck|к)"],
  ["л", "(l|л)"],
  ["м", "(m|м)"],
  ["н", "(n|h|н)"],
  ["о", "(o|0|о)"],
  ["п", "(p|п)"],
  ["р", "(r|p|р)"],
  ["с", "(s|c|с)"],
  ["т", "(t|т)"],
  ["у", "(y|u|у)"],
  ["ф", "(f|ф)"],
  ["х", "(h|x|х)"],
  ["ц", "(c|ц|tc)"],
  ["ч", "(ch|ч|tch)"],
  ["ш", "(w|ш)"],
  ["щ", "(w|щ)"],
  ["ь", "(b|ь)"],
  ["ы", "(bi|ы)"],
  ["э", "(3|э)"],
  ["ю", "(u|you|ю)"],
  ["я", "(ya|я)"],
  [" ", "(\\s|_)"],
  ["(", "("],
  [")", ")"],
  ["|", "|"],
  ["-", "-"],
]);

const myReg = {
  badWords: /ты\s([а-яА-Я\w]+)/im,
  censorWords: (words: string[]) => {
    const aroundWords = words.map((word) => `[\\s]?(${word})[^а-яa-z]`);
    return new RegExp(aroundWords.join("|"), "gim");
  },
  makeRuEnReg: (words: string[]) => {
    const RUEN = words.map((word) =>
      word
        .split("")
        .map((char) => RU_EN_MAP_SYMBOLS.get(char))
        .join("[^a-zа-я]{0,10}"),
    );
    const aroundWords = RUEN.map((word) => `[\\s]?(${word})[^а-яa-z]`);
    return new RegExp(aroundWords.join("|"), "gim");
  },
  addWord: /\s*[,]\s*/g,
  yesNo: /Y|YES/im,
  splitter: /,\s/,
  matcherAsk: /(\([?,\s]+\))/,
};

const listMyComands = [
  { command: "start", description: "Старт" },
  { command: "help", description: "Помощь" },
  { command: "menu", description: "Меню" },
  { command: "reset_all", description: "Заводские настройки" },
  { command: "reset_words", description: "Удалить все слова" },
  { command: "reset_stat", description: "Отчистить статистику" },
];

const userMenuKeyboard = new InlineKeyboard()
  .text("Таблица", "result")
  .text("Моя статистика", "ownStatistic");

const menuKeyboard = new InlineKeyboard()
  .text("Добавить слово", "addWord")
  .text("Удалить слово", "delWord")
  .text("Отмена ввода", "escEnter")
  .row()
  .text("Показать слова", "alertWords")
  .text("Таблица", "result")
  .text("Моя статистика", "ownStatistic");

const phrases = {
  hello: `Добрый день! Вас приветсвует DICK-BOT. Вы можете добавлять слова для подсчета статистики использования нецензурных слов из сообщений в чате.
      
      Чтобы вызвать Меню используйте команду /menu 
      
      Чтобы вызвать Справку используйте команду /help`,
  help: `Кнопки:\n\nДобавить слово - позволяет добавить как одно слово, так и несколько через запятую\n\nУдалить слово - позволяет удалить как одно слово, так и несколько слов через запятую\n\nОтмена ввода - позволяет отменить добавление/удаление слова\n\nПоказать слова - выводит список ключевых(добавленных) слов\n\nТаблица - выводит итоговую таблицу для всех участников чата\n\nМоя статистика - выводит вашу детализированную статистику по использованию ключевых слов

Команды:

      /start - начало работы бота

      /menu - выводит меню для работы с ботом

      /reset_words -  удаляет все ключевые слова

      /reset_stat - удаляет всю статистику

      /reset_all - полностью удаляет статистику и ключевые слова
      `,

  userHelp: `Чтобы вызвать Меню используйте команду /menu\n\nЧтобы вызвать Справку используйте команду /help\n\nКнопки:\n\nТаблица - выводит итоговую таблицу для всех участников чата\n\nМоя статистика - выводит вашу детализированную статистику по использованию ключевых слов`,
};

export {
  myReg,
  prizeSmiles,
  phrases,
  menuKeyboard,
  userMenuKeyboard,
  listMyComands,
  everyMonday,
  everyFriday,
};
