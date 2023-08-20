

const { SlashCommandBuilder } = require('discord.js');

//money
const currency = require('./../currencyHelper.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('powerball')
		.setDescription('Choose 5 distinct numbers from 1-69 for the white numbers, and 1 number from 1-24 for the powerball!')
        .addIntegerOption(option =>
            option.setName('white1')
                .setDescription('White 1')
                .setRequired(true))
		.addIntegerOption(option =>
            option.setName('white2')
                .setDescription('White 2')
                .setRequired(true))
		.addIntegerOption(option =>
            option.setName('white3')
                .setDescription('White 3')
                .setRequired(true))
		.addIntegerOption(option =>
            option.setName('white4')
                .setDescription('White 4')
                .setRequired(true))
		.addIntegerOption(option =>
            option.setName('white5')
                .setDescription('White 5')
                .setRequired(true))
		.addIntegerOption(option =>
            option.setName('powerball')
                .setDescription('Powerball!')
                .setRequired(true)),
	async execute(interaction) {
        //money
        const target = interaction.options.getUser('user') ?? interaction.user;
        if (currency.getBalance(target.id) < 2) {
            await interaction.reply(`It costs $2 to play powerball! You only have $${currency.getBalance(target.id)}!`);
        } else {
        currency.add(target.id, -2);


        const num1 = interaction.options.getInteger('white1');
		const num2 = interaction.options.getInteger('white2');
		const num3 = interaction.options.getInteger('white3');
		const num4 = interaction.options.getInteger('white4');
		const num5 = interaction.options.getInteger('white5');
		const power = interaction.options.getInteger('powerball');

		const whites = [num1, num2, num3, num4, num5];
		if (isValidWhites(whites) || power < 1 || power > 24) {
			await interaction.reply('Invalid numbers, try again!');
		} else {
			await interaction.reply(`You chose ${num1}, ${num2}, ${num3}, ${num4}, ${num5} as the whites and ${power} as the powerball!`);
            //money - added target to args
		    const prize = isWin(target, whites, power);
            if (prize == 0) {
                await interaction.followUp('Sorry, you lost!');
            } else {
                await interaction.followUp(`You won $${prize}!`);
            }
        }
        }
	},
};


function isValidWhites(array) {
    var valuesSoFar = [];
    for (let i = 0; i < array.length; ++i) {
        var value = array[i];
		if (value < 1 || value > 69) return false;
        if (valuesSoFar.indexOf(value) !== -1) {
            return true;
        }
        valuesSoFar.push(value);
    }
    return false;
}

//Returns prize money value
//money - added target to args, added currency.add to win situations
function isWin(target, array, power) {
    //generate 5 distinct white numbers
    let valuesSoFar = [];
    while (valuesSoFar.length < 5){
        let white = getRandomInt(1, 69);
        if (valuesSoFar.indexOf(white) == -1) {
            valuesSoFar.push(white);
        }
    }
    //calc number of correct whites
    let numWins = 0;
    for (let i = 0; i < array.length; i++) {
        if (valuesSoFar.indexOf(array[i]) !== -1) {
            numWins++;
        }
    }
    //calc if powerball won 
    let winPower = (power == getRandomInt(1, 24) ? true : false);
    //calc reward
    if (numWins == 5 && winPower) {
        currency.add(target.id, 20000000);
        return 20000000;
    } else if (numWins == 5 && !winPower) {
        currency.add(target.id, 1000000);
        return 1000000;
    } else if (numWins == 4 && winPower) {
        currency.add(target.id, 50000);
        return 50000;
    } else if (numWins == 4 && !winPower) {
        currency.add(target.id, 100);
        return 100;
    } else if (numWins == 3 && winPower) {
        currency.add(target.id, 100);
        return 100;
    } else if (numWins == 3 && !winPower) {
        currency.add(target.id, 7);
        return 7;
    } else if (numWins == 2 && winPower) {
        currency.add(target.id, 7);
        return 7;
    } else if (numWins == 1 && winPower) {
        currency.add(target.id, 4);
        return 4;
    } else if (numWins == 1 && !winPower) {
        currency.add(target.id, 2);
        return 2;
    } else if (numWins == 0 && winPower) {
        currency.add(target.id, 4);
        return 4;        
    } else {
        return 0;
    }

}

//Random number between min and max, inclusive for both
function getRandomInt(min, max) {
    return Math.floor(Math.random()* (max-min+1) + min);
}