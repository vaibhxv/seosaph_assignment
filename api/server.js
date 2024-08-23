// server.js
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/UserRoutes');
const cors = require('cors');


const app = express();
app.use(cors());

// Connect to database
connectDB();

//Middleware
app.use(express.json());

// Routes
app.use('/api', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});


const PORT = process.env.PORT || 8989;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
