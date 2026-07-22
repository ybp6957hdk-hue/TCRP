import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../types.js";
import { PREFIX } from "../../config.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show all available commands"),

  async execute(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("📖 Help — Available Commands")
      .setDescription(
        `Slash commands start with \`/\`. Prefix commands start with \`${PREFIX}\`.`
      )
      .addFields(
        {
          name: "Slash Commands",
          value: [
            "`/ping` — Check the bot latency",
            "`/help` — Show this message",
            "`/serverinfo` — Show server information",
            "`/userinfo [user]` — Show user information",
          ].join("\n"),
        },
        {
          name: `Prefix Commands (${PREFIX})`,
          value: [
            `\`${PREFIX}ping\` — Check the bot latency`,
            `\`${PREFIX}help\` — Show this message`,
            `\`${PREFIX}say <message>\` — Make the bot say something`,
            `\`${PREFIX}avatar [user]\` — Show a user's avatar`,
          ].join("\n"),
        }
      )
      .setFooter({ text: "Use /help or !help anytime" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default command;
