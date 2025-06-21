require('dotenv').config();
const connectDB = require("./database/db");
const express = require('express');
const cors = require('cors');
const urlRoutes = require('./routes/urlRoutes');

const app = express();
const port = process.env.PORT;


//conect to MongoDB
connectDB();


//Middleware to parse JSON request bodies
app.use(cors()); //Enables cors for all routes
app.use(express.json()); //To parse json request


//Define routes
app.use(urlRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}` ));