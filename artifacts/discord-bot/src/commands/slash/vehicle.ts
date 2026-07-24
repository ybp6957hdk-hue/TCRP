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
import { VEHICLES } from "../../items.js";
import { getUser, setUser } from "../../db.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("vehicles")
    .setDescription("Browse the vehicle dealership and buy a ride"),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = getUser(interaction.user.id);

    const dealerEmbed = new EmbedBuilder()
      .setColor(0xe67e22)
      .setTitle("🚘 Vehicle Dealership")
      .setDescription(
        `Your balance: **$${user.balance.toLocaleString()}**\n\nSelect a vehicle from the menu below to purchase it.`
      )
      .addFields(
        VEHICLES.map((v) => ({
          name: `${v.emoji} ${v.name} — $${v.price.toLocaleString()}`,
          value: v.description,
          inline: true,
        }))
      )
      .setFooter({ text: "You have 30 seconds to choose." });

    const menu = new StringSelectMenuBuilder()
      .setCustomId("vehicles_buy")
      .setPlaceholder("Choose a vehicle to buy…")
      .addOptions(
        VEHICLES.map((v) => ({
          label: `${v.name} — $${v.price.toLocaleString()}`,
          description: v.description,
          value: v.id,
          emoji: v.emoji,
        }))
      );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);

    const response = await interaction.reply({
      embeds: [dealerEmbed],
      components: [row],
    });

    try {
      const selection: StringSelectMenuInteraction = await response.awaitMessageComponent({
        componentType: ComponentType.StringSelect,
        filter: (i) => i.user.id === interaction.user.id,
        time: 30_000,
      });

      const vehicleId = selection.values[0];
      const vehicle = VEHICLES.find((v) => v.id === vehicleId)!;

      const fresh = getUser(interaction.user.id);

      if (fresh.balance < vehicle.price) {
        await selection.update({
          embeds: [
            new EmbedBuilder()
              .setColor(0xe74c3c)
              .setTitle("❌ Insufficient Funds")
              .setDescription(
                `You need **$${vehicle.price.toLocaleString()}** to buy the **${vehicle.name}**.\n` +
                `You only have **$${fresh.balance.toLocaleString()}**.`
              ),
          ],
          components: [],
        });
        return;
      }

      fresh.balance -= vehicle.price;
      fresh.inventory.push(vehicle.id);
      setUser(interaction.user.id, fresh);

      await selection.update({
        embeds: [
          new EmbedBuilder()
            .setColor(0x2ecc71)
            .setTitle("✅ Vehicle Purchased!")
            .setDescription(
              `You bought the **${vehicle.emoji} ${vehicle.name}** for **$${vehicle.price.toLocaleString()}**.\n` +
              `Remaining balance: **$${fresh.balance.toLocaleString()}**.`
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
            .setTitle("🚘 Vehicle Dealership")
            .setDescription("Purchase cancelled — you took too long to choose."),
        ],
        components: [],
      });
    }
  },
};

export default command;