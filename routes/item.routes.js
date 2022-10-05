const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Room = require("../models/Room.model");
const Item = require("../models/Item.model");
const fileUploader = require("../config/cloudinary.config");

router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
  // console.log("file is: ", req.file)
 
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  
  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend
  
  res.json({ imageUrl: req.file.path });
});

//  POST /api/tasks  -  Creates a new task
router.post("/items", (req, res, next) => {
  const { title, description, imageUrl, owner, roomId } = req.body;

  Item.create({ owner, title, description, imageUrl, room: roomId })
    .then((newItem) => {
      return Room.findByIdAndUpdate(roomId, {
        $push: { items: newItem._id },
      });
    })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

//  GET /api/projects -  Retrieves all of the projects
router.get("/items", (req, res, next) => {
  Item.find()
    .populate("room")
    .then((allItems) => res.json(allItems))
    .catch((err) => res.json(err));
});

//  GET /api/tasks/:taskId  - Retrieves a specific task by id
router.get("/items/:itemId", (req, res, next) => {
  const { itemId } = req.params;

  Item.findById(itemId)
    .populate("room")
    .then((item) => res.json(item))
    .catch((error) => res.json(error));
});

// PUT  /api/tasks/:taskId  - Updates a specific task by id
router.put("/items/:itemId", (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Item.findByIdAndUpdate(itemId, req.body, { new: true })
    .then((updatedItem) => res.json(updatedItem))
    .catch((err) => res.json(err));
});

//  DELETE /api/tasks/:taskId  - Deletes a specific task by id
router.delete("/items/:itemId", (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Item.findByIdAndRemove(itemId)
    .then(() =>
      res.json({ message: `Item with ${itemId} is removed successfully.` })
    )
    .catch((error) => res.json(error));
});

module.exports = router;
