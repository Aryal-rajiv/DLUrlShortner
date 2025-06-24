const {UrlModel, UserModel} = require("../models/urlSchema");
const { nanoid} = require("nanoid");
const dotenev = require("dotenv");
const validator = require("validator");
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenev.config();

class UrlController {
    static async shortenUrl(req, res) {
        const { originalUrl } = req.body;

        if (!originalUrl) {
            return res.status(400).json({ error: "Original Url is required."});
    
        }

        if (!validator.isURL(originalUrl,{ require_protocol: true })) {
            return res
            .status(400)
            .json ({ error: "Invalid URL format. Include 'http://' or 'https://'"});
        }

        try{
            let existingUrl = await UrlModel.findOne({ originalUrl });
            if (existingUrl) {
                return res.json({
                    shortUrl: existingUrl.shortUrl
                });
                }
                const shortUrl = nanoid(6);
                const newUrl = await UrlModel.create({originalUrl, shortUrl});
                res.json({
                    shortUrl:newUrl.shortUrl
                 });

        } catch (error) {
            res.status(500).json({ error: `Server error: ${error.message}`});
        }
    }
    //handles url redirection
    static async redirectUrl(req, res){
        try{
            const { shortUrl } = req.params;
            const urlDoc = await UrlModel.findOne({ shortUrl});
            if (!urlDoc) {
                return res.status(404).json({ error: "Short URL not found"});
            }
            await UrlModel.updateOne({ _id: urlDoc. _id}, { $inc:{ clicks: 1 } });
            console.log(`Redirecting to: ${urlDoc.originalUrl}`);
            res.redirect(urlDoc.originalUrl);
         } catch (error) {
            res.status(500).json({error: `Server error: ${error.message}`});
         }
    }

    static async getAllUrls(req, res) {
        try{
            const urls = await UrlModel.find().sort({ createdAt: -1});
            res.json(urls);

        }catch (error){
            res.status(500).json({error: `Server error: ${error.message}`});
        }
    }

    static async login(req, res) {
        const { username, password } = req.body;
        const user = await UserModel.findOne({username: username});
        const secretKey = process.env.JWT_SECRET;
        if (user && bycrypt.compareSync(password , user.password)){
            const token = jwt.sign({id: user.id, password: user.password}, secretKey, {expiresIn: '1h'});
            res.json({ token: token });
        }else {
            res.status(401).send('Invalid Credentials');
        }
    }

    static async signup(req, res) {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required." });
        }
        try {
            const existingUser = await UserModel.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ error: "Username already exists." });
            }

            const hashedPassword = bycrypt.hashSync(password, 10);
            const newUser = await UserModel.create({ username, password: hashedPassword });
            res.status(201).json({ message: "User created successfully.", userId: newUser._id });

        } catch (error) {
            res.status(500).json({ error: `Server error: ${error.message}` });
        }
    }   
}

module.exports = UrlController;