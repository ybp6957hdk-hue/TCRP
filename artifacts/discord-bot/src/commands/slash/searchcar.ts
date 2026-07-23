import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../types.js";
import { getUser, setUser } from "../../db.js";

// Unlock chance: 47% (between 45–50%)
const UNLOCK_CHANCE = 0.47;

// Outcomes when car is unlocked (must sum to 1.0)
// 10% Glock17, 25% cocaine, 30% weed, 35% cash
const OUTCOMES = [
  { type: "item",  id: "glock17", name: "Glock 17", emoji: "🔫", weight: 0.10 },
  { type: "item",  id: "cocaine", name: "Cocaine",  emoji: "❄️", weight: 0.25 },
  { type: "item",  id: "weed",    name: "Weed",     emoji: "🌿", weight: 0.30 },
  { type: "cash",  id: "cash",    name: "Cash",     emoji: "💵", weight: 0.35 },
];

function rollOutcome() {
  let roll = Math.random();
  for (const outcome of OUTCOMES) {
    roll -= outcome.weight;
    if (roll <= 0) return outcome;
  }
  return OUTCOMES[OUTCOMES.length - 1];
}

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("searchcar")
    .setDescription("Try your luck searching a parked car"),

  async execute(interaction: ChatInputCommandInteraction) {
    const unlocked = Math.random() < UNLOCK_CHANCE;

    if (!unlocked) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xe74c3c)
            .setTitle("🚗 Car Search")
            .setDescription("🔒 The car is **locked**. Nothing to find here.")
            .setTimestamp(),
        ],
      });
      return;
    }

    const outcome = rollOutcome();
    const user = getUser(interaction.user.id);

    if (outcome.type === "cash") {
      const amount = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
      user.balance += amount;
      setUser(interaction.user.id, user);

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x2ecc71)
            .setTitle("🚗 Car Search")
            .setDescription(`🔓 The car is **unlocked!**\n\n💵 You found **$${amount}** inside!\nNew balance: **$${user.balance.toLocaleString()}**.`)
            .setTimestamp(),
        ],
      });
    } else {
      user.inventory.push(outcome.id);
      setUser(interaction.user.id, user);

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x9b59b6)
            .setTitle("🚗 Car Search")
            .setDescription(`🔓 The car is **unlocked!**\n\n${outcome.emoji} You found a **${outcome.name}** inside!\nIt's been added to your inventory.`)
            .setTimestamp(),
        ],
      });
    }
  },
};

export default command;
