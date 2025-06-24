const mongoose = require('mongoose');
const urlSchema = new mongoose.Schema({
    
    originalUrl: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    clicks: { type: Number, default: 0 },
    createdAt: {type: Date, default: Date.now, expires: "30d"},
},
{versionKey: false}

);

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
});

const UserModel = mongoose.model('User', userSchema);
const UrlModel = mongoose.model('Url', urlSchema);

module.exports = { UrlModel, UserModel };