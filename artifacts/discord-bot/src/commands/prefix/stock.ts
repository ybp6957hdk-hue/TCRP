import { Message } from "discord.js";
import { PrefixCommand } from "../../types.js";
import { getUser, setUser } from "../../db.js";

const COOLDOWN_MS = 5000;
const cooldowns = new Map<string, number>();

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const command: PrefixCommand = {
  name: "stock",
  description: "Stock the shelf for $10–$15 (10 second job, 5 second cooldown)",
  usage: "stock",

  async execute(message: Message) {
    const user = getUser(message.author.id);

    if (!user.job) {
      await message.reply("❌ You don't have a job! Use `/applyjob` to get employed first.");
      return;
    }

    const now = Date.now();
    const last = cooldowns.get(message.author.id) ?? 0;
    const remaining = COOLDOWN_MS - (now - last);

    if (remaining > 0) {
      await message.reply(`⏳ You're on cooldown! Wait **${(remaining / 1000).toFixed(1)}s** before stocking again.`);
      return;
    }

    cooldowns.set(message.author.id, now);

    const earned = Math.floor(Math.random() * (15 - 10 + 1)) + 10;
    const reply = await message.reply("📦 Stocking shelf...\n⏳ **10**");

    for (let i = 9; i >= 1; i--) {
      await sleep(1000);
      await reply.edit(`📦 Stocking shelf...\n⏳ **${i}**`);
    }

    await sleep(1000);

    user.balance += earned;
    setUser(message.author.id, user);

    await reply.edit(
      `📦 Stocking shelf...\n✅ **Done! You earned $${earned}.**\nNew balance: **$${user.balance.toLocaleString()}**.`
    );
  },
};

export default command;
