
const { SlashCommandBuilder } = require('discord.js');

const currency = require('./../currencyHelper.js');
const {Users, CurrencyShop, UserItems}  = require('./../dbObjects.js');





module.exports = {
	data: new SlashCommandBuilder()
		.setName('inventory')
		.setDescription('Replies with inventory!'),

	async execute(interaction) {
		const target = interaction.options.getUser('user') ?? interaction.user;
		const user = await Users.findOne({ where: { user_id: target.id } });
		
		
		/* In dbObjects.js, in getItems method: "this.user_id" is undefined for
		   some reason. I should be able to just use "const items = await user.getItems();"	
		   Instead, I will do the following to get the items:	
		   
		   Note: added "await" before findAll(), or else items will have the 
		   Promise { <pending> } issue
		*/
		const items = await UserItems.findAll({
				where: { user_id: user.user_id },
				include: ['item'],
			});
		
		//console.log(items);
		if (!items.length) return interaction.reply(`${target.tag} has nothing!`);

		return interaction.reply(`${target.tag} currently has ${items.map(i => `${i.amount} ${i.item.name}`).join(', ')}`);
		
	},
};