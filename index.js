const { Client, Events, GatewayIntentBits } = require("discord.js");
const { google } = require("googleapis");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const youtube = google.youtube({
  version: "v3",
  auth: "AIzaSyAnA4Ytz0dv9IbZ0LvFB-k04CvMY6ZlKOc",
});

function getRandomVideo(channelId) {
  return new Promise((resolve, reject) => {
    youtube.search.list(
      {
        part: "snippet",
        channelId: channelId,
        maxResults: 50,
        order: "date", // You can customize search parameters
      },
      (err, res) => {
        if (err) {
          console.error("Error fetching videos:", err);
          reject(err);
        } else {
          const videos = res.data.items;
          const randomVideo = videos[Math.floor(Math.random() * videos.length)];
          resolve(randomVideo);
        }
      },
    );
  });
}

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  const youtubeChannels = [];
  client.channels.fetch("1225813992606531629").then((channel) => {
    setInterval(async () => {
      const date = new Date();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      console.log(date.getHours())
      if (hours == 9 && minutes == 0 && seconds == 0) {
        const randomChannel = youtubeChannels[Math.floor(Math.random() * youtubeChannels.length)];
        const video = await getRandomVideo(randomChannel);
        client.users.send("1135502743289741416", `https://www.youtube.com/watch?v=${video.id.videoId}`);
      }
    }, 1000);
  });
});

client.login(process.env.TOKEN);
