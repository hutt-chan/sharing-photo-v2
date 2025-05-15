const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./db/userModel');
const Photo = require('./db/photoModel');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

console.log('MONGODB_URI:', process.env.MONGODB_URI);
// API 1: /user/list
app.get('/user/list', async (req, res) => {
  try {
    const users = await User.find().select('_id first_name last_name');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API 2: /user/:id
app.get('/user/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  try {
    const user = await User.findById(id).select('_id first_name last_name location description occupation');
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API 3: /photosOfUser/:id
app.get('/photosOfUser/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    const photos = await Photo.find({ user_id: id }).select('_id user_id comments file_name date_time');
    const formattedPhotos = await Promise.all(photos.map(async (photo) => {
      const formattedComments = await Promise.all(photo.comments.map(async (comment) => {
        const commentUser = await User.findById(comment.user_id).select('_id first_name last_name');
        return {
          comment: comment.comment,
          date_time: comment.date_time,
          _id: comment._id,
          user: commentUser ? {
            _id: commentUser._id,
            first_name: commentUser.first_name,
            last_name: commentUser.last_name,
          } : null,
        };
      }));
      return {
        _id: photo._id,
        user_id: photo.user_id,
        comments: formattedComments,
        file_name: photo.file_name,
        date_time: photo.date_time,
      };
    }));
    res.json(formattedPhotos);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));