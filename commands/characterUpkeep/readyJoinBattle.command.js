import {EmbedBuilder, MessageFlags, SlashCommandBuilder} from "discord.js";
import InitiativeTracker from "#Model/Action/InitiativeTracker.js";
import ObjectCache from "#inc/ObjectCache.js";

function getStartBattleEmbed(user)
{
    return new EmbedBuilder()
        .setTitle(`Battle is being joined!`)
        .setDescription(`<@${user.id}> has started a battle! Use the \`/join-battle\` command to join the battle.`)
}

export default function() {
    return {
        data: new SlashCommandBuilder()
            .setName('start-battle')
            .setDescription("Starts an initiative track in your current room")
        ,
        async execute(interaction) {
            try {
                let roomId = interaction.channel.id;
                let trackerId = `${roomId}-tracker`;
                let tracker = ObjectCache.getInstance().get(trackerId);
                if(!tracker)
                {
                    tracker = new InitiativeTracker();
                    ObjectCache.getInstance().set(trackerId, tracker);
                    await interaction.reply({
                        embeds: [getStartBattleEmbed(interaction.member)],
                    })
                }
                else
                {
                    interaction.reply({
                        content: "A battle is already underway in this room",
                        flags: MessageFlags.Ephemeral
                    });
                }
            } catch (err) {
                interaction.reply({
                    content: err.message,
                    flags: MessageFlags.Ephemeral
                })
            }
        }
    }
}