module.exports = {
	name: 'args-info',
	description: 'Information about the arguments provided.',
	args: true,
	//usage: '<user> <role>',
	//guildOnly: true,
	//cooldown: 5,
	//aliases: ['icon', 'pfp'],
	execute(message, args) {
		if (args[0] === 'foo') {
			return message.channel.send('bar');
		}

		message.channel.send(`First argument: ${args[0]}`);
	},
};
