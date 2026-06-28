import {SlashCommandBuilder, MessageFlags, EmbedBuilder} from 'discord.js';
import Pool from "../../Model/Dice/Pool.js";

const MODIFIER_KEYS = {
    d: 'difficulty',
    i: 'internalPenalties',
    e: 'externalPenalties',
    s: 'successes',
    t: 'target',
};


function generatePoolFromModifiersString(poolText) {
    // Accept an initial dice count followed by any modifiers in any order, e.g. "6d2e1i2s3" or "6i2e1d2s3"
    const poolRegex = /^(\d+)((?:[deist]\d+)*)$/;
    const match = poolText.match(poolRegex);

    if (!match) {
        throw new Error("Invalid pool format. See `/roll help` for more information.");
    }

    const args = { dice: match[1] };
    const modifiersStr = match[2] || '';

    for (const [, modifierKey, modifierValue] of modifiersStr.matchAll(/([deist])(\d+)/g)) {
        args[MODIFIER_KEYS[modifierKey]] = Number(modifierValue);
    }

    const pool = new Pool(args);
    pool.roll();
    return pool;
}

function generatePoolResultEmbed(displayName, pool)
{
    // Build a rich embed for the roll results
    const penalties = [];
    if (pool.internalPenalties) penalties.push(`Internal: ${pool.internalPenalties}`);
    if (pool.externalPenalties) penalties.push(`External: ${pool.externalPenalties}`);

    return new EmbedBuilder()
        .setTitle(`${displayName} — Dice Roll`)
        .setColor(pool.succeeded ? 0x57F287 : 0xED4245) // green on success, red on failure
        .setDescription(`**${pool.results}** successes — ${pool.succeeded ? 'Success' : 'Failure'}`)
        .addFields(
            { name: 'Pool', value: `${pool.dice} d10`, inline: true },
            { name: 'Target', value: `${pool.target ?? '8'}`, inline: true },
            { name: 'Difficulty', value: `${pool.difficulty ?? '0'}`, inline: true },
        )
        .addFields(
            { name: 'Penalties', value: penalties.length ? penalties.join(' / ') : 'None', inline: true },
            { name: 'Bought Successes', value: `${pool.successes ?? 0}`, inline: true },
            { name: 'Outcome', value: pool.succeeded ? 'Success' : 'Failure', inline: true }
        )
        .addFields({ name: 'Dice Rolled', value: pool.diceRolled.length ? pool.diceRolled.join(', ') : 'None' })
        .setFooter({ text: `Rolled by ${displayName}` })
        .setTimestamp();
}

export default ()=>({
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription("Roll some dice")
        .addStringOption(option =>
            option
                .setName('pool')
                .setDescription("The number of dice to roll and any modifiers to the pool or help if you want the command options")
                .setRequired(true)
        )
    ,
    async execute(interaction) {
        let poolText = interaction.options.getString('pool').toLowerCase();
        if(poolText === "help"){
            interaction.reply({
                content: "At its simplest, you can roll n d10 with /roll n. But you can build up a more complex pool with modifiers by adding the modifier type and value after the number of dice. For example:\n\n`/roll 5` will roll 5 dice against an implicit difficulty of 0, so any successes is a success.\n`/roll 5d4` will roll 5 dice at a difficulty of 4, so only rolls with four or more successes succeed.\n`/roll 5d4i3` will roll 5 dice at a difficulty of 4, and an internal penalty of 3.\n`/roll 5d4e2` will roll 5 dice at a difficulty of 4, and an external penalty of 2.\n`/roll 5d4i3e2` will roll 5 dice at a difficulty of 4, with an internal penalty of 3 and an external penalty of 2.\n`/roll 5d4i3e2s4` will roll 5 dice at a difficulty of 4 with 3 internal penalties, 2 external penalties and 4 automatic successes.\n`/roll 5d4i3e2s4t6` will roll at a target number of 6 instead of 8.\n\nAutomatic successes can come from willpower or excellencies and should be added together before rolling.",
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        try {
            const pool = generatePoolFromModifiersString(poolText);
            const displayName = interaction.member?.displayName ?? interaction.user.username;
            const embed = generatePoolResultEmbed(displayName, pool);
            interaction.reply({ embeds: [embed] });
        } catch (e) {
            interaction.reply({
                "content":e.message,
                flags: MessageFlags.Ephemeral
            });
        }

    },
});