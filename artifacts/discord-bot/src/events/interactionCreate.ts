import { Client, Events, Interaction } from "discord.js";
import { slashCommands } from "../commands/index.js";

export function registerInteractionEvent(client: Client) {
  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = slashCommands.get(interaction.commandName);
    if (!command) {
      await interaction.reply({
        content: `Unknown command: \`/${interaction.commandName}\``,
        ephemeral: true,
      });
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error in slash command /${interaction.commandName}:`, error);
      const msg = { content: "An error occurred while running this command.", ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(msg);
      } else {
        await interaction.reply(msg);
      }
    }
  });
}
