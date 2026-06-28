import {MessageFlags, SlashCommandBuilder} from "discord.js";
import getCharacter from "../../inc/getCharacter.js";

export default (virtue)=>{
    return {
        data: new SlashCommandBuilder()
            .setName('set-'+virtue.toLowerCase())
            .setDescription("Set your "+virtue+" virtue")
            .addIntegerOption(option =>
                option
                    .setName('level')
                    .setDescription("The level you want set your "+virtue+" to")
                    .setRequired(true)
            ),
        async execute(interaction) {
            try {
                const level = interaction.options.getInteger('level');
                const character = await getCharacter(interaction);
                character.setVirtue(virtue, level);
                console.log(character);
                interaction.reply({
                    "content": `Your ${virtue} virtue has been set to ${level}`,
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