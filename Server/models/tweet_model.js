const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema({
  tweetedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  retweetBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
  date: {
    type: Date,
    default: Date.now
  },
  isReply: { type: Boolean, default: false },
});

const Tweet = mongoose.model('Tweet', TweetSchema);
module.exports = Tweet;
