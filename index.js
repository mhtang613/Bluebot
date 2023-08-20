//Lines related to the currency system will have a comment above them

//curr - Require Sequelize
const { Op } = require('sequelize');

const fs = require('node:fs');
const path = require('node:path');
//curr - added Formatters and codeBlock
const { Client, codeBlock, Collection, Formatters, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
//curr - Import the Users and CurrencyShop models from dbObjects.js
const { Users, CurrencyShop } = require('./dbObjects.js');


//curr - added GatewayIntentBits.GuildMessages
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
//curr - Use a Collection for the currency variable, to act as a cache for each user's currency (so we don't have to lookup database)
//Normally use "const currency = new Collection();", but I get error
const currency = require('./currencyHelper.js');





//curr - add() helper function, adds amount to a user's balance 
Reflect.defineProperty(currency, 'add', {
	value: async (id, amount) => {
		const user = currency.get(id);

		if (user) {
			user.balance += Number(amount);
			return user.save();
		}

		const newUser = await Users.create({ user_id: id, balance: amount });
		currency.set(id, newUser);

		return newUser;
	},
});
//curr - getBalance() helper function
Reflect.defineProperty(currency, 'getBalance', {
	value: id => {
		const user = currency.get(id);
		return user ? user.balance : 0;
	},
});



// Setup all of the commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

// Runs once on startup
client.once('ready', async () => {
	//curr - added these 2 lines to sync the currency collection with the database
	const storedBalances = await Users.findAll();
	storedBalances.forEach(b => currency.set(b.user_id, b));

	console.log(`Logged in as ${client.user.tag}!`);
});

// Runs whenever a message is sent
// curr - added this to increment currency when talking
client.on('messageCreate', async message => {
	if (message.author.bot) return;
	currency.add(message.author.id, 1);
});

// Runs whenever a command is called
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;
	

	const command = client.commands.get(interaction.commandName);


	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);