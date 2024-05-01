const ChatModel = require('../Models/chatModel');

const createChat = async(req,res) => {
    try{
        const { firstId, secondId }  = req.body;
        const chat = await ChatModel.findOne({
            members:{$all:[firstId, secondId]}
        });
        if(chat)
            return res.status(200).json(chat);

        const newChat = new ChatModel({
            members:[firstId,secondId],
        })

        const response = await newChat.save();

        return res.status(200).json(response);
    }
    catch(Err)
    {
        console.log(Err);
        res.status(500).json(Err);
    }
}

const findUserChat = async(req,res) => {
    try{
        const userId = req.params.userId;
        const userChat = await ChatModel.find({
            members:{$in:[userId]},
        })
        if(userChat) return res.status(200).json(userChat);
        return res.status(200).json('No Chat Record Found for the user');
    }
    catch(Err)
    {
        console.log(Err);
        res.status(500).json(Err);
    }    
}

const findChat = async(req,res) => {
    try{
        const {firstId, secondId} = req.params;
        const chats = await ChatModel.find({
            members:{$all:[firstId,secondId]},
        })
        if(chats) return res.status(200).json(chats);
        return res.status(200).json('No Chat Record Found for the members');
    }
    catch(Err)
    {
        console.log(Err);
        res.status(500).json(Err);
    }    
}

module.exports= { createChat, findUserChat, findChat };