import {MessageFlags, SlashCommandBuilder} from "discord.js";
import getCharacter from "../../inc/getCharacter.js";

export default (pool)=> {
    pool = pool.toLowerCase();
    return {
        data: new SlashCommandBuilder()
            .setName(`spend-${pool}-essence`)
            .setDescription(`Spend some ${pool} essence`)
            .addIntegerOption(option =>
                option
                    .setName('motes')
                    .setDescription(`The amount of essence you want to spend from your ${pool} essence pool`)
                    .setRequired(true)
            ),
        async execute(interaction) {
            try {
                const motes = interaction.options.getInteger('motes');
                const character = await getCharacter(interaction);
                character.spendEssence({pool, motes});
                console.log(character);
                interaction.reply({
                    "content": `You have spent ${motes} motes from your ${pool} essence pool. You now have ${character.remainingEssence.personal} personal motes and ${character.remainingEssence.peripheral} peripheral motes remaining.`,
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