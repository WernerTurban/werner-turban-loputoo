const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema({
  clientId: {
    type: String,
    required: true
  },
  therapistId: {
    type: String,
    required: true
  },
  appointmentId: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  messages: { type: Array, required: true }
});

module.exports = mongoose.model("Chats", ChatSchema);
