const {Client, GatewayIntentBits, Collection} = require('discord.js');
const path = require("node:path");
const { loadCommands, loadEvents} = require('./services/loaders.js');
const { clientId, token } = require('./config.json');

if (token === undefined || token === "your token" || clientId === undefined || clientId === "your bot id") {
    console.error("Please provide a valid token and client id in the config.json file.");
    process.exit(1);
}

const client = new Client({ intents:  [GatewayIntentBits.Guilds]});

const commandsFolderPath = path.join(__dirname, 'commands');
const eventsFolderPath = path.join(__dirname, 'events');
client.commands = new Collection();
client.cooldowns = new Collection();

Promise.all([
    loadCommands(client, commandsFolderPath),
    loadEvents(client, eventsFolderPath)
]).then(() => {
    client.login(token).catch(e => console.error(e));
}).catch((error) => {
    console.error(error);
});