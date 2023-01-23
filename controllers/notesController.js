const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");  

//Fetching user Notes using GET request
const getUserNotes = asyncHandler(async (req, res) => {
    const { token } = req.query;
    console.log(token);
    const JWT_sec = process.env.JWTSEC;
    const tok2usr = jwt.verify(token, JWT_sec);
    const userId = tok2usr.id;
    const userNotes = Note.find({userId}).exec((err, data)=> {
        if (err)
            return res.status(500).json({message:err});
        else{

            if(data.length === 0)
                return res.status(200).json({message: "No Notes Available"});
            else
                return res.status(200).json({message: "Notes Fetch Successful", notes: data});
        }
    });
});

//Add a Note
const addUserNotes = asyncHandler(async (req, res) => {
    const { token, title, content, tags } = req.body;
    const JWT_sec = process.env.JWTSEC;
    const tok2usr = jwt.verify(token, JWT_sec);
    const userId = tok2usr.id;
    const noteObject = { userId, title, content, tags };

    const newUserNote = await Note.create(noteObject);
    if (newUserNote) {
        res.status(200).json({ message: `New Note ${newUserNote.title} created` });
    }
    else {
        res.status(400).json({ message: "Invalid note data recieved" });
    }
});


//Updating the user Notes
const updateUserNotes = asyncHandler(async (req, res) => {
    const { token, noteId, title, content, tags } = req.body;
    const JWT_sec = process.env.JWTSEC;
    const tok2usr = jwt.verify(token, JWT_sec);
    const userId = tok2usr.id;
    const noteObject = { userId, title, content, tags };
    const userUpdateNote = Note.findByIdAndUpdate(noteId,{"$set": noteObject}).exec((err, data)=>{
        if(err)
            return res.status(500).json({message:err});
        else{
            return res.status(200).json({message: "Note update successful", note: data});
        }

    });
});

//Delete the user Note
const deleteUserNotes = asyncHandler(async (req, res) => {
    const { token, noteId } = req.body;
    if(!Boolean(token) || !Boolean(noteId))
        return res.status(400).json({message: "Send all the required params"});

    const JWT_sec = process.env.JWTSEC;
    const tok2usr = jwt.verify(token, JWT_sec);
    const userId = tok2usr.id;
    if (!userId) {
        return res.status(400).json({ message: "User ID required" });
    }
    const userNote = await Note.findById(noteId).exec();
    if (!userNote) {
        return res.status(400).json({ message: "Note not found" });
    }
    const result = await userNote.deleteOne();
    res.json({ message: `Note ${result.title} with ID ${result.id} deleted`});
});

module.exports = { getUserNotes, addUserNotes, updateUserNotes, deleteUserNotes};