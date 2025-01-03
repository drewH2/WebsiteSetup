// middleware/auth.js

const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");


dotenv.config();



function authenticateToken(req, res, next) {
   // const authHeader = req.headers['authorization'];
   // const token = authHeader && authHeader.split(' ')[1];
  const token = req.cookies.jwt
    console.log('from auth func:',token);

    if (token == null) return res.sendStatus(401); // If there's no token

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
     //  console.log('from auth: ',process.env.JWT_SECRET);
        if (err) return res.sendStatus(403); // If token is invalid
     const obj ={phenicsId : req.params.phenicsId};
      if(obj.phenicsId !== user.id.toString()){
       console.log('from auth phenics: ',obj.phenicsId);
     console.log('from user auth id: ',user.id);
    return res.status(401).send('Unauthorized access'); // If not authorized
     }
       req.user = user;
        next(); // Pass the execution off to whatever request the client intended
    });
}






module.exports = authenticateToken

