import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../types.js";
import { getUser, setUser } from "../../db.js";

const COOLDOWN_MS = 5000;
const cooldowns = new Map<string, number>();
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("stock")
    .setDescription("Stock the shelf for $10–$15 (10 second job, 5 second cooldown)"),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = getUser(interaction.user.id);

    if (!user.job) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xe74c3c)
            .setTitle("❌ No Job")
            .setDescription("You don't have a job! Use `/applyjob` to get employed first."),
        ],
        ephemeral: true,
      });
      return;
    }

    const now = Date.now();
    const last = cooldowns.get(interaction.user.id) ?? 0;
    const remaining = COOLDOWN_MS - (now - last);

    if (remaining > 0) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xe74c3c)
            .setTitle("⏳ Cooldown")
            .setDescription(`Wait **${(remaining / 1000).toFixed(1)}s** before stocking again.`),
        ],
        ephemeral: true,
      });
      return;
    }

    cooldowns.set(interaction.user.id, now);
    const earned = Math.floor(Math.random() * (15 - 10 + 1)) + 10;

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0x3498db)
          .setDescription("📦 Stocking shelf...\n⏳ **10**"),
      ],
    });

    for (let i = 9; i >= 1; i--) {
      await sleep(1000);
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x3498db)
            .setDescription(`📦 Stocking shelf...\n⏳ **${i}**`),
        ],
      });
    }

    await sleep(1000);

    user.balance += earned;
    setUser(interaction.user.id, user);

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(0x2ecc71)
          .setDescription(`📦 Stocking shelf...\n✅ **Done! You earned $${earned}.**\nNew balance: **$${user.balance.toLocaleString()}**.`),
      ],
    });
  },
};

export default command;
