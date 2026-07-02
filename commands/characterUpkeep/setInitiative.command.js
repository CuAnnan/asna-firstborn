import {MessageFlags, SlashCommandBuilder} from "discord.js";
import getCharacter from "#inc/getCharacter.js";
import updateCharacter from "#inc/updateCharacter.js";


export default function() {
    return {
        data: new SlashCommandBuilder()
            .setName('set-join-battle')
            .setDescription("Set your initiative")
            .addIntegerOption(option =>
                option
                    .setName('join-battle-score')
                    .setDescription("The level you want set your join battle score to")
                    .setRequired(true)
            ),
        async execute(interaction) {
            try {
                const level = interaction.options.getInteger('join-battle-score');
                const character = await getCharacter(interaction);
                character.setInitiative(level);
                await updateCharacter(interaction, character);
                interaction.reply({
                    "content": `Your join battle score has been set to ${level}`,
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