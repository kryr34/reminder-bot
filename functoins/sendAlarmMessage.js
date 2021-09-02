
module.exports.sendAlarmMessage = (client, element, videoObject) => {
	const mongoClient = client.mongoClient;
	
	mongoClient.findOne({ guildId: element.guildId },"hakkaDB","settings")
	.then(settings => {
		return client.channels.fetch(settings.remind.channel);
	})
	.then(channel => {
		const embed = videoObject.toEmbed()
			.setFooter(`${videoObject.type}`);
		return channel.send({
		  	embeds: [embed],
			ephemeral: true,
			allowedMentions: { repliedUser: false },
		});
	})
	.then(() => {
		return mongoClient.delete(element,"hakkaDB","waitingVideos")
	})
	.then(() => console.log(`[removeVideo]\t${element.videoId}\t${videoObject.title}`))
	.catch(console.error);
}
