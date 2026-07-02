import {EmbedBuilder, MessageFlags, SlashCommandBuilder} from "discord.js";
import getCharacter from "#inc/getCharacter.js";

function getVirtueDots(level, max=5)
{
    let dots = "";
    for(let i = 0; i < level; i++)
    {
        dots += "●";
    }
    for(let i = level; i < max; i++)
    {
        dots += "○";
    }
    return dots;
}

function getEmbedForCharacter(character) {
    if(!character) throw new Error("No character found for this user")
    return new EmbedBuilder()
        .setTitle(`Your character stats`)
        .addFields(
            {name:'Name', value:character?.name ?? ""}
        )
        .addFields({ name: 'Virtues', value:"", inline:false})
        .addFields(
            {name:'Conviction', value:getVirtueDots(character.virtues.conviction), inline: true },
            {name:'Temperance', value:getVirtueDots(character.virtues.temperance), inline: true },
        )
        .addFields({ name: '', value: '', inline:false })
        .addFields(
            {name:'Courage', value:getVirtueDots(character.virtues.courage), inline: true },
            {name:'Valor', value:getVirtueDots(character.virtues.valor), inline:true}
        )
        .addFields(
            {name:'Permanent Essence', value:getVirtueDots(character.permanentEssence, 10), inline:false},
            {name:'Permanent Willpower', value:getVirtueDots(character.permanentWillpower, 10), inline:false}
        )
        .addFields({name:"Personal Essence", value:'', inline:false})
        .addFields(
            {name:"Spent", value:""+character.essencePools.personal.spent, inline:true},
            {name:"Committed", value:""+character.essencePools.personal.committed, inline:true},
            {name:"Remanining", value:""+(character.essencePools.personal.total - character.essencePools.personal.spent - character.essencePools.personal.committed), inline:true}
        )
        .addFields({name:"Peripheral Essence", value:"", inline:false})
        .addFields(
            {name:"Spent", value:""+character.essencePools.peripheral.spent, inline:true},
            {name:"Committed", value:""+character.essencePools.peripheral.committed, inline:true},
            {name:"Remanining", value:""+(character.essencePools.peripheral.total - character.essencePools.peripheral.spent - character.essencePools.peripheral.committed), inline:true}
        )
        .addFields({name:"Join Battle:", value:""+character.initiative})
        .setTimestamp();
}

export default function() {
    return {
        data: new SlashCommandBuilder()
            .setName('get-sheet')
            .setDescription("Get the data for your sheet"),
        async execute(interaction) {
            try {
                const character = await getCharacter(interaction);
                const embed = getEmbedForCharacter(character);
                interaction.reply({
                    embeds: [embed],
                    flags: MessageFlags.Ephemeral
                });
            } catch (err) {
                console.log(err);
                interaction.reply({
                    content: err.message,
                    flags: MessageFlags.Ephemeral
                })
            }
        }
    }
}