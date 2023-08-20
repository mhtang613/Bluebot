
const { SlashCommandBuilder } = require('discord.js');

const currency = require('./../currencyHelper.js');






module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Replies with balance!'),

	async execute(interaction) {
		const target = interaction.options.getUser('user') ?? interaction.user;
		return interaction.reply(`${target.tag} has ${currency.getBalance(target.id)}💰`);
	},
};