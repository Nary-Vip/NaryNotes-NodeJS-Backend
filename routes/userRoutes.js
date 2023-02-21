const express = require("express");
const router = express.Router();
const User = require("../models/User");
const userController = require("../controllers/userController");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.route("/")
    .get(userController.getUserDetails)
    .post(userController.createNewUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

router.post("/login", async (req, res) => {
    const { emailId, password } = req.body;

    const user = await User.find({ emailId });
    console.log(user);
    if (user.length === 0) {
        return res.status(400).json({ message: "User not available" });
    }
    
    if (await bcrypt.compare(password, user[0].password)) {
        const JWT_sec = process.env.JWTSEC;
        const token = jwt.sign({ id: user[0].id, emailId: user[0].emailId }, JWT_sec);
        
        let obj = {
            "firstName": user[0].firstName,
            "lastName": user[0].lastName,
            "age": user[0].age,
            "country": user[0].country,
            "state": user[0].state,
            "roles": user[0].roles,
            "mobileNumber": user[0].mobileNumber,
            "emailId": emailId,
            "access_token": token,
            "profile": user[0].profile,
            "profileStatus": (user[0].firstName === undefined || user[0].lastName === undefined || user[0].age === undefined || user[0].country === undefined
                || user[0].state === undefined || user[0].roles === undefined || user[0].mobileNumber === undefined || user[0].emailId === undefined) ? false : true
        }
        
        if(user[0].firstName === undefined || user[0].lastName === undefined || user[0].age === undefined || user[0].country === undefined
        || user[0].state === undefined || user[0].roles === undefined || user[0].mobileNumber === undefined || user[0].emailId === undefined)
            return res.status(200).json({"user": obj, message: "Personal Details are not filled"});
        return res.status(200).json({ "user": obj, message: "Login Success"});
    }
    else {
        return res.status(401).json({ message: "Invalid Credentials" });
    }
});

module.exports = router;