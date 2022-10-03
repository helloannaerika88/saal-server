const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const roomSchema = new Schema({
  title: String,
  description: String,
  imageUrl: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
});

module.exports = model("Room", roomSchema);