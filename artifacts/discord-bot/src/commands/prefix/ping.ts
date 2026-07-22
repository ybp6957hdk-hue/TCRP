import { Message } from "discord.js";
import { PrefixCommand } from "../../types.js";

const command: PrefixCommand = {
  name: "ping",
  aliases: ["p"],
  description: "Check the bot's latency",
  usage: "ping",

  async execute(message: Message) {
    const reply = await message.reply("Pinging...");
    const latency = reply.createdTimestamp - message.createdTimestamp;
    const wsLatency = message.client.ws.ping;
    await reply.edit(
      `🏓 Pong!\n> Roundtrip: **${latency}ms**\n> Websocket: **${wsLatency}ms**`
    );
  },
};

export default command;
