const request = require('request-promise-native');
const { VideoObject } =  require('../class/VideoObject');

const V3 = class {
	constructor(apiKey) {
		this.API_KEY = apiKey;
	}
	get(resource,part,arg) {
		let url = `https://www.googleapis.com/youtube/v3/${resource}?key=${this.API_KEY}&part=${part.join('&part=')}`;
		Object.entries(arg).forEach(element => url += `&${element[0]}=${element[1]}`);

		return request(url,{json:true})
		.then((body) => {
			return(body.items[0]);
		});
	}
}

module.exports.YoutubeApi = class YoutubeApi {
	constructor(apiKey) {
		this.v3 = new V3(apiKey);
	}
	getVideo(videoId) {
		return this.v3.get("videos",["snippet","contentDetails","liveStreamingDetails"],{id: videoId})
		.then(item => {
			if(!item) return;
			return new VideoObject(item);
		})
	}
}