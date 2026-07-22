import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types.js";
import { getUser } from "../../db.js";
import { ITEM_MAP } from "../../items.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("View your purchased items")
    .addUserOption((o) =>
      o.setName("user").setDescription("View another user's inventory").setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getUser("user") ?? interaction.user;
    const user = getUser(target.id);

    const embed = new EmbedBuilder()
      .setColor(0x9b59b6)
      .setTitle(`🎒 ${target.username}'s Inventory`)
      .setThumbnail(target.displayAvatarURL())
      .setTimestamp();

    if (!user.inventory.length) {
      embed.setDescription("No items yet — use `/buy` to get started!");
    } else {
      // Count duplicates
      const counts: Record<string, number> = {};
      for (const id of user.inventory) {
        counts[id] = (counts[id] ?? 0) + 1;
      }

      const lines = Object.entries(counts).map(([id, qty]) => {
        const item = ITEM_MAP.get(id);
        if (!item) return `Unknown item x${qty}`;
        return `${item.emoji} **${item.name}** x${qty}`;
      });

      embed.setDescription(lines.join("\n"));
    }

    await interaction.reply({ embeds: [embed] });
  },
};

export default command;
