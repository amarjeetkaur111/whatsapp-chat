
const express = require('express');
const { registerUser , loginUser, getUser, getAllUsers } = require('../Controllers/userController');
const router = express.Router();
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const jwtkey =  process.env.JWT_SECRET_KEY;
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }  
    jwt.verify(token, jwtkey, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' }); 
      }  
      req.user = decoded;
      next();
    });
  }

router.post('/register', registerUser);
router.post('/login', loginUser);
// router.get('/getUser/:userId', authenticateToken, getUser);
router.get('/getUser/:userId', getUser);
// router.get('/', authenticateToken, getAllUsers);
router.get('/', getAllUsers);

module.exports = router;