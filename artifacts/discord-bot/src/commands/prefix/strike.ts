import { Message } from "discord.js";
import { PrefixCommand } from "../../types.js";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const command: PrefixCommand = {
  name: "strike",
  description: "Attempt a strike — 40% chance of success, 20 second countdown",
  usage: "strike",

  async execute(message: Message) {
    const success = Math.random() < 0.4;

    const reply = await message.reply("🚗 Striking car...\n⏳ **20**");

    for (let i = 19; i >= 1; i--) {
      await sleep(1000);
      await reply.edit(`🚗 Striking car...\n⏳ **${i}**`);
    }

    await sleep(1000);

    if (success) {
      await reply.edit("🚗 Striking car...\n✅ **Strike successful!**");
    } else {
      await reply.edit("🚗 Striking car...\n❌ **Strike failed!**");
    }
  },
};

export default command;
