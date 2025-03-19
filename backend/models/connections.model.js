const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
  },
  connectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
  },
  status: {
    type: Boolean,
    default: null,
  },
});

module.exports = mongoose.model(
  "connectionRequestModel",
  connectionRequestSchema
);
