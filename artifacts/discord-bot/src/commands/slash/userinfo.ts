import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../types.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Display information about a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to look up (defaults to you)")
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const target =
      interaction.options.getUser("user") ?? interaction.user;
    const member = interaction.guild?.members.cache.get(target.id) as
      | GuildMember
      | undefined;

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(target.tag)
      .setThumbnail(target.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: "🆔 ID", value: target.id, inline: true },
        { name: "🤖 Bot", value: target.bot ? "Yes" : "No", inline: true },
        {
          name: "📅 Account Created",
          value: `<t:${Math.floor(target.createdTimestamp / 1000)}:D>`,
          inline: true,
        }
      );

    if (member) {
      embed.addFields(
        {
          name: "📥 Joined Server",
          value: member.joinedAt
            ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:D>`
            : "Unknown",
          inline: true,
        },
        {
          name: "🎭 Top Role",
          value: member.roles.highest.toString(),
          inline: true,
        },
        {
          name: "📛 Nickname",
          value: member.nickname ?? "None",
          inline: true,
        }
      );
    }

    embed.setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};

export default command;
