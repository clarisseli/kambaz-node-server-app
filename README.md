# Kambaz Server

This is the backend server for Kambaz, a rudimentary version of the widely acclaimed Learning Management System (LMS), Canvas. 
The server provides RESTful APIs for user authentication, course management, assignments, and an advanced quiz system. It handles all business logic, data persistence, and file uploads for the Kambaz platform. This server must be running for the frontend application to function properly. Here's the [link to the frontend repository](https://github.com/clarisseli/kambaz-react-web-app).

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Notable Features](#notable-features)
3. [Building and Running the Server](#building-and-running-the-server)

## Tech Stack
- **Node.js** runtime environment
- **Express.js** web application framework
- **MongoDB** NoSQL database for flexible data storage
- **Mongoose** ODM for MongoDB schema validation
- **Express Sessions** for user authentication
- **Multer** for handling file uploads
- **CORS** for cross-origin resource sharing
- **dotenv** for environment configuration

## Notable Features

### 🔐 Secure Authentication System
The server implements session-based authentication with secure cookies, ensuring that user sessions persist across requests while maintaining security best practices for production environments.


### 📊 Comprehensive Data Models
Well-structured schemas for all entities:
- Users with role-based permissions
- Courses with rich metadata
- Quizzes with support for multiple question types
- Enrollments tracking student-course relationships
- Assignments with due dates and submission tracking

### 🎯 Advanced Quiz Engine
The quiz system supports:
- Multiple question types (multiple choice, true/false, fill-in-the-blank)
- Question randomization and answer shuffling
- Attempt tracking and score history
- Configurable time limits and access codes
- Automatic grading with feedback

### 📤 File Upload System
Integrated file upload functionality allows faculty to upload course images, with automatic file type validation and size restrictions to ensure optimal performance.

### 🔄 RESTful API Design
Clean, intuitive API endpoints following REST conventions, making it easy to understand and integrate with the frontend application.

## Building and Running the Server

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js)
- **Git** for cloning the repository

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/clarisseli/kambaz-node-server-app.git
   cd kambaz-node-server-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory with the following content:
   ```env
   NODE_ENV=development
   SESSION_SECRET=your-secret-key-here
   NODE_SERVER_DOMAIN=http://localhost:4000
   NETLIFY_URL=http://localhost:5173
   MONGO_CONNECTION_STRING=mongodb://127.0.0.1:27017/kambaz
   ```
   
   **Important:** Replace `your-secret-key-here` with a random string for security.

4. **Create required directories**
   ```bash
   mkdir -p public/images/coursePics
   ```

5. **Add default course image**
   
   Place a `default.jpg` file in the `public/images/coursePics/` directory. This will be used as the default image for courses without custom images.

6. **Start MongoDB**
   
   In a separate terminal, start MongoDB:
   ```bash
   mongod
   ```
   
   Leave this terminal running.

7. **Start the server**
   ```bash
   npm start
   ```
   
   You should see:
   ```
   Server is listening on port 4000
   ```

### Verification Steps

1. **Test the server is running**
   
   Open your browser and visit:
   - `http://localhost:4000/api/courses` - Should return `[]` (empty array)
   - `http://localhost:4000/api/users` - Should return user list

2. **Test with frontend**
   
   Now you can start the frontend application and it should connect successfully.


## Author
**Clarisse Li**
- GitHub: [@clarisseli](https://github.com/clarisseli)
- LinkedIn: [Clarisse Li](https://www.linkedin.com/in/mengru-clarisse-li/)
