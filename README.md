# Redditt-backend

Backend API for Reddit-like application using Express.js and MongoDB.

## Base URL

```
http://localhost:5000
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

---

## API Endpoints

### Users

#### Public Routes

**POST** `/users/signup`
- Create a new user account
- **Request Body:**
  ```json
  {
    "username": "string (required, min 3 chars, unique)",
    "email": "string (required, unique)",
    "password": "string (required, min 6 chars)",
    "displayname": "string (optional)",
    "avatarUrl": "string (optional)",
    "description": "string (optional, max 500 chars)"
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "user": { ... },
    "token": "jwt_token"
  }
  ```

**POST** `/users/login`
- Login user and get JWT token
- **Request Body:**
  ```json
  {
    "email": "string (required)",
    "password": "string (required)"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "user": { ... },
    "token": "jwt_token"
  }
  ```

**POST** `/users/logout`
- Logout user (client-side)
- **Response:** `200 OK`
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

#### Protected Routes

**GET** `/users/me`
- Get current authenticated user profile
- **Auth:** Required
- **Response:** `200 OK` - User object

**GET** `/users`
- Get all users
- **Auth:** Required
- **Response:** `200 OK` - Array of users

**GET** `/users/:id`
- Get user by ID
- **Auth:** Required
- **Response:** `200 OK` - User object

**GET** `/users/info/:id`
- Get user info (displayname, username, avatarUrl, joinedCommunities)
- **Auth:** Required
- **Response:** `200 OK`
  ```json
  {
    "displayname": "string",
    "username": "string",
    "avatarUrl": "string",
    "joinedCommunities": [...]
  }
  ```

**GET** `/users/search/:query`
- Search users by username, displayname, or email
- **Auth:** Required
- **Note:** Excludes current user from results
- **Response:** `200 OK` - Array of matching users

**PATCH** `/users/me`
- Update current user profile
- **Auth:** Required
- **Request Body:** (any user fields to update, except password)
  ```json
  {
    "displayname": "string",
    "avatarUrl": "string",
    "description": "string"
  }
  ```
- **Response:** `200 OK` - Updated user object

**DELETE** `/users/me`
- Delete current user account
- **Auth:** Required
- **Response:** `200 OK`
  ```json
  {
    "message": "User deleted successfully"
  }
  ```

**POST** `/users/communities/:communityId/join`
- Join a community
- **Auth:** Required
- **Response:** `200 OK` - Updated user object with joined communities

**POST** `/users/communities/:communityId/leave`
- Leave a community
- **Auth:** Required
- **Response:** `200 OK` - Updated user object

---

### Posts

**GET** `/posts`
- Get feed (all posts if not authenticated, custom feed if authenticated)
- **Auth:** Optional
- **Custom Feed Logic:** Posts from joined communities first, then other posts (sorted by newest first)
- **Response:** `200 OK` - Array of posts

**GET** `/posts/me`
- Get all posts by the current user
- **Auth:** Required
- **Response:** `200 OK` - Array of posts

**GET** `/posts/user/:userId`
- Get all posts by a specific user
- **Auth:** Required
- **Response:** `200 OK` - Array of posts (sorted by newest first)

**GET** `/posts/community/:communityId`
- Get all posts in a specific community
- **Auth:** Required
- **Response:** `200 OK` - Array of posts

**GET** `/posts/search/:query`
- Search posts by title or body content
- **Auth:** Optional
- **Response:** `200 OK` - Array of matching posts (sorted by newest first)

**GET** `/posts/:id`
- Get post by ID
- **Auth:** Required
- **Response:** `200 OK` - Post object

**POST** `/posts`
- Create new post
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "communityId": "ObjectId (optional)",
    "title": "string (required)",
    "body": "string (optional)",
    "mediaUrl": "string (optional)"
  }
  ```
- **Note:** `userId` is automatically set from authenticated user
- **Response:** `201 Created` - Post object

**PATCH** `/posts/:id`
- Update post
- **Auth:** Required
- **Request Body:** (any post fields to update)
- **Response:** `200 OK` - Updated post object

**DELETE** `/posts/:id`
- Delete post
- **Auth:** Required
- **Response:** `200 OK`
  ```json
  {
    "message": "Post deleted successfully"
  }
  ```

**POST** `/posts/:id/upvote`
- Upvote a post (increments votesCount)
- **Auth:** Required
- **Note:** Creates notification for post owner (if not own post)
- **Response:** `200 OK` - Updated post object

**POST** `/posts/:id/downvote`
- Downvote a post (decrements votesCount)
- **Auth:** Required
- **Note:** Creates notification for post owner (if not own post)
- **Response:** `200 OK` - Updated post object

---

### Comments

**GET** `/comments/me`
- Get all comments by the current user
- **Auth:** Required
- **Response:** `200 OK` - Array of comments

**GET** `/comments/post/:postId`
- Get all comments for a specific post
- **Auth:** Required
- **Response:** `200 OK` - Array of comments

**GET** `/comments/search/:query`
- Search comments by content
- **Auth:** Required
- **Response:** `200 OK` - Array of matching comments (sorted by newest first)

**GET** `/comments/:id`
- Get comment by ID
- **Auth:** Required
- **Response:** `200 OK` - Comment object

**POST** `/comments`
- Create new comment
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "postId": "ObjectId (required)",
    "content": "string (required)",
    "parentComment": "ObjectId (optional, for replies)"
  }
  ```
- **Note:** 
  - `userId` is automatically set from authenticated user
  - Increments post `commentsCount` only if `parentComment` is null
  - Creates notification for post owner (if not own post)
- **Response:** `201 Created` - Comment object

**PATCH** `/comments/:id`
- Update comment
- **Auth:** Required
- **Request Body:** (any comment fields to update)
- **Response:** `200 OK` - Updated comment object

**DELETE** `/comments/:id`
- Delete comment
- **Auth:** Required
- **Response:** `200 OK`
  ```json
  {
    "message": "Comment deleted successfully"
  }
  ```

**POST** `/comments/:id/upvote`
- Upvote a comment (increments votes)
- **Auth:** Required
- **Note:** Creates notification for comment owner (if not own comment)
- **Response:** `200 OK` - Updated comment object

**POST** `/comments/:id/downvote`
- Downvote a comment (decrements votes)
- **Auth:** Required
- **Note:** Creates notification for comment owner (if not own comment)
- **Response:** `200 OK` - Updated comment object

---

### Communities

**GET** `/communities`
- Get all communities
- **Auth:** Required
- **Response:** `200 OK` - Array of communities

**GET** `/communities/me`
- Get all communities joined by the current user
- **Auth:** Required
- **Response:** `200 OK` - Array of joined communities

**GET** `/communities/info/:id`
- Get community info (name and icon) by ID
- **Auth:** Required
- **Response:** `200 OK`
  ```json
  {
    "communityName": "string",
    "communityIcon": "string"
  }
  ```

**GET** `/communities/search/:query`
- Search communities by name or description
- **Auth:** Required
- **Response:** `200 OK` - Array of matching communities

**POST** `/communities`
- Create new community
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "communityName": "string (required, unique)",
    "communityDescription": "string (required)",
    "communityIcon": "string (optional)",
    "communityBanner": "string (optional)"
  }
  ```
- **Response:** `201 Created` - Community object

**PATCH** `/communities`
- Update community
- **Auth:** Required
- **Request Body:** (any community fields to update)
- **Response:** `200 OK` - Updated community object

**DELETE** `/communities`
- Delete community
- **Auth:** Required
- **Response:** `200 OK`
  ```json
  {
    "message": "Community deleted successfully"
  }
  ```

---

### Messages

**GET** `/messages/me`
- Get all messages for current user (sent and received)
- **Auth:** Required
- **Response:** `200 OK` - Array of messages (sorted by newest first)

**GET** `/messages`
- Get all messages for current user (alternative route)
- **Auth:** Required
- **Response:** `200 OK` - Array of messages

**GET** `/messages/:id`
- Get specific message by ID
- **Auth:** Required
- **Note:** User must be sender or receiver
- **Response:** `200 OK` - Message object

**POST** `/messages`
- Create new message
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "content": "string (required, 1-1000 chars)",
    "receiver": "ObjectId (required)"
  }
  ```
- **Note:** Cannot send message to yourself
- **Response:** `201 Created` - Message object

**PUT** `/messages/:id`
- Update message (only sender can update)
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "content": "string (required)"
  }
  ```
- **Response:** `200 OK` - Updated message object

**DELETE** `/messages/:id`
- Delete message (only sender can delete)
- **Auth:** Required
- **Response:** `200 OK`
  ```json
  {
    "message": "Message deleted successfully"
  }
  ```

---

### Notifications

**GET** `/notifications`
- Get all notifications for the current user
- **Auth:** Required
- **Response:** `200 OK` - Array of notifications

**GET** `/notifications/me`
- Get notification by ID
- **Auth:** Required
- **Response:** `200 OK` - Notification object

**POST** `/notifications`
- Create new notification
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "type": "string (required, enum: 'comment', 'reply', 'upvote', 'downvote', 'message', 'community')",
    "action": "string (required, e.g., 'John upvoted your post')",
    "relatedUser": "ObjectId (optional)",
    "relatedPost": "ObjectId (optional)",
    "relatedComment": "ObjectId (optional)"
  }
  ```
- **Note:** `user` field is automatically set from authenticated user
- **Response:** `201 Created` - Notification object

**PATCH** `/notifications/me`
- Update notification (e.g., mark as read)
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "read": true
  }
  ```
- **Response:** `200 OK` - Updated notification object

**DELETE** `/notifications/me`
- Delete notification
- **Auth:** Required
- **Response:** `200 OK`
  ```json
  {
    "message": "Notification deleted successfully"
  }
  ```

---

### AI

**POST** `/ai/summarize`
- Summarize text using Hugging Face AI
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "text": "string (required, min 30 chars)"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "summary": "string"
  }
  ```
- **Error:** `500 Internal Server Error` if AI service fails

---

## Data Models

### User
```javascript
{
  _id: ObjectId,
  username: String (required, unique, min 3),
  email: String (required, unique),
  password: String (required, min 6, hashed),
  displayname: String,
  avatarUrl: String,
  description: String (max 500),
  joinedCommunities: [ObjectId] (ref: Community),
  createdAt: Date,
  updatedAt: Date
}
```

### Post
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  communityId: ObjectId (ref: Community, optional),
  title: String (required),
  body: String,
  mediaUrl: String,
  votesCount: Number (default: 0),
  commentsCount: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Comment
```javascript
{
  _id: ObjectId,
  postId: ObjectId (ref: Post, required),
  userId: ObjectId (ref: User, required),
  content: String (required),
  parentComment: ObjectId (ref: Comment, optional),
  votes: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Community
```javascript
{
  _id: ObjectId,
  communityName: String (required, unique),
  communityDescription: String (required),
  communityMembersCount: Number (default: 1),
  communityIcon: String,
  communityBanner: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Message
```javascript
{
  _id: ObjectId,
  content: String (required, 1-1000 chars),
  sender: ObjectId (ref: User, required),
  receiver: ObjectId (ref: User, required),
  read: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Notification
```javascript
{
  _id: ObjectId,
  type: String (required, enum: 'comment', 'reply', 'upvote', 'downvote', 'message', 'community'),
  action: String (required, e.g., 'John upvoted your post'),
  user: ObjectId (ref: User, required),
  relatedUser: ObjectId (ref: User, optional),
  relatedPost: ObjectId (ref: Post, optional),
  relatedComment: ObjectId (ref: Comment, optional),
  read: Boolean (default: false),
  createdAt: Date
}
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/reddit-clone
JWT_SECRET=your_secret_key_here
HF_API_KEY=your_huggingface_api_key_here
```

---

## Features

- ✅ JWT-based authentication
- ✅ User management (signup, login, profile)
- ✅ Post creation and management
- ✅ Comment system with replies
- ✅ Community system with join/leave
- ✅ Voting system (upvote/downvote) for posts and comments
- ✅ Real-time notifications
- ✅ Private messaging
- ✅ Search functionality (users, posts, comments, communities)
- ✅ Custom feed algorithm (prioritizes joined communities)
- ✅ AI text summarization
- ✅ Password hashing with bcrypt
- ✅ Data validation and error handling

---

## Installation

```bash
npm install
```

## Run

```bash
# Development (with auto-refresh)
npm run dev

# Production
npm start
```

---

## Notes

- All timestamps are automatically managed by Mongoose
- Passwords are automatically hashed before saving
- Notifications are automatically created for:
  - Comments on posts
  - Replies to comments
  - Upvotes/downvotes on posts and comments
- Community member count is automatically updated when users join/leave
- Post comment count is automatically updated when comments are created
- Custom feed prioritizes posts from joined communities, then shows other posts (all sorted by newest first)
