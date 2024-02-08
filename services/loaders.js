const { REST, Routes } = require('discord.js');
const fs = require('node:fs').promises;
const path = require('node:path');
const { clientId, token } = require('../config.json');

async function getJsFiles(dirPath) {
    let jsFiles = new Set();
    const elements = await fs.readdir(dirPath, { withFileTypes: true });

    await Promise.all(elements.map(async (element) => {
        const fullPath = path.resolve(dirPath, element.name);

        if (element.isDirectory()) {
            const subDirFiles = await getJsFiles(fullPath);
            subDirFiles.forEach(file => jsFiles.add(file));
        } else if (element.isFile() && path.extname(fullPath) === '.js') {
            jsFiles.add(fullPath);
        }
    }));

    return jsFiles;
}

async function loadCommand(filePath, client) {
    if (require.cache[filePath]) {
        delete require.cache[filePath];
    }

    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        await client.commands.set(command.data.name, command);
        return command.data.toJSON();
    } else {
        console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        return null;
    }
}

async function getCommandData(client, folderPath) {
    let commands = [];
    const commandsFilesPath = await getJsFiles(folderPath);
    await Promise.all([...commandsFilesPath].map(async (filePath) => {
        const command = await loadCommand(filePath, client);
        if (command) commands.push(command);
    }));
    return commands;
}

async function loadCommands(client, commandsFolderPath) {
    const commands = await getCommandData(client, commandsFolderPath)
    const rest = new REST().setToken(token);
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
}

async function loadEvents(client, eventsFolderPath) {
    const eventFilesPath = await getJsFiles(eventsFolderPath);
    console.log(`Starting load a total of ${eventFilesPath.size} events.`);
    await Promise.all([...eventFilesPath].map(async (filePath) => {
        if (require.cache[filePath]) {
            delete require.cache[filePath];
        }

        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }));
    console.log(`Finished loading ${eventFilesPath.size} events.`);
}

module.exports = {
    loadCommands,
    loadEvents
};