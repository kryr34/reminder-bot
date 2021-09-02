
module.exports.execute = (client, interaction, args) => {
	const now = Date.now();
	return client.mongoClient.find({ guildId: interaction.guild.id },'hakkaDB','waitingVideos')
	.then(cursor => {
		return cursor.map(element => {
			return client.youtubeApi.getVideo(element.videoId)
			.then(videoObject => {
				if(!videoObject) return;
				videoObject.leftTime = videoObject.getLeftTime(now);
				return videoObject;
			});
		})
		.toArray();
	})
	.then(primises => {
		return Promise.all(primises)
	})
	.then(videos => {
		videos = videos.filter(video => video);
		if(videos.length == 0) {
			return interaction.reply('have novideo waiting!');
		}
		videos.sort((a, b) => {
			return b.leftTime - a.leftTime;
		});
		const embeds = videos.map(videoObject => {
			const footerText = videoObject.getFooterText(videoObject.leftTime);
			return videoObject.toEmbed()
			.setFooter(`${footerText} • ${videoObject.videoId}`);
		});
		return interaction.reply({
			embeds: embeds,
			ephemeral: true,
			allowedMentions: { repliedUser: false },
		});
	})
	.catch(console.error);
}

module.exports.data = {
	name: 'list',
	aliases: ['ls','l'],
	description: 'List the videos waiting now',
	type: 1
}
