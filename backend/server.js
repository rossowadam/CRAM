const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

/**
 * Route imports
 * We use singular names to match our decentralized file structure
 */
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');

// Initialize environment variables from .env file
dotenv.config();

// Establishes connection to MongoDB Atlas
connectDB();

const app = express();

/**
 * Middleware Configuration
 */
// Allows the server to accept and parse JSON data in request bodies
app.use(express.json());

// Enables Cross-Origin Resource Sharing (allows frontend to talk to backend)
app.use(cors());

// HTTP request logger middleware for development environment
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

/**
 * API Route Mappings
 * Maps URL paths to their respective route handlers
 */
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/users', userRoutes);

// Base route for API status check
app.get('/', (req, res) => {
    res.send('CRAM API is running...');
});

// Define server port (defaults to 5000 if not specified in .env)
const PORT = process.env.PORT || 5000;

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
