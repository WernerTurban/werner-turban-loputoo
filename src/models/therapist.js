const mongoose = require("mongoose");

const TherapistSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  therapy: {
    type: Array,
    default: null
  },
  jobTitle: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: null
  },
  gender: {
    type: String,
    default: "female"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Therapists", TherapistSchema);
