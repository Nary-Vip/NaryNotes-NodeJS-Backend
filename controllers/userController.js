const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const getAllUser = asyncHandler(async (req, res)=>{
    const users = await User.find().select("-password").lean();
    if(!users || users.length == 0){
        return res.status(400).json({message:"No users available"});
    }
    res.json(users);
})

const createNewUser = asyncHandler(async (req, res)=>{
    const { username, password, roles } = req.body;
    if(!username || !password || !Array.isArray(roles) || !roles.length){
        return res.status(400).json({message: "All fields are required"});
    }
    const user = await User.findOne({username}).lean().exec();
    if(user){
        return res.status(409).json({message: "User already exists"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userObject = { username, "password" : hashedPassword, roles };

    const newUser = await User.create(userObject);
    if(newUser){
        res.status(200).json({message: `New User ${username} created`});
    }
    else{
        res.status(400).json({message: "Invalid user data recieved"});
    }

})

const updateUser = asyncHandler(async (req, res)=>{
    
    const { id, username, password, roles, active } = req.body;

    if(!username || !Array.isArray(roles) || !roles.length || !active || !id || typeof active !== 'boolean'){
        return res.status(400).json({message: "All fields are required"});
    }

    const user = await User.findById(id).exec();
    if(!user){
        return res.status(400).json({message: "User not found"});
    }
    const duplicate =await User.findOne({username}).lean().exec();

    if(duplicate && duplicate._id.toString() !== id){
        return res.status(409).json({message: "User already there with this username"});
    }

    user.username = username
    user.roles = roles
    user.active = active

    if(password){
        user.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await user.save();

    res.json(200).json({message: `${updatedUser.username} Updated`});
})

const deleteUser = asyncHandler(async (req, res)=>{
    const { id } = req.body;
    if(!id){
        return res.status(400).json({message: "User ID required"});
    }

    const notes = await Note.findOne({user: id}).lean().exec();
    if(notes?.length){
        return res.status(400).json({message: "User has assigned notes"});
    }

    const user = await User.findById(id).exec();
    if(!user){
        return res.status(400).json({message: "User not found"});
    }

    const result = await user.deleteOne();

    res.json({message: `Userame ${result.username} with ID ${result.id} deleted`});
})


module.exports = {getAllUser, createNewUser, updateUser, deleteUser};