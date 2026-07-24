import { Collection } from "discord.js";
import { SlashCommand, PrefixCommand } from "../types.js";

// Slash commands
import pingSlash from "./slash/ping.js";
import helpSlash from "./slash/help.js";
import serverinfoSlash from "./slash/serverinfo.js";
import userinfoSlash from "./slash/userinfo.js";
import applyJobSlash from "./slash/applyjob.js";
import balanceSlash from "./slash/balance.js";
import buySlash from "./slash/buy.js";
import buyDrugsSlash from "./slash/buydrugs.js";
import sellSlash from "./slash/sell.js";
import stockSlash from "./slash/stock.js";
import quitJobSlash from "./slash/quitjob.js";
import searchCarSlash from "./slash/searchcar.js";
import inventorySlash from "./slash/inventory.js";
import vehiclesSlash from "./slash/vehicles.js";

// Prefix commands
import pingPrefix from "./prefix/ping.js";
import helpPrefix from "./prefix/help.js";
import sayPrefix from "./prefix/say.js";
import avatarPrefix from "./prefix/avatar.js";
import strikePrefix from "./prefix/strike.js";
import applyJobPrefix from "./prefix/applyjob.js";

export const slashCommands = new Collection<string, SlashCommand>();
export const prefixCommands = new Collection<string, PrefixCommand>();

// Register slash commands
for (const cmd of [pingSlash, helpSlash, serverinfoSlash, userinfoSlash, applyJobSlash, balanceSlash, buySlash, buyDrugsSlash, sellSlash, stockSlash, quitJobSlash, searchCarSlash, inventorySlash]) {
  slashCommands.set(cmd.data.name, cmd);
}

// Register prefix commands (including aliases)
for (const cmd of [pingPrefix, helpPrefix, sayPrefix, avatarPrefix, strikePrefix, applyJobPrefix]) {
  prefixCommands.set(cmd.name, cmd);
  if (cmd.aliases) {
    for (const alias of cmd.aliases) {
      prefixCommands.set(alias, cmd);
    }
  }
}
