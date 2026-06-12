import {SlashCommandBuilder, MessageFlags} from 'discord.js';


export default ()=>({
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription("Roll some dice")
    ,
    async execute(interaction) {
        console.log("Have command");
        interaction.reply({content:`I'm working on it`});

        console.log("response sent");
    },
});