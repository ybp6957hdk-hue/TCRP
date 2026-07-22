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
import { ITEMS } from "../../items.js";
import { getUser, setUser } from "../../db.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription("Browse the shop and purchase items"),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = getUser(interaction.user.id);

    // Build shop embed
    const shopEmbed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("🛒 Shop")
      .setDescription(`Your balance: **$${user.balance.toLocaleString()}**\n\nSelect an item from the menu below to purchase it.`)
      .addFields(
        ITEMS.map((item) => ({
          name: `${item.emoji} ${item.name} — $${item.price.toLocaleString()}`,
          value: item.description,
          inline: true,
        }))
      )
      .setFooter({ text: "You have 30 seconds to choose." });

    // Build select menu
    const menu = new StringSelectMenuBuilder()
      .setCustomId("shop_buy")
      .setPlaceholder("Choose an item to buy…")
      .addOptions(
        ITEMS.map((item) => ({
          label: `${item.name} — $${item.price.toLocaleString()}`,
          description: item.description,
          value: item.id,
          emoji: item.emoji,
        }))
      );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);

    const response = await interaction.reply({
      embeds: [shopEmbed],
      components: [row],
    });

    // Wait for the user who ran the command to select
    try {
      const selection: StringSelectMenuInteraction = await response.awaitMessageComponent({
        componentType: ComponentType.StringSelect,
        filter: (i) => i.user.id === interaction.user.id,
        time: 30_000,
      });

      const itemId = selection.values[0];
      const item = ITEMS.find((i) => i.id === itemId)!;

      // Re-fetch in case balance changed
      const fresh = getUser(interaction.user.id);

      if (fresh.balance < item.price) {
        const failEmbed = new EmbedBuilder()
          .setColor(0xe74c3c)
          .setTitle("❌ Insufficient Funds")
          .setDescription(
            `You need **$${item.price.toLocaleString()}** to buy **${item.name}**.\nYou only have **$${fresh.balance.toLocaleString()}**.`
          );
        await selection.update({ embeds: [failEmbed], components: [] });
        return;
      }

      // Deduct and give item
      fresh.balance -= item.price;
      fresh.inventory.push(item.id);
      setUser(interaction.user.id, fresh);

      const successEmbed = new EmbedBuilder()
        .setColor(0x2ecc71)
        .setTitle("✅ Purchase Successful!")
        .setDescription(
          `You bought **${item.emoji} ${item.name}** for **$${item.price.toLocaleString()}**.\nRemaining balance: **$${fresh.balance.toLocaleString()}**.`
        )
        .setTimestamp();

      await selection.update({ embeds: [successEmbed], components: [] });
    } catch {
      // Timed out
      const timeoutEmbed = new EmbedBuilder()
        .setColor(0x95a5a6)
        .setTitle("🛒 Shop")
        .setDescription("Purchase cancelled — you took too long to choose.");
      await interaction.editReply({ embeds: [timeoutEmbed], components: [] });
    }
  },
};

export default command;
