const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notesController"); 

router.route("/")
    .get(notesController.getUserNotes)
    .post(notesController.addUserNotes)
    .patch(notesController.updateUserNotes)
    .delete(notesController.deleteUserNotes);

router.route("/content")
    // .get(notesController.getNoteFromAudio)
    .post(notesController.imageToText)

module.exports = router;