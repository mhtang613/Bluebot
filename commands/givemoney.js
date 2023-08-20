
const { SlashCommandBuilder } = require('discord.js');

const currency = require('./../currencyHelper.js');






module.exports = {
	data: new SlashCommandBuilder()
		.setName('givemoney')
		.setDescription('Gives money to a user!')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user who you want to give money to')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('Amount to give')
				.setRequired(true)),

	async execute(interaction) {
		const member = interaction.options.getMember('user');
		currency.add(member.id, interaction.options.getInteger('amount'));
		interaction.reply(`${member.tag} has ${currency.getBalance(member.id)}💰`);;
	},
};