import {MessageFlags, SlashCommandBuilder} from "discord.js";
import getCharacter from "#inc/getCharacter.js";
import updateCharacter from "#inc/updateCharacter.js";


export default function() {
    return {
        data: new SlashCommandBuilder()
            .setName('set-name')
            .setDescription("Set your character's name")
            .addStringOption(option =>
                option
                    .setName('name')
                    .setDescription("Your character's name")
                    .setRequired(true)
            ),
        async execute(interaction) {
            try {
                const name = interaction.options.getString('name');
                const character = await getCharacter(interaction);
                character.setName(name);
                await updateCharacter(interaction, character);
                interaction.reply({
                    "content": `Your name has been set to ${name}`,
                    flags: MessageFlags.Ephemeral
                });
            } catch (err) {
                interaction.reply({
                    content: err.message,
                    flags: MessageFlags.Ephemeral
                })
            }
        }
    }
}