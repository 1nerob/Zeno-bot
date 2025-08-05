const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "guessfootballer",
    aliases: ["guessfb", "footballquiz"],
    version: "1.0",
    author: "YourName",
    countDown: 10,
    role: 0,
    shortDescription: "Guess the footballer's name",
    longDescription: "Send a blurred footballer image and ask user to guess the name",
    category: "game",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message, event, api }) {
    const quizData = [
  { name: "Lionel Messi", image: "https://i.imgur.com/z9lh4F2.jpg" },     // top legend 2
  { name: "Cristiano Ronaldo", image: "https://i.imgur.com/v2q9JX7.jpg" }, // modern great 3
  { name: "Pelé", image: "https://i.imgur.com/pelestub.jpg" },             // all‑time legend 4
  { name: "Diego Maradona", image: "https://i.imgur.com/dmaradona.jpg" },  // iconic 5
  { name: "Johan Cruyff", image: "https://i.imgur.com/cruyff.jpg" },       // legendary playmaker 6
  { name: "Zinedine Zidane", image: "https://i.imgur.com/zidane.jpg" },     // classic No.10 7
  { name: "Ronaldo Nazário", image: "https://i.imgur.com/ronaldoold.jpg" },// phenomenon 8
  { name: "Ronaldinho", image: "https://i.imgur.com/ronaldinho.jpg" },     // flair legend 9
  { name: "Franz Beckenbauer", image: "https://i.imgur.com/beckenbauer.jpg" }, // defender legend 10
  { name: "Michel Platini", image: "https://i.imgur.com/platini.jpg" },    // midfield maestro 11
  { name: "Paolo Maldini", image: "https://i.imgur.com/maldini.jpg" },      // Italian legend 12
  { name: "Ferenc Puskás", image: "https://i.imgur.com/puskas.jpg" },      // goal machine 13
  { name: "Garrincha", image: "https://i.imgur.com/garrincha.jpg" },       // dribbling wizard 14
  { name: "Xavi Hernández", image: "https://i.imgur.com/xavi.jpg" },       // tiki‑taka king 15
  { name: "Andrés Iniesta", image: "https://i.imgur.com/iniesta.jpg" },     // midfield icon 16
  { name: "Marco van Basten", image: "https://i.imgur.com/vanbasten.jpg" }, // great striker 17
  { name: "Gerd Müller", image: "https://i.imgur.com/muller.jpg" },        // scoring legend 18
  { name: "George Best", image: "https://i.imgur.com/georgebest.jpg" },     // flair winger 19
  { name: "Bobby Charlton", image: "https://i.imgur.com/charlton.jpg" },   // England great 20
  { name: "Lothar Matthäus", image: "https://i.imgur.com/matthaus.jpg" },   // all‑rounder 21
  { name: "Thierry Henry", image: "https://i.imgur.com/henry.jpg" },       // explosive forward 22
  { name: "Luis Suárez", image: "https://i.imgur.com/suarez.jpg" },        // prolific striker 23
  { name: "Kaká", image: "https://i.imgur.com/kaka.jpg" },                   // Brazilian midfield star 24
  { name: "Roberto Baggio", image: "https://i.imgur.com/baggio.jpg" },     // Italian elegance 25
  { name: "Ruud Gullit", image: "https://i.imgur.com/gullit.jpg" },        // versatile star 26
  { name: "Franco Baresi", image: "https://i.imgur.com/baresи.jpg" },    // defensive rock 27
  { name: "Luka Modrić", image: "https://i.imgur.com/modric.jpg" },        // midfield genius 28
  { name: "Lev Yashin", image: "https://i.imgur.com/yashin.jpg" },         // greatest GK ever 29
  { name: "Robert Lewandowski", image: "https://i.imgur.com/lewa.jpg" },   // modern killer 30
  { name: "Neymar Jr.", image: "https://i.imgur.com/neymar.jpg" },         // flair Brazilian 31
  { name: "Kylian Mbappé", image: "https://i.imgur.com/mbappe.jpg" },      // current superstar 32
  { name: "Erling Haaland", image: "https://i.imgur.com/haaland.jpg" },    // scoring machine 33
  { name: "Vinícius Júnior", image: "https://i.imgur.com/vjr.jpg" },      // rising star 34
  { name: "Mohamed Salah", image: "https://i.imgur.com/salah.jpg" },       // Egyptian King 35
  { name: "Kevin De Bruyne", image: "https://i.imgur.com/debruyne.jpg" },  // maestro 36
  { name: "Rodri", image: "https://i.imgur.com/rodri.jpg" },                // pivotal midfielder 37
  { name: "Jude Bellingham", image: "https://i.imgur.com/bellingham.jpg" }, // young beast 38
  { name: "Lamine Yamal", image: "https://i.imgur.com/yamal.jpg" },        // teenage prodigy 39
  { name: "Sadio Mané", image: "https://i.imgur.com/mane.jpg" },            // speedster 40
  { name: "Samuel Eto’o", image: "https://i.imgur.com/etoo.jpg" },         // African legend 41
  { name: "David Beckham", image: "https://i.imgur.com/beckham.jpg" },     // icon on and off field 42
  { name: "George Weah", image: "https://i.imgur.com/weah.jpg" },           // former striker turned president 43
  { name: "Paul Breitner", image: "https://i.imgur.com/breitner.jpg" },    // German legend 44
  { name: "Hristo Stoichkov", image: "https://i.imgur.com/stoichkov.jpg" },// Bulgarian star 45
  { name: "Bobby Moore", image: "https://i.imgur.com/moore.jpg" },         // England World Cup captain 46
];

    const selected = quizData[Math.floor(Math.random() * quizData.length)];
    const imgPath = path.join(__dirname, "cache", "blurred_quiz.jpg");

    try {
      const response = await axios.get(selected.image, { responseType: "arraybuffer" });
      const image = await jimp.read(response.data);
      image.blur(10); // Blur the image
      await image.writeAsync(imgPath);

      message.reply({
        body: "🧠 Guess the footballer from this image!\nType your answer below 👇",
        attachment: fs.createReadStream(imgPath)
      }, async (err, info) => {
        if (err) return console.error(err);

        const answer = selected.name.toLowerCase();

        const handleReply = async ({ body, senderID, messageID }) => {
          if (senderID !== event.senderID) return;

          api.unsendMessage(info.messageID);
          if (body.toLowerCase().includes(answer)) {
            return api.sendMessage(`✅ Correct! It's ${selected.name} 🔥`, event.threadID);
          } else {
            return api.sendMessage(`❌ Wrong! The correct answer was ${selected.name}`, event.threadID);
          }
        };

        global.GoatBot.onReply.set(info.messageID, {
          commandName: "guessfootballer",
          author: event.senderID,
          messageID: info.messageID,
          handleReply
        });
      });
    } catch (err) {
      console.error(err);
      message.reply("❌ Couldn't load the image. Try again later.");
    }
  }
};
