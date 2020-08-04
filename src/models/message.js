const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
  senderId: {
    type: String,
    required: true
  },
  receiverId: {
    type: String,
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  receiverName: {
    type: String,
    required: true
  },
  sended_at: {
    type: Date,
    default: Date.now
  },
  header: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  seen: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Messages", MessageSchema);
