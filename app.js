const express = require('express');
const app = express();
const port = 3000;


//Middleware to parse JSON request bodies
app.use(express.json());


//Define routes
app.get('/', (req, res) => {
    res.send('Hello World! Welcome to DLShort one step process to shorten your URL');
});

app.get('/api/v1/shortner', (req, res)=> {
    res.send('http://aryalrajiv.com.np');
});


//Define a POST route with a request body
app.post('/post', (req, res) => {
    const data = req.body;
    res.json({messege:"Data received. Data:", data});

});

//Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}) ;