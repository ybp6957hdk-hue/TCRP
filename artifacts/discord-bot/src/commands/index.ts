import { Collection } from "discord.js";
import { SlashCommand, PrefixCommand } from "../types.js";

// Slash commands
import pingSlash from "./slash/ping.js";
import helpSlash from "./slash/help.js";
import serverinfoSlash from "./slash/serverinfo.js";
import userinfoSlash from "./slash/userinfo.js";
import balanceSlash from "./slash/balance.js";
import buySlash from "./slash/buy.js";
import buyDrugsSlash from "./slash/buydrugs.js";
import inventorySlash from "./slash/inventory.js";

// Prefix commands
import pingPrefix from "./prefix/ping.js";
import helpPrefix from "./prefix/help.js";
import sayPrefix from "./prefix/say.js";
import avatarPrefix from "./prefix/avatar.js";
import strikePrefix from "./prefix/strike.js";

export const slashCommands = new Collection<string, SlashCommand>();
export const prefixCommands = new Collection<string, PrefixCommand>();

// Register slash commands
for (const cmd of [pingSlash, helpSlash, serverinfoSlash, userinfoSlash, balanceSlash, buySlash, buyDrugsSlash, inventorySlash]) {
  slashCommands.set(cmd.data.name, cmd);
}

// Register prefix commands (including aliases)
for (const cmd of [pingPrefix, helpPrefix, sayPrefix, avatarPrefix, strikePrefix]) {
  prefixCommands.set(cmd.name, cmd);
  if (cmd.aliases) {
    for (const alias of cmd.aliases) {
      prefixCommands.set(alias, cmd);
    }
  }
}
