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
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB is disconnected. Trying to reconnect...');
    connectDB();
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







//Logic for handling URL Shortening and redirection

const port = process.env.PORT;
const URL = require("../models/urlSchema");
const { nanoid} = require("nanoid");
const dotenev = require("dotenv");
const validator = require("validator"); //For validating url

dotenev.config();

class UrlController {
    static async shortenUrl(req, res) {
        const { originalUrl } = req.body;

        //Ensure originalUrl is provided
        if (!originalUrl) {
            return res.status(400).json({ error: "Original Url is required."});
    
        }

        //Validate the URL before proceeding
        if (!validator.isURL(originalUrl,{ require_protocol: true })) {
            return res
            .status(400)
            .json ({ error: "Invalid URL format. Include 'http://' or 'https://'"});
        }

        try{
            //check if the url being passed already exists
            //If it does, return the shortened url
            let existingUrl = await URL.findOne({ originalUrl });
            if (existingUrl) {
                return res.json({
                    shortUrl: `${process.env.BASE_URL || port}/${
                        existingUrl.shortUrl}`,
                });
                }
                //if passed url doesn't exist, shorten and save it to the db
                const shortUrl = nanoid(6); // retuturns 6 digit id
                const newUrl = await URL.create({originalUrl, shortUrl});
               
                //appened base_url to the short URL and return the shortened url to the user
                 res.json({
                    shortUrl: `${process.env.BASE_URL || port}/${
                        newUrl.shortUrl
                    }`,
                 });

        } catch (error) {
            res.status(500).json({ error: `Server error: ${error.message}`});
        }
    }
    //handles url redirection
    static async redirectUrl(req, res){
        try{
            //get the shortUrl id from the request
            const { shortUrl } = req.params;
            const urlDoc = await URL.findOne({ shortUrl});

            if (!urlDoc) {
                return res.status(404).json({ error: "Short URL not found"});
            }

            //Increment click count before redirecting
            await URL.updateOne({ _id: urlDoc. _id}, { $inc:{ clicks: 1 } });

            //Redirect user to the original url
            res.redirect(urlDoc.originalUrl);
         } catch (error) {
            res.status(500).json({error: `Server error: ${error.message}`});
         }
    }

    //This is to get all shortened urls
    static async getAllUrls(req, res) {
        try{
            const urls = await URL.find().sort({ createdAT: -1});
            res.json(urls);

        }catch (error){
            res.status(500).json({error: `Server error: ${error.message}`});
        }
    }
}

module.exports = UrlController;