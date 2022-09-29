const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const itemSchema = new Schema({
  title: String,
  description: String,
  room: { type: Schema.Types.ObjectId, ref: "Room" },
});

module.exports = model("Item", itemSchema);
