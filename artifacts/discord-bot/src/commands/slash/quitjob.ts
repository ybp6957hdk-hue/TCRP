import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../types.js";
import { getUser, setUser } from "../../db.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("quitjob")
    .setDescription("Quit your current job"),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = getUser(interaction.user.id);

    if (!user.job) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xe74c3c)
            .setTitle("❌ No Job")
            .setDescription("You don't have a job to quit!"),
        ],
        ephemeral: true,
      });
      return;
    }

    const previousJob = user.job;
    user.job = null;
    setUser(interaction.user.id, user);

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0xf39c12)
          .setTitle("👋 Quit Job")
          .setDescription(`You quit your job as **${previousJob}**.\nUse \`/applyjob\` to find a new one.`)
          .setTimestamp(),
      ],
    });
  },
};

export default command;
