
const MessageModel = require('../Models/messageModel');

const createMessage = async(req,res) => {
    try{
        const {chatId, senderId, text } = req.body;
        const chat = new MessageModel({
            chatId,senderId, text
        });
        const msg = await chat.save();
        if(msg)
            res.status(200).json(msg);
        // res.status(500).json('Something went wrong!');
    }catch(Err){
        res.status(500).json(Err);
    }
}

const getMessage = async(req,res) => {
   try{
    const {chatId} = req.params;
    const msg = await MessageModel.find({chatId});
    res.status(200).json(msg);
   }catch(Err){
        res.status(500).json(Err);
   }  
}

module.exports = { createMessage, getMessage };
