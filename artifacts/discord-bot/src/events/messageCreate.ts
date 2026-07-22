import { Client, Events, Message } from "discord.js";
import { prefixCommands } from "../commands/index.js";
import { PREFIX } from "../config.js";

export function registerMessageEvent(client: Client) {
  client.on(Events.MessageCreate, async (message: Message) => {
    // Ignore bots and messages without the prefix
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;

    const command = prefixCommands.get(commandName);
    if (!command) return;

    try {
      await command.execute(message, args);
    } catch (error) {
      console.error(`Error in prefix command ${PREFIX}${commandName}:`, error);
      await message.reply("An error occurred while running this command.").catch(() => null);
    }
  });
}
