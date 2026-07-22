import "dotenv/config";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import { TOKEN } from "./config.js";
import { registerReadyEvent } from "./events/ready.js";
import { registerInteractionEvent } from "./events/interactionCreate.js";
import { registerMessageEvent } from "./events/messageCreate.js";

if (!TOKEN) {
  console.error("❌ DISCORD_BOT_TOKEN is not set. Please add it to your environment secrets.");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    // MessageContent is a privileged intent — must be enabled in the
    // Discord Developer Portal → Bot → Privileged Gateway Intents
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel],
});

// Register event handlers
registerReadyEvent(client);
registerInteractionEvent(client);
registerMessageEvent(client);

// Login
client.login(TOKEN).catch((error) => {
  console.error("❌ Failed to login:", error.message);
  process.exit(1);
});
