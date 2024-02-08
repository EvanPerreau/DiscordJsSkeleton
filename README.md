# Discord.js Skeleton

## Introduction

Discord.js Skeleton is a project designed to help you create your Discord.js bot more efficiently. The foundational structure is already in place; you just need to develop commands and events within their respective directories. Command interactions include cooldown!

## Installation

```bash
git clone https://github.com/EvanPerreau/DiscordJsSkeleton.git
```

```bash
cd DiscordJsSkeleton
```

```bash
npm install
```

## Configure the bot

You need to complete the `config.json` file with your identifier
```json
{
  "token": "your token",
  "clientId": "your bot id"
}
```

You can find **bot id** in the *General Information* section on an application in Discord developer portal.
![image](https://github.com/EvanPerreau/DiscordJsSkeleton/assets/114474918/5d50ee43-cd0b-4197-9cb8-92b01c8c932e)
And **token** in the *Bot* section.
![image](https://github.com/EvanPerreau/DiscordJsSkeleton/assets/114474918/f9a6ec27-e30c-46a1-accb-e2aa7e0e1ee7)

## Run the bot

```bash
npm run dev
```
