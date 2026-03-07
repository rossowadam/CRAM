# CRAM Backend

This is the backend server for the CRAM project, built with Node.js, Express, and MongoDB.

##  Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. Enter the backend directory:
   cd backend


2. Install dependencies:
   npm install

### Configuration

1. Create a `.env` file in the `backend/` directory.
2. Use the template from `.env.example`:

   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   SESSION_SECRET=long_random_string
   NODE_ENV=development


### Running the Server

- **Development Mode** (with auto-reload):
  npm run dev

- **Production Mode**:
  npm start

### Database Seeding

To populate your database with the course data from `courses.json`, use the seeding script:

1. Ensure your MongoDB connection string is correctly set in the `.env` file.
2. Run the seeding script:
   node scripts/seed.js

Note: This script uses an "upsert" operation, meaning it will add new courses and update existing ones without creating duplicates.

##  Project Structure

- `server.js`: Main entry point.
- `config/`: Configuration files (e.g., database connection).
- `.env`: Secret environment variables (ignored by git).
- `.gitignore`: Prevents sensitive files from being pushed to the repository.

##   Database Access
Team members must be invited to the MongoDB Atlas project and ensure their IP addresses are whitelisted (the project is currently set to allow access from anywhere).
