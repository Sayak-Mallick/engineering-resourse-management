const express = require('express');
const app = express();
require('dotenv').config();
require('./Models/db'); // Ensure the database connection is established
const PORT = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter'); // Import the AuthRouter

app.get("/ping", (req, res) => {
  res.send( "pong" );
});

app.use(bodyParser.json());
app.use(cors());  // Enable CORS for all routes used by the frontend to access the backend 
app.use('/auth', AuthRouter)

app.listen(PORT, () => {
  console.log(`\x1b[32m🚀 Server is running on port ${PORT} 🔥\x1b[0m`);
});
