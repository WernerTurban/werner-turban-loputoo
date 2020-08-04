const mongoose = require("mongoose");

const ChatMessageSchema = mongoose.Schema({
  clientId: {
    type: String,
    required: true
  },
  therapistId: {
    type: String,
    required: true
  },
  senderId: {
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
  content: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("ChatMessages", ChatMessageSchema);
