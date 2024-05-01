
const userModel = require('../Models/useModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const createToken = (_id) => {
    const jwtkey =  process.env.JWT_SECRET_KEY;
    return jwt.sign({_id},jwtkey,{expiresIn:'3d'});
}


  
const registerUser = async(req,res) => {
    try{
        const {username, password, email} = req.body;
        let user = await userModel.findOne({email});
        if(user) return res.status(400).json("User with same email already exist!");
        if(!username || !email || !password) return res.status(400).json("All Fields are required!");
        if(!validator.isEmail(email)) return res.status(400).json("Enter valid Email");
        // if(!validator.isStrongPassword(password)) return res.status(400).json('Enter a strong password');

        user = new userModel({name:username, email, password});
        const salt =  await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password,salt);
        await user.save();

        const token = createToken(user._id);
        res.status(200).json({_id: user._id,username,email,token});
    }
    catch(e){
        res.status(500).json(e);
    }
}

const loginUser = async(req,res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password) return res.status(400).json("All Fields are required!");

        let user = await userModel.findOne({email});
        if(!user) return res.status(400).json("Enter valid email or password");
        const IsPasswordValid = await bcrypt.compare(password,user.password);
        if(!IsPasswordValid) return res.status(400).json("Invalid Email or Password");

        const token = createToken(user._id);
        return res.status(200).json({_id:user._id,username:user.name, email:email, token:token});
    }catch(Err)
    {
        res.status(500).json(Err);
    }
}

const getUser = async(req,res) => {
    const userId = req.params.userId;
    try{
        let user = await userModel.findById(userId);
        if(!user) return res.status(500).json("User Not Found");
        return res.status(200).json(user);
    }catch(Err)
    {}
}

const getAllUsers = async(req,res) => {
    try{
        let users = await userModel.find();
        return res.status(200).json(users);
    }catch(Err)
    {}
}

module.exports =  { registerUser , loginUser , getUser, getAllUsers};