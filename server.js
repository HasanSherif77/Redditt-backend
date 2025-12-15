// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

/* =====================
   Database Connection
===================== */
connectDB();

/* =====================
   Middlewares
===================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =====================
   Request Logger (optional)
===================== */
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

/* =====================
   Basic Routes
===================== */
app.get('/', (req, res) => {
  res.json({
    message: 'Reddit Backend API',
    version: '1.0.0',
    endpoints: {
      auth: {
        signup: 'POST /api/users/signup',
        login: 'POST /api/users/login',
        currentUser: 'GET /api/users/me'
      },
      users: {
        getAll: 'GET /api/users',
        getOne: 'GET /api/users/:id',
        update: 'PUT /api/users/:id',
        delete: 'DELETE /api/users/:id'
      },
      messages: {
        getAll: 'GET /api/messages',
        getOne: 'GET /api/messages/:id',
        create: 'POST /api/messages',
        update: 'PUT /api/messages/:id',
        delete: 'DELETE /api/messages/:id'
      }
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

/* =====================
   API Routes
===================== */
app.use('/api/users', require('./users/userRoute'));
app.use('/api/messages', require('./messages/messageRoute'));

/* =====================
   Error Handler
===================== */
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

/* =====================
   404 Handler
===================== */
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl
  });
});

/* =====================
   Server Start
===================== */
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║         Reddit Backend Server          ║
╠════════════════════════════════════════╣
║  🚀 Server running on port: ${PORT}      ║
║  📍 Local: http://localhost:${PORT}      ║
║  🗄️  Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}              ║
╚════════════════════════════════════════╝

📋 Available Endpoints:
  • Health Check:  GET  /health
  • API Docs:      GET  /
  
🔐 Authentication:
  • Signup:        POST /api/users/signup
  • Login:         POST /api/users/login
  • Current User:  GET  /api/users/me (requires token)

👥 Users:
  • All Users:     GET  /api/users (requires token)
  • User by ID:    GET  /api/users/:id (requires token)

💬 Messages:
  • All Messages:  GET  /api/messages (requires token)
  • Send Message:  POST /api/messages (requires token)

🔧 Use Authorization Header: Bearer <token>
`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Server shutting down...');
  mongoose.connection.close();
  process.exit(0);
});