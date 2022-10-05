const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Room = require("../models/Room.model");
const fileUploader = require("../config/cloudinary.config");
const Item = require("../models/Item.model");

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
//  POST /api/projects  -  Creates a new project
router.post("/rooms", (req, res, next) => {
  const { title, description, imageUrl, owner } = req.body;
  console.log(req.body);
  Room.create({ title, description, imageUrl,  owner, items: [] })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

//  GET /api/projects -  Retrieves all of the projects
router.get("/rooms", (req, res, next) => {
  Room.find()
    .populate("owner")
    .then((allRooms) => res.json(allRooms))
    .catch((err) => res.json(err));
});

//  GET /api/projects/:projectId -  Retrieves a specific project by id
router.get("/rooms/:roomId", (req, res, next) => {
  const { roomId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  // Each Project document has `tasks` array holding `_id`s of Task documents
  // We use .populate() method to get swap the `_id`s for the actual Task documents
  Room.findById(roomId)
    .populate("owner items")
    .then((room) => res.status(200).json(room))
    .catch((error) => res.json(error));
});

// PUT  /api/projects/:projectId  -  Updates a specific project by id
router.put("/rooms/:roomId", (req, res, next) => {
  const { roomId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Room.findByIdAndUpdate(roomId, req.body, { new: true })
    .then((updatedRoom) => res.json(updatedRoom))
    .catch((error) => res.json(error));
});

// DELETE  /api/projects/:projectId  -  Deletes a specific project by id
router.delete("/rooms/:roomId", (req, res, next) => {
  const { roomId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Room.findByIdAndRemove(roomId)
    .then(() =>
      res.json({
        message: `Room with ${roomId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});

module.exports = router;
