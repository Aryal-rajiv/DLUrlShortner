//Connect with datbase

require("dotenv").config();
const mongoose = require('mongoose');

const mongoURL = process.env.MONGO_URL;

if (!mongoURL) {
    console.error("MongoDB connection URL not found in environment variables.");
    process.exit(1);
}

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURL, {
            serverSelectionTimeoutMS: 5000,// Stop trying after 5s if conection not establish
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}; 

//Event listeners for better connection
mongoose.connection.on('disconnected', async () => {
    console.log('MongoDB is disconnected. Trying to reconnect...');
    await connectDB();
});
mongoose.connection.on("error", err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
});

//Graceful shutdown
process.on('SIGINT', async() => {
    await mongoose.connection.close();
        console.log("MongoDB connection closed. Exiting...");
        process.exit(0);
});

module.exports = connectDB;