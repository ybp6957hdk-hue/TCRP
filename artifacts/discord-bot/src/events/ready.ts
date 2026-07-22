import { Client, Events } from "discord.js";

export function registerReadyEvent(client: Client) {
  client.once(Events.ClientReady, (readyClient) => {
    console.log(`✅ Logged in as ${readyClient.user.tag}`);
    console.log(`   Serving ${readyClient.guilds.cache.size} server(s)`);
    readyClient.user.setActivity("/ and ! commands");
  });
}
