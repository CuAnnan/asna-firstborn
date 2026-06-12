import {REST, Routes} from 'discord.js';
import fs from 'fs';
import path from 'path';
import conf from './conf.js';
import {fileURLToPath, pathToFileURL} from "url";
const {clientId, guildId, token} = conf.discord.secrets;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        console.log(`[INFO] Adding command at ${filePath}`)
        const module = await import(pathToFileURL(filePath).href);
        const command = module.default();
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const rest = new REST().setToken(token);

(async () => {
    try {
        console.log(`[INFO] Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
        console.log(`[INFO] Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();