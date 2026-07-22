import { EmbedBuilder, Message } from "discord.js";
import { PrefixCommand } from "../../types.js";

const command: PrefixCommand = {
  name: "avatar",
  aliases: ["av", "pfp"],
  description: "Show a user's avatar",
  usage: "avatar [user mention or ID]",

  async execute(message: Message) {
    const target =
      message.mentions.users.first() ?? message.author;

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`${target.username}'s Avatar`)
      .setImage(target.displayAvatarURL({ size: 512 }))
      .setFooter({ text: `Requested by ${message.author.tag}` })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  },
};

export default command;
