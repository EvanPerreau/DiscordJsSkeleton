const {Client, GatewayIntentBits, Collection} = require('discord.js');
const path = require("node:path");
const { loadCommands, loadEvents} = require('./services/loaders.js');
const { token } = require('./config.json');

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