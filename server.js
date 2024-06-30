const app = require('./src/app');

const PORT = process.env.PORT || 3335;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// process.on('SIGINT', () => {
//   server.close(() => {
//     console.log('Server closed');
//   });
// });

// process.on('SIGINT', () => {
//   server.close();
// });

// process.on('exit', (code) => {
//   if (code === 0) {
//     console.log('Server closed');
//   } else {
//     console.error('Server did not close gracefully');
//   }
// });
