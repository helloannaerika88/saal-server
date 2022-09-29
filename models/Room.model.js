const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const roomSchema = new Schema({
  title: String,
  description: String,
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
});

module.exports = model("Room", roomSchema);