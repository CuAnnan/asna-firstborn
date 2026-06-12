import {SlashCommandBuilder, MessageFlags} from 'discord.js';
import Pool from "../../Model/Dice/Pool.js";

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
        let pool = interaction.options.getString('pool').toLowerCase();
        if(pool === "help"){
            interaction.reply({
                content: "At its simplest, you can roll n d10 with /roll n. But you can build up a more complex pool with modifiers by adding the modifier type and value after the number of dice. For example:\n\n`/roll 5` will roll 5 dice against an implicit difficulty of 0, so any successes is a success.\n`/roll 5d4` will roll 5 dice at a difficulty of 4, so only rolls with four or more successes succeed.\n`/roll 5d4i3` will roll 5 dice at a difficulty of 4, and an internal penalty of 3.\n`/roll 5d4e2` will roll 5 dice at a difficulty of 4, and an external penalty of 2.\n`/roll 5d4i3e2` will roll 5 dice at a difficulty of 4, with an internal penalty of 3 and an external penalty of 2.\n`/roll 5d4i3e2s4` will roll 5 dice at a difficulty of 4 with 3 internal penalties, 2 external penalties and 4 automatic successes.\n`/roll 5d4i3e2s4t6` will roll at a target number of 6 instead of 8.\n\nAutomatic successes can come from willpower or excellencies and should be added together before rolling.",
                flags: MessageFlags.Ephemeral
            });
            return;
        }
        const poolRegex = /^(\d+)(?:d(\d+))?(?:i(\d+))?(?:e(\d+))?(?:s(\d+))?(?:t(\d+))?$/;
        const match = pool.match(poolRegex);

        if (match) {
            const [, dice, difficulty, internalPenalties, externalPenalties, successes, target] = match;
            let args = {
                dice,
                ...(difficulty !== undefined ? { difficulty } : {}),
                ...(internalPenalties !== undefined ? { internalPenalties } : {}),
                ...(externalPenalties !== undefined ? { externalPenalties } : {}),
                ...(successes !== undefined ? { successes } : {}),
                ...(target !== undefined ? { target } : {}),
            };

            try {
                const pool = new Pool(args);

                let result = pool.roll();

                const displayName = interaction.member?.displayName ?? interaction.user.username;
                let response = `${displayName} rolled ${result} successes on their pool of ${pool.dice}`;
                if (pool.difficulty >= undefined) {
                    response += `\nagainst a difficulty of ${pool.difficulty}`;
                }
                if (pool.internalPenalties || pool.externalPenalties) {
                    response += `\nwith `;
                    const penalties = [];
                    if (pool.internalPenalties) {
                        penalties.push(`an internal penalty of ${pool.internalPenalties}`);
                    }
                    if (pool.externalPenalties) {
                        penalties.push(`an external penalty of ${pool.externalPenalties}`);
                    }
                    response += penalties.join(" and ");
                }
                if (pool.target < 8) {
                    response += `\nand a target of ${pool.target}`;
                }
                response += `\n\nDice rolled: ${pool.diceRolled.join(", ")}`;
                response += `\nThis roll was a ${pool.succceeded?"success":"failure"}`;


                interaction.reply({
                    content: response
                });
            } catch (e) {
                interaction.reply({
                    "content":e.message,
                    flags: MessageFlags.Ephemeral
                });
            }
        }
        else
        {
            interaction.reply({
                content: "Invalid pool format. See `/roll help` for more information.",
                flags: MessageFlags.Ephemeral
            });
        }
    },
});