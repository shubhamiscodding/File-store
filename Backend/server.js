require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const { clerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log("MongoDB connection error : ",err));

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server running on port http://localhost:${PORT}`);
})