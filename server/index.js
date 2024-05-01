
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoute = require('./Routes/useRoute');
const chatRoute = require('./Routes/chatRoutes');
const messageRoute = require('./Routes/messageRoutes');

const app = express();

require('dotenv').config();

app.use(express.json());
app.use(cors());
app.use('/api/users/',userRoute);
app.use('/api/chat/',chatRoute);
app.use('/api/messages/',messageRoute);

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

app.get('/',(req,res) => {
    res.send('Welcome to my chat program');
});

app.listen(5000,(req,res) => {
    console.log(`Server running  on port....: ${port}`);
});

mongoose    
    .connect(uri, {
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>console.log("Connected to MongoDB"))
    .catch((e) => console.log(`Failed to Connect : ${e}`));