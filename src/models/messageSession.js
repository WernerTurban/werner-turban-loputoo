const mongoose = require("mongoose");

const MessageSessionSchema = mongoose.Schema({
  therapistId: {
    type: String,
    required: true
  },
  clientId: {
    type: String,
    required: true
  },
  header: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("MessageSessions", MessageSessionSchema);
