'use strict';

const redis = require('redis');

class PubSubService {
  constructor() {
    this.subscriber = redis.createClient({
      host: '127.0.0.1',
      port: 6379,
    });
    this.publisher = redis.createClient({
      host: '127.0.0.1',
      port: 6379,
    });

    // Handle connection errors
    this.subscriber.on('error', (err) =>
      console.error('Subscriber Error:', err)
    );
    this.publisher.on('error', (err) => console.error('Publisher Error:', err));

    // Log when connected
    this.subscriber.on('connect', () =>
      console.log('Subscriber connected to Redis')
    );
    this.publisher.on('connect', () =>
      console.log('Publisher connected to Redis')
    );
  }

  publish(channel, message) {
    return new Promise((resolve, reject) => {
      this.publisher.publish(channel, JSON.stringify(message), (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  subscribe(channel, callback) {
    this.subscriber.subscribe(channel);
    this.subscriber.on('message', (subscribeChannel, message) => {
      console.log(`Received message: "${message}" from channel: "${channel}"`);
      if (channel === subscribeChannel) {
        callback(channel, JSON.parse(message));
      }
    });
  }
}

module.exports = new PubSubService();
