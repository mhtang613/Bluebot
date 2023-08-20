
const { SlashCommandBuilder } = require('discord.js');

const currency = require('./../currencyHelper.js');






module.exports = {
	data: new SlashCommandBuilder()
		.setName('checkbalance')
		.setDescription('Replies with balance of a user!')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user whose balance you want to check')
				.setRequired(true)),

	async execute(interaction) {
		const member = interaction.options.getMember('user');
		interaction.reply(`${member.tag} has ${currency.getBalance(member.id)}💰`);;
	},
};