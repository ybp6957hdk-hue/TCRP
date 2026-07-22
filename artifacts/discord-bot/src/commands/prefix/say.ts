import { Message } from "discord.js";
import { PrefixCommand } from "../../types.js";

const command: PrefixCommand = {
  name: "say",
  description: "Make the bot repeat a message",
  usage: "say <message>",

  async execute(message: Message, args: string[]) {
    if (!args.length) {
      await message.reply("Please provide a message for me to say!");
      return;
    }
    // Delete the command message if the bot has permission
    if (message.guild && message.channel.isSendable()) {
      await message.delete().catch(() => null);
      await message.channel.send(args.join(" "));
    } else {
      await message.reply(args.join(" "));
    }
  },
};

export default command;
