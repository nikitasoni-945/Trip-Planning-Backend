const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  destination: String,
  dates: String,
  interests: [String],
  itinerary: String,
});

module.exports = mongoose.model("Trip", tripSchema);
