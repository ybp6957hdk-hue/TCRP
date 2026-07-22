import { EmbedBuilder, Message } from "discord.js";
import { PrefixCommand } from "../../types.js";
import { prefixCommands } from "../index.js";
import { PREFIX } from "../../config.js";

const command: PrefixCommand = {
  name: "help",
  aliases: ["h", "commands"],
  description: "Show all prefix commands",
  usage: "help [command]",

  async execute(message: Message, args: string[]) {
    if (args[0]) {
      const cmd = prefixCommands.get(args[0].toLowerCase());
      if (!cmd) {
        await message.reply(`No command named \`${args[0]}\` found.`);
        return;
      }
      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle(`Command: ${PREFIX}${cmd.name}`)
        .setDescription(cmd.description)
        .addFields(
          {
            name: "Usage",
            value: `\`${PREFIX}${cmd.usage ?? cmd.name}\``,
            inline: true,
          },
          {
            name: "Aliases",
            value:
              cmd.aliases && cmd.aliases.length
                ? cmd.aliases.map((a) => `\`${a}\``).join(", ")
                : "None",
            inline: true,
          }
        );
      await message.reply({ embeds: [embed] });
      return;
    }

    const fields = [...prefixCommands.values()].map((cmd) => ({
      name: `${PREFIX}${cmd.name}`,
      value: cmd.description,
      inline: true,
    }));

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("📖 Prefix Commands")
      .setDescription(`Use \`${PREFIX}help <command>\` for details on a specific command.`)
      .addFields(fields)
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  },
};

export default command;
