const { EventEmitter }= require('events')
const { YoutubeApi } = require('./youtubeApi');
const { myMongoClient } = require('./mongoDB');
const d2n = require('iso8601-duration');

module.exports.VideoListener = class VideoListener extends EventEmitter {
	constructor(client) {
		super();
		this.youtubeApi = client.youtubeApi;
		this.mongoClient = client.mongoClient;
	}
	listener(self) {
		const mongoClient = self.mongoClient;
		const youtubeApi = self.youtubeApi;
		const now = Date.now();
		const sec = now / 1000;
		const halfHour = sec % 1800 == 0;
		mongoClient.find({},"hakkaDB","waitingVideos")
		.then(cursor => {
			cursor.forEach(element => {
				if( !(
					halfHour ||
					now - Date.parse(element.scheduledStartTime) + d2n.toSeconds(d2n.parse(element.duration)) > 0
				)) return;
				youtubeApi.getVideo(element.videoId)
				.then(videoObject => {
					if(!videoObject) return;
					if( element.type == "live" && videoObject.liveStreamingDetails.hasOwnProperty("actualStartTime") ||
						videoObject.liveStreamingDetails.hasOwnProperty("actualEndTime")
					){
						self.emit('remind',element,videoObject);
					}
					if(element.scheduledStartTime !== videoObject.liveStreamingDetails.scheduledStartTime) {
						let newElement = element;
						newElement.scheduledStartTime = videoObject.liveStreamingDetails.scheduledStartTime;
						mongoClient.updateOne(element, newElement, "hakkaDB","waitingVideos");
					}
				})
			});
		})
		.catch((err) => {
			console.error(err);
		});
	}
	run(interval) {
		this.listenerInterval = setInterval(this.listener, interval, this);
	}
	stop() {
		clearInterval(this.listenerInterval);
	}
}