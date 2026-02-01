# CRAM Backend

This is the backend server for the CRAM project, built with Node.js, Express, and MongoDB.

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. Enter the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

1. Create a `.env` file in the `backend/` directory.
2. Use the template from `.env.example`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```
   *Note: Ask the project owner for the real MongoDB connection string.*

### Running the Server

- **Development Mode** (with auto-reload):
  ```bash
  npm run dev
  ```

- **Production Mode**:
  ```bash
  npm start
  ```

## 📂 Project Structure

- `server.js`: Main entry point.
- `config/`: Configuration files (e.g., database connection).
- `.env`: Secret environment variables (ignored by git).
- `.gitignore`: Prevents sensitive files from being pushed to the repository.

## 🔗 Database Access
Team members must be invited to the MongoDB Atlas project and ensure their IP addresses are whitelisted (the project is currently set to allow access from anywhere).
