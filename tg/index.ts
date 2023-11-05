import { Context, Telegraf } from "telegraf";

const token: string = Bun.env.BOT_TOKEN ?? "";
const admin: string = Bun.env.ADMIN_ID ?? "";

const bot = new Telegraf(token);

bot.use((ctx, next) => {
  logger(ctx);
  next();
});

bot.launch();

// LOGGER
function logger(ctx: Context) {
  const adminId = admin;

  console.log(ctx);

  const user = {
    username: ctx.message?.from.username,
    firstName: ctx.message?.from.first_name,
    languageCode: ctx.message?.from.language_code,
    id: ctx.message?.from.id,
    premium: ctx.from?.is_premium,
    messageType: ctx.updateType,
  };

  bot.telegram.sendMessage(adminId, user.username ?? "");
}
