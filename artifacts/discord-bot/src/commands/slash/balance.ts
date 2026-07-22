import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types.js";
import { getUser } from "../../db.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your coin balance")
    .addUserOption((o) =>
      o.setName("user").setDescription("Check another user's balance").setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getUser("user") ?? interaction.user;
    const user = getUser(target.id);

    const embed = new EmbedBuilder()
      .setColor(0xf1c40f)
      .setTitle(`💰 ${target.username}'s Balance`)
      .setDescription(`**${user.balance.toLocaleString()} coins**`)
      .setThumbnail(target.displayAvatarURL())
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default command;
