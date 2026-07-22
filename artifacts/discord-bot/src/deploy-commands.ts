/**
 * Run this script to register slash commands with Discord:
 *   pnpm --filter @workspace/discord-bot run deploy-commands
 *
 * Set DISCORD_GUILD_ID to deploy instantly to a specific server (recommended for testing).
 * Leave it unset to deploy globally (takes up to 1 hour to propagate).
 */
import "dotenv/config";
import { REST, Routes } from "discord.js";
import { TOKEN, CLIENT_ID, GUILD_ID } from "./config.js";
import { slashCommands } from "./commands/index.js";

if (!TOKEN || !CLIENT_ID) {
  console.error(
    "❌ Missing DISCORD_BOT_TOKEN or DISCORD_CLIENT_ID environment variable."
  );
  process.exit(1);
}

const rest = new REST().setToken(TOKEN);
const commands = [...slashCommands.values()].map((cmd) => cmd.data.toJSON());

const route = GUILD_ID
  ? Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID)
  : Routes.applicationCommands(CLIENT_ID);

const scope = GUILD_ID ? `guild ${GUILD_ID}` : "global (takes up to 1h)";

console.log(`🚀 Registering ${commands.length} slash command(s) [${scope}]...`);

rest
  .put(route, { body: commands })
  .then(() => {
    console.log(`✅ Successfully registered ${commands.length} slash command(s).`);
  })
  .catch((err) => {
    console.error("❌ Failed to register commands:", err);
    process.exit(1);
  });
