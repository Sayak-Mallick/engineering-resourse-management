const express = require('express');
const app = express();
require('dotenv').config();
require('./Models/db'); // Ensure the database connection is established
const PORT = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProjectRouter = require('./Routes/ProjectRouter');
const AssignmentRouter = require('./Routes/AssignmentRouter');
const UserRouter = require('./Routes/UserRouter');
const DashboardRouter = require('./Routes/DashboardRouter');

app.get("/ping", (req, res) => {
  res.send( "pong" );
});

app.use(bodyParser.json());
app.use(cors());  // Enable CORS for all routes used by the frontend to access the backend 

// API Routes
app.use('/auth', AuthRouter);
app.use('/projects', ProjectRouter);
app.use('/assignments', AssignmentRouter);
app.use('/users', UserRouter);
app.use('/dashboard', DashboardRouter);

app.listen(PORT, () => {
  console.log(`\x1b[32m🚀 Server is running on port ${PORT} 🔥\x1b[0m`);
});
