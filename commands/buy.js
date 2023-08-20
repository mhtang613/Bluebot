
const { SlashCommandBuilder } = require('discord.js');

const currency = require('./../currencyHelper.js');
const {Users, CurrencyShop, UserItems}  = require('./../dbObjects.js');

const { Op } = require('sequelize');



module.exports = {
	data: new SlashCommandBuilder()
		.setName('buy')
		.setDescription('Buy an item!')
		.addStringOption(option =>
			option.setName('item')
				.setDescription('The name of the item you want to buy')
				.setRequired(true)),

	async execute(interaction) {
		const itemName = interaction.options.getString('item');
		const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: itemName } } });

		if (!item) return interaction.reply(`That item doesn't exist.`);
		if (item.cost > currency.getBalance(interaction.user.id)) {
			return interaction.reply(`You currently have ${getBalance(interaction.user.id)}, but the ${item.name} costs ${item.cost}!`);
		}

		const user = await Users.findOne({ where: { user_id: interaction.user.id } });
		currency.add(interaction.user.id, -item.cost);
		
		//await user.addItem(item);
		const userItem = await UserItems.findOne({
			where: { user_id: user.user_id, item_id: item.id },
		});
		if (userItem) {
			userItem.amount += 1;
			userItem.save();
		} else {
			UserItems.create({ user_id: user.user_id, item_id: item.id, amount: 1 });	
		}

		return interaction.reply(`You've bought: ${item.name}.`);
	},
};