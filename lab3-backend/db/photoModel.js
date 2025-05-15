const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
  comment: String,
  date_time: Date,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
const photoSchema = new mongoose.Schema({
  file_name: String,
  date_time: Date,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [commentSchema],
});
module.exports = mongoose.model('Photo', photoSchema);