const mongoose = require('mongoose');

const connectDb = ()=>{
    try {
        mongoose.set('strictQuery', true);
        mongoose.connect(process.env.DATABASE_URI);
    } catch (error) {
        console.log(error);        
    }
}

module.exports = connectDb;