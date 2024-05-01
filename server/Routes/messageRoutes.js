
const {createMessage,getMessage} = require('../Controllers/messageController');
const express = require('express');
const router = express.Router();

router.post('/',createMessage);
router.get('/find/:chatId',getMessage);

module.exports = router;