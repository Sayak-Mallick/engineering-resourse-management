const mongoose = require('mongoose');
const mongo_url = process.env.MONGO_CONN;

mongoose.connect(mongo_url).then(() => {
  console.log("\x1b[32m🚀 MongoDB connected successfully 🔥\x1b[0m");
}).catch((err) => {
  console.error("\x1b[31m🚨 MongoDB connection failed: ", err.message, "\x1b[0m");
});
