const { Message } = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const { checkVideo } = require('../functoins/checkVideo');

module.exports.execute = (client, interaction, args) => {
	const message = interaction.options.getMessage('message');
	checkVideo(client, message)
	.then(videoObject => {
		if(!videoObject) return;
		return videoObject;
	})
	.then(videoObject => {
		const dbObject = {
			title: videoObject.title,
			videoId: videoObject.videoId,
			authorId: interaction.user.id,
			guildId: interaction.guild.id,
			type: videoObject.type,
			duration: videoObject.duration,
			scheduledStartTime: videoObject.liveStreamingDetails.scheduledStartTime,
			//remindUsers: [message.author.id],
		};
		dbInsert = client.mongoClient.insert(dbObject,'hakkaDB','waitingVideos')

		console.log(`[newVideo]\t${videoObject.videoId}\t${videoObject.title}`);
		
		const footerText = videoObject.getFooterText(videoObject.leftTime);
		const embed = videoObject.toEmbed()
			.setFooter(`${footerText} • ${videoObject.videoId}`);
		return interaction.reply({
			content: '*YOU WILL GET TUUTI!*',
			embeds: [embed],
			ephemeral: true,
		});
	})
	.catch(error => {
		if(error == 'Not Video') return interaction.reply({
			content: '*BUSHIVIDEO*',
			ephemeral: true,
		});
		if(error == 'Mismatch') return interaction.reply({
			content: 'Not Live or Premiere',
			ephemeral: true,
		});
		console.error(error)
	})
};

module.exports.data = {
	name: "GET TUUTI!",
	aliases: [],
	description: "",
	type: 3
}