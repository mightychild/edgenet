// const { TwitterApi } = require('twitter-api-v2');

// const client = new TwitterApi({
//   appKey: process.env.TWITTER_API_KEY,
//   appSecret: process.env.TWITTER_API_SECRET,
//   accessToken: process.env.TWITTER_ACCESS_TOKEN,
//   accessSecret: process.env.TWITTER_ACCESS_SECRET,
// });

// // Check if a user follows a specific account
// exports.checkIfUserFollows = async (username, targetUsername) => {
//   try {
//     const user = await client.v2.userByUsername(username);
//     const following = await client.v2.following(user.data.id, { max_results: 1000 });

//     return following.data.some((user) => user.username === targetUsername);
//   } catch (error) {
//     console.error('Twitter API error:', error);
//     return false;
//   }
// };