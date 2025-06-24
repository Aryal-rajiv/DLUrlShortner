require('dotenv').config();
const connectDB = require("./database/db");
const express = require('express');
const cors = require('cors');
const urlRoutes = require('./routes/urlRoutes');

const app = express();
const port = process.env.PORT;

connectDB();


app.use(cors()); 
app.use(express.json());


app.use(urlRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}` ));