import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs';
import path from 'path';
import {Client, Collection, Events, GatewayIntentBits, MessageFlags} from "discord.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import conf from './conf.js'

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
    console.log(`[INFO] Ready! Logged in as ${readyClient.user.tag}`);
});


client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
console.log('[INFO] Loading commands');
for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.command.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        console.log(`[INFO] Adding command at ${filePath}`)
        // When running on Windows `filePath` is an absolute path like "C:\\...".
        // The ESM loader requires a file:// URL for absolute paths, so convert
        // using pathToFileURL to avoid ERR_UNSUPPORTED_ESM_URL_SCHEME.
        const module = await import(pathToFileURL(filePath).href);
        const command = module.default();
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}
console.log('[INFO] Finished loading commands');

console.log('[INFO] Adding command event listener');
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.warn(`Discord-Bot: No command matching ${interaction.commandName} was found. May be from a different bot.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('Discord-Bot: '+ error.message);
        await interaction.reply({ content: 'There was an error while executing this command!', flags:MessageFlags.Ephemeral});
    }
});
console.log('[INFO] Finished adding command listener');

console.log('[INFO] Logging in to Discord');
await client.login(conf.discord.secrets.token);
console.log('[INFO] Logged in to Discord');