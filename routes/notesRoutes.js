const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notesController"); 

router.route("/")
    .get(notesController.getUserNotes)
    .post(notesController.addUserNotes)
    .patch(notesController.updateUserNotes)
    .delete(notesController.deleteUserNotes);

    
module.exports = router;