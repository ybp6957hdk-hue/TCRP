import { Message } from "discord.js";
import { PrefixCommand } from "../../types.js";

const command: PrefixCommand = {
  name: "strike",
  description: "Attempt a strike — 40% chance of success",
  usage: "strike",

  async execute(message: Message) {
    const success = Math.random() < 0.4;
    await message.reply(success ? "✅ Strike successful!" : "❌ Strike failed!");
  },
};

export default command;
