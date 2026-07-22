import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types.js";
import { getUser, setUser } from "../../db.js";

const DAILY_AMOUNT = 500;
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Claim your daily 500 coins"),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = getUser(interaction.user.id);
    const now = Date.now();

    if (user.lastDaily && now - user.lastDaily < COOLDOWN_MS) {
      const remaining = COOLDOWN_MS - (now - user.lastDaily);
      const hours = Math.floor(remaining / 3600000);
      const minutes = Math.floor((remaining % 3600000) / 60000);

      const embed = new EmbedBuilder()
        .setColor(0xe74c3c)
        .setTitle("⏰ Daily Already Claimed")
        .setDescription(`You already claimed today's reward.\nCome back in **${hours}h ${minutes}m**.`);

      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    user.balance += DAILY_AMOUNT;
    user.lastDaily = now;
    setUser(interaction.user.id, user);

    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle("✅ Daily Reward Claimed!")
      .setDescription(`You received **${DAILY_AMOUNT} coins**!\nNew balance: **${user.balance.toLocaleString()} coins**`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default command;
