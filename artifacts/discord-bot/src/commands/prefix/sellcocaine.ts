import { Message } from "discord.js";
import { PrefixCommand } from "../../types.js";
import { getUser, setUser } from "../../db.js";

const command: PrefixCommand = {
  name: "sellcocaine",
  aliases: ["sellcoke"],
  description: "Sell 1 cocaine from your inventory for $515–$650",
  usage: "sellcocaine",

  async execute(message: Message) {
    const user = getUser(message.author.id);

    const idx = user.inventory.indexOf("cocaine");
    if (idx === -1) {
      await message.reply("❌ You don't have any cocaine to sell.");
      return;
    }

    const earned = Math.floor(Math.random() * (650 - 515 + 1)) + 515;
    user.inventory.splice(idx, 1);
    user.balance += earned;
    setUser(message.author.id, user);

    await message.reply(
      `✅ You sold **1 ❄️ Cocaine** for **$${earned.toLocaleString()}**!\nNew balance: **$${user.balance.toLocaleString()}**.`
    );
  },
};

export default command;
