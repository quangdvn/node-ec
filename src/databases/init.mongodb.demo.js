'use strict';

const { default: mongoose } = require('mongoose');
const { countConnect } = require('../helpers/checkConn');

const connectString = `mongodb://localhost:27017/quangdvn-ec`;

mongoose
  .connect(connectString, {
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
