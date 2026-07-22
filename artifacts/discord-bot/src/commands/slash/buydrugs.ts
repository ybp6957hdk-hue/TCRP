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

interface Drug {
  id: string;
  name: string;
  price: number;
  emoji: string;
}

const DRUGS: Drug[] = [
  { id: "weed",    name: "Weed",    price: 200, emoji: "🌿" },
  { id: "cocaine", name: "Cocaine", price: 500, emoji: "❄️" },
];

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("buydrugs")
    .setDescription("Purchase drugs from the street"),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = getUser(interaction.user.id);

    const shopEmbed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle("🚬 Drug Market")
      .setDescription(`Your balance: **$${user.balance.toLocaleString()}**\n\nSelect what you want to buy.`)
      .addFields(
        DRUGS.map((d) => ({
          name: `${d.emoji} ${d.name} — $${d.price.toLocaleString()}`,
          value: "\u200b",
          inline: true,
        }))
      )
      .setFooter({ text: "You have 30 seconds to choose." });

    const menu = new StringSelectMenuBuilder()
      .setCustomId("drugs_buy")
      .setPlaceholder("Choose what to buy…")
      .addOptions(
        DRUGS.map((d) => ({
          label: `${d.name} — $${d.price.toLocaleString()}`,
          value: d.id,
          emoji: d.emoji,
        }))
      );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);

    const response = await interaction.reply({ embeds: [shopEmbed], components: [row] });

    try {
      const selection: StringSelectMenuInteraction = await response.awaitMessageComponent({
        componentType: ComponentType.StringSelect,
        filter: (i) => i.user.id === interaction.user.id,
        time: 30_000,
      });

      const drug = DRUGS.find((d) => d.id === selection.values[0])!;
      const fresh = getUser(interaction.user.id);

      if (fresh.balance < drug.price) {
        const failEmbed = new EmbedBuilder()
          .setColor(0xe74c3c)
          .setTitle("❌ Insufficient Funds")
          .setDescription(
            `You need **$${drug.price.toLocaleString()}** to buy **${drug.name}**.\nYou only have **$${fresh.balance.toLocaleString()}**.`
          );
        await selection.update({ embeds: [failEmbed], components: [] });
        return;
      }

      fresh.balance -= drug.price;
      fresh.inventory.push(drug.id);
      setUser(interaction.user.id, fresh);

      const successEmbed = new EmbedBuilder()
        .setColor(0x2ecc71)
        .setTitle("✅ Purchase Successful!")
        .setDescription(
          `You bought **${drug.emoji} ${drug.name}** for **$${drug.price.toLocaleString()}**.\nRemaining balance: **$${fresh.balance.toLocaleString()}**.`
        )
        .setTimestamp();

      await selection.update({ embeds: [successEmbed], components: [] });
    } catch {
      const timeoutEmbed = new EmbedBuilder()
        .setColor(0x95a5a6)
        .setDescription("Purchase cancelled — you took too long to choose.");
      await interaction.editReply({ embeds: [timeoutEmbed], components: [] });
    }
  },
};

export default command;
