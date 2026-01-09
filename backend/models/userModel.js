const mongoose = require("mongoose");
const {Schema} = mongoose;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true }, // unique username
    email: { type: String, required: true, unique: true }, // unique email
    password: { type: String, required: true }, // hashed password
    repositories: [ // array of repositories owned by the user
        {   
            default: [],
            type: Schema.Types.ObjectId,
            ref: 'Repository'
        }
    ],
    followedUsers: [ // array of users followed by this user
        {
            default: [],
            type: Schema.Types.ObjectId,
            ref: 'User' 
        }
    ], starRepos: [ // array of repositories starred by the user
        {
            type: [Schema.Types.ObjectId],
            ref: 'Repository',
            default: [],
        }
    ]
}
, { timestamps: true } // createdAt and updatedAt
);



const User = mongoose.model("User", UserSchema);
module.exports = User;