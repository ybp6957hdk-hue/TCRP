# Discord Bot

A Discord bot with both slash commands (`/`) and prefix commands (`!`).

## Slash Commands

| Command | Description |
|---------|-------------|
| `/ping` | Check the bot's latency |
| `/help` | Show all available commands |
| `/serverinfo` | Show information about the server |
| `/userinfo [user]` | Show information about a user |

## Prefix Commands (default: `!`)

| Command | Aliases | Description |
|---------|---------|-------------|
| `!ping` | `!p` | Check the bot's latency |
| `!help [command]` | `!h`, `!commands` | Show all commands or details on one |
| `!say <message>` | — | Make the bot say something |
| `!avatar [user]` | `!av`, `!pfp` | Show a user's avatar |

## Setup

### Required environment secrets

| Key | Description |
|-----|-------------|
| `DISCORD_BOT_TOKEN` | Your bot token from the Discord Developer Portal |
| `DISCORD_CLIENT_ID` | Your bot's Application ID (for slash command registration) |

### Optional

| Key | Description |
|-----|-------------|
| `DISCORD_GUILD_ID` | Server ID for instant slash command deployment (dev only) |

### Registering Slash Commands

Before slash commands appear in Discord, register them once:

```bash
pnpm --filter @workspace/discord-bot run deploy-commands
```

## Adding New Commands

**Slash command:** create a file in `src/commands/slash/`, export a `SlashCommand`, and import/register it in `src/commands/index.ts`.

**Prefix command:** create a file in `src/commands/prefix/`, export a `PrefixCommand`, and import/register it in `src/commands/index.ts`.
