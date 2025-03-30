// const { Client, Intents } = require('discord.js');

// const client = new Client({
//   intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
// });

// client.login(process.env.DISCORD_BOT_TOKEN);

// // Check if a user is a member of a specific server
// exports.checkIfUserIsMember = async (userId, guildId) => {
//   try {
//     const guild = await client.guilds.fetch(guildId);
//     const member = await guild.members.fetch(userId);
//     return !!member;
//   } catch (error) {
//     console.error('Discord API error:', error);
//     return false;
//   }
// };