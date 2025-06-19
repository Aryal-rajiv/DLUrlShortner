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
    createdAt: {type: Date, default: Date.now, expires: "30d"}, //Auto delete after 30 days
},
{versionkey: false} //prevents mongoose from adding version key  '__v' to document

);

module.exports = mongoose.model('URL', urlSchema);