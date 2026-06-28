import {MessageFlags, SlashCommandBuilder} from "discord.js";
import getCharacter from "../../inc/getCharacter.js";


export default function() {
    return {
        data: new SlashCommandBuilder()
            .setName('set-initiative')
            .setDescription("Set your initiative")
            .addIntegerOption(option =>
                option
                    .setName('level')
                    .setDescription("The level you want set your initiative to")
                    .setRequired(true)
            ),
        async execute(interaction) {
            try {
                const level = interaction.options.getInteger('level');
                const character = await getCharacter(interaction);
                character.setInitiative(level);
                console.log(character);
                interaction.reply({
                    "content": `Your initiative has been set to ${level}`,
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