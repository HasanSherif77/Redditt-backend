const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const connectDB = require("./config/db");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const userRoutes = require('./users/userRoute');
const commentRoutes = require('./comments/commentRoute');
const postRoutes = require('./posts/postRoute');
const messageRoutes = require('./messages/messageRoute');
const communityRoutes = require('./communities/communityRoute');
const notificationRoutes = require('./notifications/notificationRoute');
const aiRoutes = require('./AI/aiRoute');

// Mount routes
app.use('/users', userRoutes);
app.use('/comments', commentRoutes);
app.use('/posts', postRoutes);
app.use('/messages', messageRoutes);
app.use('/communities', communityRoutes);
app.use('/notifications', notificationRoutes);
app.use('/ai', aiRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
