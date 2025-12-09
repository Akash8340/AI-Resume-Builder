
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import validator from 'validator';

const generateToken = (userId) =>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'})
    return token;
}

// controller for user registration
// POST: /api/users/register
export const registerUser = async (req,res) => {
    try {
        const {name, email, password} = req.body;

        // check if required field is present
        if(!name || !email || !password){
            return res.status(400).json({message: 'Missing required fields'});
        }

        // validate email
        if(!validator.isEmail(email)){
            return res.status(400).json({message: "Invalid email format"});
        }

        // check if user already exist
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "User already exist"});
        }

        // password len min 8
        if(password.length < 8){
            return res.status(400).json({message: "Password must be of size 8"})
        }

        //create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({name, email, password: hashedPassword});

        // return success message
        const token = generateToken(newUser._id);
        newUser.password = undefined;

        return res.status(201).json({message: "User Registerd successfully", token, user: newUser});

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

// controller for user Login
// POST: /api/users/login
export const loginUser = async (req,res) => {
    try {
        const {email, password} = req.body;

        // check if user exist
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid email or password"});
        }

        //check if password is correct
        if(!user.comparePassword(password)){
            return res.status(400).json({message: "Invalid email or password"});
        }

        // return success message
        const token = generateToken(user._id);
        user.password = undefined;

        return res.status(200).json({message: "User Login successfull", token, user});

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

// conroller for getting user by id
// GET: /api/users/data
export const getUserById = async (req,res) => {
    try {
        
        const userId = req.userId;

        // check if user exists
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        // return user
        user.password = undefined;
        return res.status(200).json({user});

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}


