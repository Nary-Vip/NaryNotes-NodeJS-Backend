require('dotenv').config()
// const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const path = require("path");
const errorHandler = require("./middleware/errorHandler");
const { logger, logEvents } = require("./middleware/logger");
const corsOptions = require("./config/corsOption");
const connectDb = require('./config/dbConnection');
const mongoose = require('mongoose');
const multer  = require("multer");
const { PythonShell } = require('python-shell');


const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, 'model/assets/');
    },
    filename: function (req, file, callback) {
      callback(null, "recorder.wav");
    }
  })

  const storageAudio = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, 'model/assets/');
    },
    filename: function (req, file, callback) {
        console.log(file.fieldname, "===");
      callback(null, file.originalname);
    }
  })
const uploadAudio = multer({ storage: storage });
const uploadImage = multer({ storage: storageAudio });

const app = express();
const PORT = process.env.PORT || 5000;

console.log(process.env.NODE_ENV, "environment");

connectDb();

app.use(logger); //cutsom middleware

app.use(cors(corsOptions));

app.use(express.json()); //inbuilt middleware which enables the server to parse json data.

// app.use(cookieParser()); //third party middleware

app.post('/speechtext', uploadAudio.single("audioFile"), async (req, response) => {
    console.log(req.file);
    let transcribedText = null;
    let bitRate = null;
    let options = {
        scriptPath: "E:/Projects/Personal Project/NaryNotes/narynotes-backend/model"
        
    }
    PythonShell.run("speechToText.py", options, (err, res) => {
        if (err) {
            console.log(err);
            response.status(500).json({ message: "Something went worng", "error": err });
        } if (res) {
            console.log(res);
            transcribedText = res[0];
            bitRate = res[1];
            response.status(200).json({ "message": "Successfully transcribed", "text": transcribedText, "bit-rate": bitRate });
        }
    });
});

app.post('/imagetext', uploadImage.single("image"), async (req, response) => {
    console.log(req.file, "===");
    let transcribedText = null;
    let options = {
        scriptPath: "E:/Projects/Personal Project/NaryNotes/narynotes-backend/model",
        args: [req.file.originalname]
    }
    PythonShell.run("tessaract.py", options, (err, res) => {
        if (err) {
            console.log(err);
            response.status(500).json({ message: "Something went worng", "error": err });
        } if (res) {
            console.log(res);
            transcribedText = res;
            response.status(200).json({ "message": "Successfully transcribed", "text": transcribedText});
        }
    });
});


app.use("/", express.static(path.join(__dirname, '/public'),),)

// app.use("/", require("./routes/root"),);

app.use('/users', require('./routes/userRoutes'));

app.use('/notes', require('./routes/notesRoutes'));

app.use('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, "views", "404.html"))
    }
    else if (req.accepts('json')) {
        res.json({ message: "404 not found" });
    }
    else {
        res.type('txt').send("404 not found");
    }
})


app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
        console.log(`Server Started at http://localhost:${PORT}`)
    });
});

mongoose.connection.on('error', (error)=>{
    console.log(error);
    logEvents(`${error.no}: ${error.code}\t${error.syscall}\t${error.hostname}`, 'mongoDBErrors.log');
})


