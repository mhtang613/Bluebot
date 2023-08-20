
const { SlashCommandBuilder } = require('discord.js');

const currency = require('./../currencyHelper.js');
const {Users, CurrencyShop, UserItems}  = require('./../dbObjects.js');





module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('Display the shop!'),

	async execute(interaction) {
		
		
	},
};