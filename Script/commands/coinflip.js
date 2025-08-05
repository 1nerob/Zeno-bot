module.exports.config = {
  name: "coinflip",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "NM Nerob",
  description: "Flip a coin and guess heads or tails",
  commandCategory: "games",
  usages: "coinflip heads | tails",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const userGuess = args[0]?.toLowerCase();
  const validChoices = ["heads", "tails"];

  if (!validChoices.includes(userGuess)) {
    return api.sendMessage(
      "❗ Please guess either `heads` or `tails`.\nUsage: !coinflip heads",
      event.threadID,
      event.messageID
    );
  }

  const result = validChoices[Math.floor(Math.random() * validChoices.length)];

  const response = (userGuess === result)
    ? `✅ You guessed **${userGuess}**.\n🪙 It was **${result}**.\n🎉 You win!`
    : `❌ You guessed **${userGuess}**.\n🪙 It was **${result}**.\n😢 You lose.`;

  api.sendMessage(`👋 Hello!\n${response}`, event.threadID, event.messageID);
};
