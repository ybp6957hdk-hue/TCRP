import { Message } from "discord.js";
import { PrefixCommand } from "../../types.js";
import { getUser, setUser } from "../../db.js";

const command: PrefixCommand = {
  name: "sellweed",
  description: "Sell 1 weed from your inventory for $215–$350",
  usage: "sellweed",

  async execute(message: Message) {
    const user = getUser(message.author.id);

    const idx = user.inventory.indexOf("weed");
    if (idx === -1) {
      await message.reply("❌ You don't have any weed to sell.");
      return;
    }

    const earned = Math.floor(Math.random() * (350 - 215 + 1)) + 215;
    user.inventory.splice(idx, 1);
    user.balance += earned;
    setUser(message.author.id, user);

    await message.reply(
      `✅ You sold **1 🌿 Weed** for **$${earned.toLocaleString()}**!\nNew balance: **$${user.balance.toLocaleString()}**.`
    );
  },
};

export default command;
