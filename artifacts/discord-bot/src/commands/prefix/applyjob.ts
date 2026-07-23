import { Message } from "discord.js";
import { PrefixCommand } from "../../types.js";
import { getUser, setUser } from "../../db.js";

const JOBS = [
  { id: "gas_station_worker",    label: "Gas Station Worker",    emoji: "⛽" },
  { id: "store_worker",          label: "Store Worker",          emoji: "🏪" },
  { id: "clothing_store_worker", label: "Clothing Store Worker", emoji: "👔" },
];

const command: PrefixCommand = {
  name: "applyjob",
  aliases: ["apply"],
  description: "Apply for a job",
  usage: "applyjob <1|2|3>",

  async execute(message: Message, args: string[]) {
    const user = getUser(message.author.id);

    if (user.job) {
      await message.reply(`❌ You are already working as a **${user.job}**. You must quit first.`);
      return;
    }

    const jobList = JOBS.map((j, i) => `**${i + 1}.** ${j.emoji} ${j.label}`).join("\n");

    if (!args[0]) {
      await message.reply(
        `💼 **Available Jobs:**\n${jobList}\n\nReply with \`!applyjob <number>\` to apply.\nExample: \`!applyjob 1\``
      );
      return;
    }

    const index = parseInt(args[0]) - 1;
    if (isNaN(index) || index < 0 || index >= JOBS.length) {
      await message.reply(`❌ Invalid choice. Pick a number between 1 and ${JOBS.length}.`);
      return;
    }

    const chosen = JOBS[index];
    user.job = chosen.label;
    setUser(message.author.id, user);

    await message.reply(`✅ You are now employed as a **${chosen.emoji} ${chosen.label}**!\nUse \`!stock\` to start earning money.`);
  },
};

export default command;
