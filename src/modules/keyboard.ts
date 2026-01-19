import { Api, Bot, Context, InlineKeyboard, RawApi } from "grammy";

const inlineKeyboard = new InlineKeyboard()
  .text("Добавить слово", "tooltip")
  .text("Показать слова", "alert")
  .text("Таблица", "stay")
  .text("Моя статистика", "next");

export const keyboardMsg = (bot: Bot<Context, Api<RawApi>>) => {
  bot.command("keybord", async (ctx) => {
    await ctx.reply("Держи клаву", {
      reply_markup: inlineKeyboard,
    });
  });

  bot.callbackQuery("tooltip", async (ctx) => {
    await ctx.answerCallbackQuery({
      text: "You were curious, indeed!",
    });
  });

  bot.callbackQuery("alert", async (ctx) => {
    await ctx.answerCallbackQuery({
      text: "You were curious, indeed!",
      show_alert: true,
    });
  });

  //   bot.on("callback_query:data", async (ctx) => {
  //     console.log("Unknown button event with payload", ctx.callbackQuery.data);
  //     await ctx.answerCallbackQuery(); // remove loading animation
  //     ctx.reply(
  //       "Ну ок, нажал молодец, но я занят, и вообще это общий обработчик! Можешь не клацать сюда больше!!! Понял???"
  //     );
  //   });

  const btnTable = [
    [["Начать", "/help"], ["Добавить Вопрос"], ["Добавить Вопрос"]],
    [["Помощь", "/help"], ["Добавить Вопрос"], ["Добавить Вопрос"]],
    [["Меню", "/help"], ["Добавить Вопрос"], ["Добавить Вопрос"]],
  ];

  const keybordTable = btnTable.map((row) =>
    row.map(([label, data]) => InlineKeyboard.text(label, data))
  );

  const keyboard2 = InlineKeyboard.from(keybordTable);

  bot.command("keybord2", async (ctx) => {
    await ctx.reply("Держи клаву", {
      reply_markup: keyboard2,
    });
  });

  bot.command("help", (ctx) => {
    ctx.reply("/add_question");
  });
};
