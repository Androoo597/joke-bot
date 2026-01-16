import { Api, Bot, Context, RawApi } from "grammy";
import { Menu } from "@grammyjs/menu";

let toggle = false;

const menu = new Menu("my-menu-identifier")
  .text(
    (ctx) => (ctx.from && toggle ? "^" : "V"),
    (ctx) => {
      toggle = !toggle;
      ctx.menu.update(); // update the menu!
    }
  )
  .row()
  .text("<", (ctx) => ctx.reply("Left!"))
  .text(">", (ctx) => ctx.reply("Right!"))
  .row()
  .text("v", (ctx) => ctx.reply("Backwards!"));

export const menuBot = (bot: Bot<Context, Api<RawApi>>) => {
  // Make it interactive.
  bot.use(menu);

  bot.command("menu", async (ctx) => {
    // Send the menu.
    await ctx.reply("Check out this menu:", { reply_markup: menu });
  });
};
