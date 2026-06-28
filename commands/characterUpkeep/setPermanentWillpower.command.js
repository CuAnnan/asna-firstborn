import {MessageFlags, SlashCommandBuilder} from "discord.js";
import getCharacter from "../../inc/getCharacter.js";


export default function() {
    return {
        data: new SlashCommandBuilder()
            .setName('set-willpower')
            .setDescription("Set your permanent essence")
            .addIntegerOption(option =>
                option
                    .setName('level')
                    .setDescription("The level you want set your permanent essence to")
                    .setRequired(true)
            ),
        async execute(interaction) {
            try {
                const level = interaction.options.getInteger('level');
                const character = await getCharacter(interaction);
                character.setPermanentWillpower(level);
                console.log(character);
                interaction.reply({
                    "content": `Your permanent willpower has been set to ${level}`,
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