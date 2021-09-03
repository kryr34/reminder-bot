const { MessageEmbed } = require('discord.js');

module.exports.VideoObject = class {
	constructor(item) {
		this.videoId= item.id;
		this.title= item.snippet.title;
		this.channelName= item.snippet.channelTitle;
		this.channelId= item.snippet.channelId;
		this.type= item.contentDetails.duration == "P0D" ? "live" : "premiere";
		this.duration= item.contentDetails.duration;
		this.thumbnail= item.snippet.thumbnails.default;
		this.liveStreamingDetails= item.liveStreamingDetails;
	}
	toEmbed() {
		return new MessageEmbed()
		.setAuthor(
			this.channelName,
			'',
			`https://www.youtube.com/channel/${this.channelId}`)
		.setTitle(this.title)
		.setURL(`https://youtu.be/${this.videoId}`)
		.setThumbnail(this.thumbnail.url)
		.setColor('#ff0000')
	}
	getFooterText(leftTime) {
		if(!leftTime) leftTime = this.getLeftTime();
		if(leftTime < 0) return `まだ準備中なの`;
		const ato = leftTime / 1000;
		let text = '';
		if (ato/3600 > 1) text= `${parseInt(ato/3600)} 時間`;
		else if (ato/60 > 1) text= `${parseInt(ato/60)} 分`;
		else if (ato > 1) text= `${parseInt(ato)} 秒`;
		
		if (this.type == 'live') return text+' 後に live 配信';
		if (this.type == 'premiere') return text+' 後に premiere 公開';
	}
	// getTimeText(leftTime) {
	// 	if(!leftTime) leftTime = this.getLeftTime();
	// 	if(leftTime < 0) return `まだ準備中なの`;
	// 	const ato = leftTime / 1000;
	// 	if (ato/3600 > 1) return `${parseInt(ato/3600)} 時間`;
	// 	if (ato/60 > 1) return `${parseInt(ato/60)} 分`;
	// 	if (ato > 1) return `${parseInt(ato)} 秒`;
	// }
	// getTypeText() {
	// 	if (this.type == 'live') return '後に live 配信';
	// 	if (this.type == 'premiere') return '後に premiere 公開';
	// }
	getLeftTime(now) {
		if(!now) now = Date.now();
		return Date.parse(this.liveStreamingDetails.scheduledStartTime) - now;
	}
}