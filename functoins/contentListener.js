const { MessageActionRow, MessageButton, CommandInteractionOptionResolver } = require('discord.js');
const { checkVideo } = require('./checkVideo');

const youtubeLinkRe = new RegExp('youtu\.?be.*(v=|/).{11}','i');

module.exports.contentListener = (client, message) => {
	checkVideo(client, message)
	.then(videoObject => {
		//ask and insert to db
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('add video button')
					.setLabel('wah!')
					.setStyle('PRIMARY'),
			);
		return message.reply({
			content: 'do yu wah tuu ti?',
			components: [row],
			allowedMentions: { repliedUser: false },
		})
	})
	.then( replyMessage => {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(replyMessage);
			}, 5000);
		})
	})
	.then( replyMessage => {
		return replyMessage.delete();
	})
	.catch(error => {
		if(error.code == 10008) return console.error('10008 content listener');
		console.error(error);
		// message.client.users.fetch("172302195356729355")
		// .then(user => user.createDM())
		// .then(DMChannel => DMChannel.send(`###Error at youtubeThing##\`\`\`${err}\`\`\``));
	})
}
