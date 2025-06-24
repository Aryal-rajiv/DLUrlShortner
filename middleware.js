const jwt = require('jsonwebtoken');

const authentication = (req, res, next) => {
    const secretKey = process.env.JWT_SECRET;
    console.log(secretKey)
    const token = req.headers.authorization;
    if (token){
        jwt.verify(token, secretKey, (err, user) =>{
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
    });
   }else{
    res.status(401).json({ error: "No token provided" });
   }
};

module.exports = authentication;
