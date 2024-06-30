'use strict';

const { default: mongoose } = require('mongoose');
const { countConnect } = require('../helpers/checkConn');
const {
  database: { host, port, name },
} = require('../configs/config.mongodb');
const MONGODB_URI =
  process.env.MONGODB_URI || `mongodb://${host}:${port}/${name}`;
// const connectString = `mongodb://${ecConfig}:27017/quangdvn-ec`;

mongoose
  .connect(MONGODB_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB', countConnect()))
  .catch((err) => console.log(err));

// Dev
if (1 === 1) {
  mongoose.set('debug', true);
  mongoose.set('debug', { color: true });
}

module.exports = mongoose;
