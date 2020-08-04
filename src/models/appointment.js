const mongoose = require("mongoose");

const AppointmentSchema = mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  formattedDate: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "available"
  },
  therapistId: {
    type: String,
    default: null
  },
  therapistName: {
    type: String,
    default: null
  },
  clientName: {
    type: String,
    default: null
  },
  clientId: {
    type: String,
    default: null
  },
  sessionId: {
    type: String,
    default: null
  },
  therapy: {
    type: String,
    default: null
  },
  available: {
    type: Boolean,
    default: true
  },
  date: {
    type: Date,
    required: true
  },
  hourId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Appointments", AppointmentSchema);
