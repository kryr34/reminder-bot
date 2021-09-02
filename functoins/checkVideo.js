const youtubeLinkRe = new RegExp('youtu\.?be.*(v=|/).{11}','i');

module.exports.checkVideo = (client, message) => {
	return new Promise((resolve, reject) => {
		const match = youtubeLinkRe.exec(message.content);
		if(!match) reject('Not Video');
		const videoId = match[0].substring(match[0].length-11);
		resolve(videoId);
	})
	.then(videoId => {
		return client.mongoClient.count({ videoId: videoId, guildId: message.guild.id },"hakkaDB","waitingVideos")
		.then(count => {
			if(count == 0) return videoId;
			else throw 'Existed';
		})
	})
	.then(videoId => {
		return client.youtubeApi.getVideo(videoId);
	})
	.then(videoObject => {
		if(
			!videoObject.hasOwnProperty('liveStreamingDetails') ||
			videoObject.type == "live" && videoObject.liveStreamingDetails.hasOwnProperty('actualStartTime') ||
			videoObject.type == "premiere" && videoObject.liveStreamingDetails.hasOwnProperty('actualEndTime')
		) throw "Mismatch";
		return videoObject;
	})
}