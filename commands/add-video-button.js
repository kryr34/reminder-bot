const { MessageEmbed } = require('discord.js');
const { checkVideo } = require('../functoins/checkVideo');

module.exports.execute = (client, interaction, args) => {
	interaction.message.fetchReference()
	.then( originMessage => {
		checkVideo(client, originMessage)
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
			const embed = new MessageEmbed()
				.setFooter(`${footerText}`)
				.setColor('#ff0000')
			return originMessage.reply({
				//content: '*YOU WILL GET TUUTI!*',
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
				allowedMentions: { repliedUser: false },
			});
			console.error(error)
		})
	})
	interaction.message.delete();
};

module.exports.data = {
	name: "add video button",
	aliases: [],
	description: "",
	type: 0
}
