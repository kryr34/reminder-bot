const { MessageEmbed } = require('discord.js');

module.exports.execute = (client, interaction, args) => {
	const embeds = [];
	const exampleEmbed = new MessageEmbed()
		.setTitle('Some title')
		.setDescription('Some description here')
		.setThumbnail('https://i.ytimg.com/vi/bmGtN5BFuko/maxresdefault.jpg')
	for (let index = 0; index < 2; index++) {
		embeds.push(exampleEmbed);
	}
	interaction.reply({
		content: 'Pong!', 
	});
	interaction.channel.send({
		content: 'Pong!',
		data: {
			
		}
	})
};
module.exports.data = {
	name: "ping",
	aliases: [],
	description: "",
	type: 3
}