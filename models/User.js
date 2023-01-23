const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    mobileNumber: {
        type: String,
    },
    emailId: {
        type: String,
        required: true
    },
    age: {
        type: String,
    },
    country: {
        type: String,
    },
    state: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: String,
        default: "Employee"
    },
    profileUpdated: {
        type: Boolean,
    }
});

module.exports = mongoose.model('user', userSchema);