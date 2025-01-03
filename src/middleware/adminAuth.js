const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");


dotenv.config();

function authorizeAdmin(req, res, next) {
    const token = req.cookies.jwt;
    console.log('from admin auth func:', token);
  
    if (!token) return res.sendStatus(401); // If there's no token
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // If token is invalid
        const obj = { phenicsId: req.params.phenicsId };
        if (obj.phenicsId !== user.id.toString()) {
            console.log('from admin auth phenics:', obj.phenicsId);
            console.log('from admin user auth id:', user.id);
            return res.status(401).send('Unauthorized access'); // If not authorized
        }
        if (user.role !== 'admin') {
            console.log('inside admin auth if');
            return res.sendStatus(403); // Forbidden if not an admin
        }
        req.user = user;
        next(); // Pass the execution off to whatever request the client intended
    });
  }

  module.exports= authorizeAdmin;