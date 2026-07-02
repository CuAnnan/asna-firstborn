import {MessageFlags, SlashCommandBuilder} from "discord.js";
import getCharacter from "#inc/getCharacter.js";
import updateCharacter from "#inc/updateCharacter.js";


export default function() {
    return {
        data: new SlashCommandBuilder()
            .setName('spend-essence')
            .setDescription("Spend essence from wherever")
            .addIntegerOption(option =>
                option
                    .setName('motes')
                    .setDescription("The number of motes to spend")
                    .setRequired(true)
            ),
        async execute(interaction) {
            try {
                const motes = interaction.options.getInteger('motes');
                const character = await getCharacter(interaction);
                character.spendEssence({motes});
                await updateCharacter(interaction, character);
                interaction.reply({
                    "content": `You have spent ${motes} motes. You now have ${character.remainingEssence.personal} personal motes and ${character.remainingEssence.peripheral} peripheral motes remaining.`,
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