const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

const path = './commands';
const commandFiles = fs.readdirSync(path).filter(file => file.endsWith('.js'));

module.exports.deployGuildCommands = (client) => {
	const token = client.token;
	const clientId = client.user.id;
	const mongoClient = client.mongoClient;

	const commands = [];
	for (const file of commandFiles) {
		const { data } = require(`${path}/${file}`);
		if(data.type == 0) continue;
		if(data.global) continue;
		console.log(`[guild]${file} loaded!`);
		const command = {
			"name": data.name,
			"description": data.description,
			"type": data.type,
		};
		commands.push(command);
	}

	mongoClient.find({}, 'hakkaDB', 'settings')
	.then( cursor => {
		cursor.forEach(element => {
			const guildId = element.guildId;
			
			const rest = new REST({ version: '9' }).setToken(token);
			
			(async () => {
				try {
					await rest.put(
						Routes.applicationGuildCommands(clientId, guildId),
						{ body: commands },
					);
			
					console.log(`[guild-${guildId}]Successfully registered application commands.`);
				} catch (error) {
					console.error(error);
				}
			})();
		});
	})
	.catch(console.err);
}

module.exports.deployGlobalCommands = (client) => {
	const token = client.token;
	const clientId = client.user.id;

	const commands = [];
	for (const file of commandFiles) {
		const { data } = require(`${path}/${file}`);
		if(data.type == 0) continue;
		if(!data.global) continue;
		console.log(`[global]${file} loaded!`);
		const command = {
			"name": data.name,
			"description": data.description,
			"type": data.type,
		};
		commands.push(command);
	}
	
	const rest = new REST({ version: '9' }).setToken(token);
	
	(async () => {
		try {
			await rest.put(
				Routes.applicationCommands(clientId),
				{ body: commands },
			);
	
			console.log('[global]Successfully registered application commands.');
		} catch (error) {
			console.error(error);
		}
	})();
}
