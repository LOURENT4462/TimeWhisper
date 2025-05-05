const { set: setEvent } = require("../../handlers/events");
const fs = require("fs");
const yaml = require("yaml");
const { CronJob } = require("cron");

const config = yaml.parse(fs.readFileSync('./addons/HeyMate/heymate.yml', 'utf8'));
const channelId = config.channel_id || "1116354701907206185";

module.exports.run = (client) => {
  const scheduleMessages = [
    { time: "00 6 * * *", key: "morning" },
    { time: "00 12 * * *", key: "afternoon" },
    { time: "00 15 * * *", key: "evening" },
    { time: "00 20 * * *", key: "night" },
  ];

  scheduleMessages.forEach(({ time, key }) => {
    new CronJob(
      time,
      () => sendMessage(client, config.messages[key]),
      null,
      true,
      "Asia/Jakarta"
    );
  });
};

function sendMessage(client, messageList) {
  const channel = client.channels.cache.get(channelId);
  if (channel && Array.isArray(messageList) && messageList.length > 0) {
    const message = messageList[Math.floor(Math.random() * messageList.length)];
    channel.send({ content: message }).catch(console.error);
  }
}
