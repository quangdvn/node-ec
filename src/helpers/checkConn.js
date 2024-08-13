'use strict';

const { default: mongoose } = require('mongoose');
const os = require('os');

const _SECONDS = 5000; // Every 5 seconds

// Check DB connect
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of MongoDB connections: ${numConnection}`);
};

// Check DB overload
const checkOverload = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length;
    const numCores = os.cpus().length; // 12-core
    const memoryUsage = process.memoryUsage().rss;
    // Assumption: Max numb of connections based on number of cores
    const maxConnections = numCores * 5;

    console.log(`Active Connection: ${numConnections}`);
    console.log(`Memory Usage: ${memoryUsage / (1024 * 1024)} MB`);

    if (numConnections > maxConnections) {
      console.log('DB Overload');
      console.log(`Current connections: ${numConnections}`);
      console.log(`Max connections: ${maxConnections}`);
      // notify.send(...)
    }
  }, _SECONDS);
};

module.exports = { countConnect, checkOverload };
