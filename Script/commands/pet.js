const axios = require("axios");
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
  config: {
    name: "pet",
    aliases: [],
    version: "1.0",
    author: "OpenAI (based on your request)",
    countDown: 5,
    role: 0,
    shortDescription: "Make someone your dog 🐶",
    longDescription: "Creates a meme image showing a user petting someone as a dog",
    category: "fun",
    guide: {
      en: "{pn} @tag"
    }
  },

  onStart: async function ({ message, event, api }) {
    const mention = Object.keys(event.mentions);
    if (mention.length === 0) return message.reply("Tag someone to make them your dog 🐕");

    const ownerID = event.senderID;
    const dogID = mention[0];
    const ownerName = (await api.getUserInfo(ownerID))[ownerID].name;
    const dogName = (await api.getUserInfo(dogID))[dogID].name;

    try {
      const path = await createPetImage(ownerID, dogID);
      message.reply({
        body: `🐾 ${ownerName} is petting ${dogName} like a loyal dog!`,
        attachment: fs.createReadStream(path)
      }, () => fs.unlinkSync(path));
    } catch (err) {
      message.reply("❌ Failed to create the image.");
      console.error(err);
    }
  }
};

async function createPetImage(ownerID, dogID) {
  const ownerAvatar = await jimp.read(`https://graph.facebook.com/${ownerID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
  const dogAvatar = await jimp.read(`https://graph.facebook.com/${dogID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
  ownerAvatar.circle();
  dogAvatar.circle();

  const background = await jimp.read("https://i.imgur.com/3tYhZ4v.jpg"); // Funny "petting dog" image background
  const outputPath = "pet_dog.png";

  background
    .resize(800, 500)
    .composite(ownerAvatar.resize(100, 100), 200, 100)  // Owner head
    .composite(dogAvatar.resize(80, 80), 500, 300);     // Dog face

  await background.writeAsync(outputPath);
  return outputPath;
}
