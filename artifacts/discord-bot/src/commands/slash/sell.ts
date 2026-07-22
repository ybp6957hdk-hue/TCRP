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

interface Sellable {
  id: string;
  name: string;
  emoji: string;
  min: number;
  max: number;
}

const SELLABLES: Sellable[] = [
  { id: "weed",    name: "Weed",    emoji: "🌿", min: 215, max: 350 },
  { id: "cocaine", name: "Cocaine", emoji: "❄️", min: 515, max: 650 },
];

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("sell")
    .setDescription("Sell weed or cocaine from your inventory"),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = getUser(interaction.user.id);

    // Only show items the user actually has
    const available = SELLABLES.filter((s) => user.inventory.includes(s.id));

    if (available.length === 0) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xe74c3c)
            .setTitle("❌ Nothing to Sell")
            .setDescription("You don't have any weed or cocaine in your inventory."),
        ],
        ephemeral: true,
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0xf39c12)
      .setTitle("💵 Sell Drugs")
      .setDescription(`Your balance: **$${user.balance.toLocaleString()}**\n\nSelect what you want to sell.`)
      .addFields(
        available.map((s) => ({
          name: `${s.emoji} ${s.name}`,
          value: `Sells for $${s.min}–$${s.max}`,
          inline: true,
        }))
      )
      .setFooter({ text: "You have 30 seconds to choose." });

    const menu = new StringSelectMenuBuilder()
      .setCustomId("sell_drug")
      .setPlaceholder("Choose what to sell…")
      .addOptions(
        available.map((s) => ({
          label: `${s.name} ($${s.min}–$${s.max})`,
          value: s.id,
          emoji: s.emoji,
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

      const sellable = SELLABLES.find((s) => s.id === selection.values[0])!;
      const fresh = getUser(interaction.user.id);

      const idx = fresh.inventory.indexOf(sellable.id);
      if (idx === -1) {
        await selection.update({
          embeds: [
            new EmbedBuilder()
              .setColor(0xe74c3c)
              .setTitle("❌ Item Not Found")
              .setDescription(`You no longer have any ${sellable.name} to sell.`),
          ],
          components: [],
        });
        return;
      }

      const earned = Math.floor(Math.random() * (sellable.max - sellable.min + 1)) + sellable.min;
      fresh.inventory.splice(idx, 1);
      fresh.balance += earned;
      setUser(interaction.user.id, fresh);

      await selection.update({
        embeds: [
          new EmbedBuilder()
            .setColor(0x2ecc71)
            .setTitle("✅ Sold!")
            .setDescription(
              `You sold **1 ${sellable.emoji} ${sellable.name}** for **$${earned.toLocaleString()}**.\nNew balance: **$${fresh.balance.toLocaleString()}**.`
            )
            .setTimestamp(),
        ],
        components: [],
      });
    } catch {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x95a5a6)
            .setDescription("Sale cancelled — you took too long to choose."),
        ],
        components: [],
      });
    }
  },
};

export default command;
