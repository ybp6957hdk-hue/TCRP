import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../types.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Display information about this server"),

  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild) {
      await interaction.reply({
        content: "This command can only be used in a server.",
        ephemeral: true,
      });
      return;
    }

    const owner = await guild.fetchOwner();
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(guild.name)
      .setThumbnail(guild.iconURL())
      .addFields(
        { name: "👑 Owner", value: owner.user.tag, inline: true },
        { name: "👥 Members", value: `${guild.memberCount}`, inline: true },
        {
          name: "📅 Created",
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`,
          inline: true,
        },
        {
          name: "💬 Channels",
          value: `${guild.channels.cache.size}`,
          inline: true,
        },
        {
          name: "🎭 Roles",
          value: `${guild.roles.cache.size}`,
          inline: true,
        },
        {
          name: "😄 Emojis",
          value: `${guild.emojis.cache.size}`,
          inline: true,
        }
      )
      .setFooter({ text: `ID: ${guild.id}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default command;
