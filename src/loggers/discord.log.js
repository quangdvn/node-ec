'use strict';

const { Client, GatewayIntentBits } = require('discord.js');
const { DISCORD_LOG_CHANNEL_ID, DISCORD_BOT_TOKEN } = process.env;

class DiscordLoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    this.channelId = DISCORD_LOG_CHANNEL_ID;

    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client.user.tag}!`);
    });

    this.client.login(DISCORD_BOT_TOKEN);
  }

  sendToMessage(message = 'message') {
    const channel = this.client.channels.cache.get(this.channelId);
    if (!channel) {
      console.log('Error: Discord channel not found');
      return;
    }
    channel.send(message).catch((err) => console.log(err));
  }

  sendToFormatCode(logData) {
    const {
      code,
      message = 'This is additional information',
      title = 'Code example',
    } = logData;

    const codeMessage = {
      content: message,
      embeds: [
        {
          title: title,
          color: parseInt('00ff00', 16),
          description: '```json\n' + JSON.stringify(code, null, 2) + '\n```',
        },
      ],
    };
    this.sendToMessage(codeMessage);
  }
}

module.exports = new DiscordLoggerService();
