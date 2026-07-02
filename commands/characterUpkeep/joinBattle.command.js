import {EmbedBuilder, MessageFlags, SlashCommandBuilder} from "discord.js";
import ObjectCache from "#inc/ObjectCache.js";
import getCharacter from "#inc/getCharacter.js";

export default function() {
    return {
        data: new SlashCommandBuilder()
            .setName('join-battle')
            .setDescription("Joins the initiative track currently underway in your current room")
            .addIntegerOption(option =>
                option
                    .setName('successes')
                    .setDescription("Automatic successes, from excellencies for example")
            )
            .addIntegerOption(option =>
                option
                    .setName('extra-dice')
                    .setDescription("From excellencies or stunts")
            )
        ,
        async execute(interaction) {
            try {
                let roomId = interaction.channel.id;
                /**
                 * @type {InitiativeTracker}
                 */
                let initiativeTrack = ObjectCache.getInstance().get(`${roomId}-tracker`);
                if(!initiativeTrack) {
                    interaction.reply({
                        content: "There is no battle underway in this room",
                        flags: MessageFlags.Ephemeral
                    });
                    return;
                }
                /**
                 * @type {Character}
                 */
                const character = await getCharacter(interaction);
                let characterInitiative = initiativeTrack.getCharacterInitiative(character);
                if(characterInitiative >= 0)
                {
                    interaction.reply({
                        content: `You are already in the initiative track, your intiative is ${characterInitiative}`,
                        flags: MessageFlags.Ephemeral
                    });
                    return;
                }
                const successes = interaction.options.getInteger('successes') || 0;
                const extraDice = interaction.options.getInteger('extraDice') || 0;
                let initiative=character.rollInitiative({successes, extraDice});
                initiativeTrack.setCharacterInitiative(character, initiative);
                interaction.reply({
                    content: `You have joined the initiative track. Your initiative is ${initiative}`,
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