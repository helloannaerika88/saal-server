const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const itemSchema = new Schema({
  title: String,
  description: String,
  imageUrl: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  room: { type: Schema.Types.ObjectId, ref: "Room" },
});

module.exports = model("Item", itemSchema);
