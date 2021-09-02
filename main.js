const { Client, Intents } = require('discord.js');
const { YoutubeApi } = require('./interfaces/youtubeApi');
const { myMongoClient } = require('./interfaces/mongoDB');
const fs = require("fs");
const { token, youtubeApiKey, mongoDBurl } = require('./secret.json');
const { contentListener } = require('./functoins/contentListener');
const { VideoListener } = require('./interfaces/videoListener');
const { sendAlarmMessage } = require('./functoins/sendAlarmMessage');

// Create a new client instance===============================================
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.youtubeApi = new YoutubeApi(youtubeApiKey);
client.mongoClient = new myMongoClient(mongoDBurl);
const videoListener = new VideoListener(client);
// clients = {
// 	discordClient: client,
// 	mongoClient: mongoClient,
// 	youtubeApi: youtubeApi,
// }

// Load Commands==============================================================
commands = new Map();
aliases = new Map();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	console.log(`${file} loaded!`);
	commands.set(command.data.name, command);
	command.data.aliases.forEach(alias => { 
		aliases.set(alias, command.data.name);
	});
}

// When the client is ready, run this code=====================================
client.on('ready', () => {
	console.log('[Ready!]');
});

// Process command and messaege================================================
args = [];
function getCommand(commandName){
	if (commands.has(commandName)) {
		return commands.get(commandName);
	}
	if (aliases.has(commandName)) {
		return commands.get(aliases.get(commandName));
	}
	return false;
}
client.on('interactionCreate', async interaction => {
	let commandId = '';
	if (interaction.isCommand()) commandId = interaction.commandName;
	if (interaction.isContextMenu()) commandId = interaction.commandName;
	if (interaction.isButton()) commandId = interaction.customId;

	const command = getCommand(commandId);
	if(!command) return;
	command.execute(client, interaction, args);
});
client.on('messageCreate', async message => {
	if(message.author.bot) return;
	if(message.channel.type === 'dm') return;
	if(message.content.startsWith('!y')) {
		const messageArray = message.content.toLowerCase().split(' ');
		messageArray.shift();
		const command = getCommand(messageArray[0]);
		if(!command) return;
		command.execute(client, message, args);
	}
	contentListener(client, message);
});

//video Listener==============================================================
videoListener.on('remind', async (element, videoObject) => {
	sendAlarmMessage(client, element, videoObject);
});

// Login to Discord with your client's token===================================
client.login(token);
// run video Listener==========================================================
videoListener.run(1000*10);