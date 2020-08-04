const mongoose = require("mongoose");

const SessionSchema = mongoose.Schema({
  therapistId: {
    type: String,
    required: true
  },
  therapistName: {
    type: String,
    required: true
  },
  clientId: {
    type: String,
    required: true
  },
  clientName: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Sessions", SessionSchema);
