import {MessageFlags, SlashCommandBuilder} from "discord.js";
import getCharacter from "../../inc/getCharacter.js";
import generateEssenceSpendSlashCommand from "./generateEssenceSpendSlashCommand.js";

export default ()=>generateEssenceSpendSlashCommand("personal");