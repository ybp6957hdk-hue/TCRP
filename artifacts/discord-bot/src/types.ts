import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

export interface SlashCommand {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export interface PrefixCommand {
  name: string;
  aliases?: string[];
  description: string;
  usage?: string;
  execute: (message: Message, args: string[]) => Promise<void>;
}
