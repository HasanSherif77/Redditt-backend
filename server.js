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

/* =====================
   Routes
===================== */
const userRoutes = require('./users/userRoute');
const postRoutes = require('./posts/postRoute');
const commentRoutes = require('./comments/commentRoute');
const messageRoutes = require('./messages/messageRoute');
const communityRoutes = require('./communities/communityRoute');
const notificationRoutes = require('./notifications/notificationRoute');
// i added /api/users instead of /users
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/notifications', notificationRoutes);
app.post('/test', (req, res) => {
  res.json({ ok: true });
});


/* =====================
   Health Check (optional)   just an extra
===================== */
app.get('/', (req, res) => {
  res.send('Reddit backend running 🚀');
});

/* =====================
   Server Start
===================== */
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
