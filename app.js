const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

const User = require("./models/User");

app.post("/register", async (req, res) => {
    const {username, password} = req.body;

    if(!username || !password) {
        return res.status(403).json({message: "Insufficient Data received."});
    }

    try {
        const existingUser = await User.findOne({username: username});
        if(existingUser) {
            return res.status(403).json({message: "User already exists."});
        } else {
            const newUser = new User({username, password});
            newUser.save();
            return res.status(201).json({message: "User registered successfully", user_id: newUser._id});
        }
    } catch(err) {
        console.log(err);
        return res.status(500).json({message: "Database Error", errorMessage: err.message});
    }
});

app.post("/signin", async (req, res) => {
    const {username, password} = req.body;

    if(!username || !password) {
        return res.status(403).json({message: "Insufficient Data received."});
    }

    try {
        const user = await User.findOne({username});
        if(!user) {
            return res.status(404).json({message: "User not found."});
        } else if (user.password !== password) {
            return res.status(403).json({message: "Incorrect password."});
        } else {
            return res.status(200).json({message: "User logged in successfully", user_id: user._id});
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Database Error", errorMessage: err.message});
    }
});

mongoose.connect("mongodb+srv://yash:yash@cluster0.kxybwcq.mongodb.net/Ambrosia?retryWrites=true&w=majority", 
    () => {
        console.log("connected to mongodb");
        app.listen(port, () => console.log(`Server listening on http://localhost:${port}/`));
    },
    e => console.log(e.message)
);