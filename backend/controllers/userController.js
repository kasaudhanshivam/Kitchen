const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {MongoClient} = require('mongodb');
const dotenv = require('dotenv');
var objectId = require('mongodb').ObjectId;

dotenv.config();
const mongoUri = process.env.MONGODB_URI;

let client;

async function connectClient() { // Helper function to connect to MongoDB
    if (!client) {
        client = new MongoClient(mongoUri);
        await client.connect();
    }
    return client.db('kitchenDB');
}


const getAllusers = async (req, res) => {
    try{
        const db = await connectClient(); // connect to database
        const usersCollection = db.collection('users');
        const users = await usersCollection.find({}).toArray();
        res.json(users);
    }catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Internal Server Error");
    }
}

const getUserById = async (req, res) => {
    const {userId} = req.params;
    try{
        const db = await connectClient(); // connect to database
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({_id: new objectId(userId)});
        if (!user) {
            return res.status(404).send("User not found!");
        }
        res.json(user);
    }catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).send("Internal Server Error");
    }
}

const signUp = async (req, res) => {
    const {username, email, password} = req.body;
    try {
        const db = await connectClient(); // connect to database
        const usersCollection = db.collection('users');
        const existingUser = await usersCollection.findOne({email}); // check if user already exists

        if (existingUser) { // check if user already exists
            return res.status(400).send("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10); // (hashed password, salt rounds = 10)
        const newUser = { // new user object
            username,
            email,
            password: hashedPassword,
            repositories: [],
            followedUsers: [],
            starRepos: [],
        };
        const result = await usersCollection.insertOne(newUser); // insert new user into collection

        const token = jwt.sign({userId: result.insertedId}, process.env.JWT_SECRET, {expiresIn: '1h'}); // will expire in 1 hour
        res.send({token : token, userId: result.insertedId});
    } catch (error) {
        console.error("Error during user signup:", error);
        res.status(500).send("Internal Server Error");
    }
}

const logIn = async (req, res) => {
    const {email, password} = req.body;
    try{
        const db = await connectClient(); // connect to database
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({email}); // find user by email

        if (!user) { // user not found
            return res.status(400).send("Invalid Credentials!");
        }
        const isMatch = await bcrypt.compare(password, user.password); // compare passwords
        if (!isMatch) { // password does not match
            return res.status(400).send("Invalid Credentials!");
        }
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'}); // will expire in 1 hour
        res.send({token: token, userId: user._id});
    } catch (error) {
        console.error("Error during user login:", error);
        res.status(500).send("Internal Server Error");
    }
}

const updateUser = async(req, res) => {
    const {userId} = req.params;

    const {email, password} = req.body;

    try{
        const db = await connectClient(); // connect to database
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({_id: new objectId(userId)});
        if (!user) {
            return res.status(404).send("User not found!");
        }

        let updateFields = {email};
        if(password){
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.password = hashedPassword;
        }

        const updatedUser = await usersCollection.updateOne(
            {_id: new objectId(userId)},
            {$set: updateFields},
            {returnDocument: 'after'}
        );
        if(updatedUser.modifiedCount === 0){
            return  res.status(400).send("Update failed!");
        }
        res.send("User updated successfully!", updatedUser.value);
    }catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Internal Server Error");
    }
}

const deleteUser = async (req, res) => {
    const {userId} = req.params;
    try {
        const db = await connectClient(); // connect to database
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({_id: new objectId(userId)});
        if (!user) {
            return res.status(404).send("User not found!");
        }
        await usersCollection.deleteOne({_id: new objectId(userId)});
        res.send("User deleted successfully!");
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    getAllusers,
    getUserById,
    signUp,
    logIn,
    updateUser,
    deleteUser
};