import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
} from "discord.js";
import { SlashCommand } from "../../types.js";
import { getUser, setUser } from "../../db.js";

const JOBS = [
  { id: "gas_station_worker",    label: "Gas Station Worker",    emoji: "⛽" },
  { id: "store_worker",          label: "Store Worker",          emoji: "🏪" },
  { id: "clothing_store_worker", label: "Clothing Store Worker", emoji: "👔" },
];

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("applyjob")
    .setDescription("Apply for a job"),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = getUser(interaction.user.id);

    if (user.job) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xe74c3c)
            .setTitle("❌ Already Employed")
            .setDescription(`You are already working as a **${user.job}**.\nYou must quit your current job before applying for a new one.`),
        ],
        ephemeral: true,
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle("💼 Job Application")
      .setDescription("Select a job to apply for below.")
      .addFields(
        JOBS.map((j) => ({
          name: `${j.emoji} ${j.label}`,
          value: "\u200b",
          inline: true,
        }))
      )
      .setFooter({ text: "You have 30 seconds to choose." });

    const menu = new StringSelectMenuBuilder()
      .setCustomId("apply_job")
      .setPlaceholder("Choose a job…")
      .addOptions(
        JOBS.map((j) => ({
          label: j.label,
          value: j.id,
          emoji: j.emoji,
        }))
      );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);
    const response = await interaction.reply({ embeds: [embed], components: [row] });

    try {
      const selection: StringSelectMenuInteraction = await response.awaitMessageComponent({
        componentType: ComponentType.StringSelect,
        filter: (i) => i.user.id === interaction.user.id,
        time: 30_000,
      });

      const chosen = JOBS.find((j) => j.id === selection.values[0])!;
      const fresh = getUser(interaction.user.id);

      if (fresh.job) {
        await selection.update({
          embeds: [
            new EmbedBuilder()
              .setColor(0xe74c3c)
              .setTitle("❌ Already Employed")
              .setDescription(`You are already working as a **${fresh.job}**.`),
          ],
          components: [],
        });
        return;
      }

      fresh.job = chosen.label;
      setUser(interaction.user.id, fresh);

      await selection.update({
        embeds: [
          new EmbedBuilder()
            .setColor(0x2ecc71)
            .setTitle("✅ Application Accepted!")
            .setDescription(`You are now employed as a **${chosen.emoji} ${chosen.label}**!\nUse \`!stock\` to start earning money.`)
            .setTimestamp(),
        ],
        components: [],
      });
    } catch {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x95a5a6)
            .setDescription("Application cancelled — you took too long to choose."),
        ],
        components: [],
      });
    }
  },
};

export default command;
