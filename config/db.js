const mongoose = require("mongoose")
const config = require('config')
const db = config.get('mongoURI')


const connectDB = async () => {
    try {
       await mongoose.connect(db, {
           useNewUrlParser: true,
           useCreateIndex: true,
           useFindAndModify: false
       })
       console.log("MongoDb is connected")
    } catch(err) {
        console.log(err.message)
        // EXIT process with failure
        process.exit(1)
    }
}

module.exports = connectDB

// const mongoose = require('mongoose');

// const connectionString = 'mongodb://localhost/socialapp';

// mongoose.connect(connectionString, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false
// });

// mongoose.connection.on('connected', () => {
//   console.log('mongoose connected to ', connectionString);
// });

// mongoose.connection.on('disconnected', () => {
//   console.log('mongoose disconnected to ', connectionString);
// });

// mongoose.connection.on('error', (error) => {
//   console.log('mongoose error ', error);
// });