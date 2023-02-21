const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUserDetails = asyncHandler(async (req, res) => {
    const { token } = req.query;
    const JWT_sec = process.env.JWTSEC;
    const tok2usr = jwt.verify(token, JWT_sec);
    const id = tok2usr.id;
    const user = await User.findById(id).select("-password");
    if (!user || user.length == 0) {
        return res.status(400).json({ message: "No users available" });
    }
    let obj = {
        "firstName": user.firstName,
        "lastName": user.lastName,
        "age": user.age,
        "country": user.country,
        "state": user.state,
        "roles": user.roles,
        "mobileNumber": user.mobileNumber,
        "emailId": user.emailId,
        "access_token": token,
        "profile": user.profile,
        "profileStatus": (user.firstName === undefined || user.lastName === undefined || user.age === undefined || user.country === undefined
            || user.state === undefined || user.roles === undefined || user.mobileNumber === undefined || user.emailId === undefined) ? false : true
    }
    res.status(200).json({"user": obj});
})


//signup
const createNewUser = asyncHandler(async (req, res) => {
    const { emailId, password } = req.body;
    const user = await User.find({ emailId });
    if (user.length > 0) {
        return res.status(400).json({ message: "User already available" });
    }
    hashedPassword = await bcrypt.hash(password, 10);
    let userObject = {
        "emailId": emailId,
        "password": hashedPassword
    };
    const newUser = await User.create(userObject);
    if (newUser) {
        res.status(200).json({ message: `New User ${newUser.emailId} created` });
    }
    else {
        res.status(400).json({ message: "Invalid user data recieved" });
    }


})

//Profile update
const updateUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, roles, mobileNumber, emailId, age, country,
        state, token, profile } = req.body;
    const JWT_sec = process.env.JWTSEC;
    const tok2usr = jwt.verify(token, JWT_sec);
    const usr_email = tok2usr.emailId;
    const obj = {
        firstName, lastName, roles, mobileNumber, emailId, age, country,
        state, token, profile
    };
    const userObject = {
        firstName, lastName, roles, mobileNumber, emailId, age, country,
        state, 'access_token': token, 'profileStatus': true, profile
    };

    if (Boolean(firstName) && Boolean(lastName) && Boolean(roles) && Boolean(mobileNumber) && Boolean(emailId) && Boolean(age) && Boolean(country) && Boolean(state)) {
        const user = User.findOneAndUpdate({ "email": usr_email }, { "$set": obj }).exec((err, data) => {
            if (err)
                return res.status(500).json({ message: `err ${err}` });
            else
                return res.status(200).json({ message: "The update has been recorded", "user": userObject });

        });
    }
    else
        return res.status(500).json({ message: "All fields are required" });
})

const deleteUser = asyncHandler(async (req, res) => {
    const { token } = req.body;
    const JWT_sec = process.env.JWTSEC;
    const tok2usr = jwt.verify(token, JWT_sec);
    const id = tok2usr.id;
    if (!id) {
        return res.status(400).json({ message: "User ID required" });
    }
    // const notes = await Note.findOne({ user: id }).lean().exec();
    // if (notes?.length) {
    //     return res.status(400).json({ message: "User has assigned notes" });
    // }
    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    const result = await user.deleteOne();
    res.json({ message: `Userame ${result.emailId} with ID ${result.id} deleted` });
})


module.exports = { getUserDetails, createNewUser, updateUser, deleteUser };