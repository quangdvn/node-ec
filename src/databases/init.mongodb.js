'use strict';

const mongoose = require('mongoose');
const { countConnect } = require('../helpers/checkConn');
const {
  database: { host, port, name },
} = require('../configs/config.mongodb');
const MONGODB_URI =
  process.env.MONGODB_URI ||
  `mongodb://admin:mongo@localhost:27017/quangdvn-ec?authSource=admin`;

class Database {
  static instance = null;

  constructor() {
    this.connect();
  }

  async connect() {
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', { color: true, shell: true });
    }

    try {
      await mongoose.connect(MONGODB_URI, {
        maxPoolSize: 50, // Max number of connections
        maxConnecting: 5, // Max number of parallel connections
      });
      console.log('Connected to MongoDB as Singleton...', countConnect());
    } catch (err) {
      return console.error(err);
    }
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
