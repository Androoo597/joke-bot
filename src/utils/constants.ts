import { InlineKeyboard } from "grammy";

export enum Tables {
  "data" = "data",
  "words" = "words",
  "admins" = "admins",
}

const prizeSmiles = ["🥇", "🥈", "🥉", "🍻"];

const myReg = {
  badWords: /ты\s([а-яА-Я\w]+)/im,
  censorWords: (words: string[]) => {
    const aroundWords = words.map((word) => `[\\s]?(${word})[^а-яa-z]`);
    return new RegExp(aroundWords.join("|"), "gim");
  },
  addWord: /\s*[,|]\s*/g,
  yesNo: /Y|YES/im,
  splitter: /,\s|[|]\s/,
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
  .text("Показать слова", "alertWords")
  .row()
  .text("Таблица", "result")
  .text("Моя статистика", "ownStatistic");

const phrases = {
  hello: `Добрый день! Вас приветсвует DICK-BOT. Вы можете добавлять слова для подсчета статистики использования нецензурных слов из сообщений в чате.
      
      Чтобы вызвать Меню используйте команду /menu 
      
      Чтобы вызвать Справку используйте команду /help`,
  help: `Кнопки:\n\nДобавить слово - позволяет добавить как одно слово, так и несколько через запятую\n\nУдалить слово - позволяет удалить как одно слово, так и несколько слов через запятую\n\nПоказать слова - выводит список ключевых(добавленных) слов\n\nТаблица - выводит итоговую таблицу для всех участников чата\n\nМоя статистика - выводит вашу детализированную статистику по использованию ключевых слов

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
};
