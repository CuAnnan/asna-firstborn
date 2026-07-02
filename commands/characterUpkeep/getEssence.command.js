import {MessageFlags, SlashCommandBuilder} from "discord.js";
import getCharacter from "#inc/getCharacter.js";

export default ()=> {
    return {
        data: new SlashCommandBuilder()
            .setName(`get-essence`)
            .setDescription(`Get your essence levels`)
        ,
        async execute(interaction) {
            try {
                const character = await getCharacter(interaction);
                interaction.reply({
                    "content": `You currently have ${character.remainingEssence.personal} personal motes and ${character.remainingEssence.peripheral} peripheral motes remaining.`,
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