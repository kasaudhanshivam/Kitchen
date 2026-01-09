const mongoose = require("mongoose");
const {Schema} = mongoose;


const RepoSchema = new Schema({
    name: { type: String, required: true, unique: true }, // repo name
    description: { type: String }, // repo description
    content: [ // files in the repo
        {
            type: String,
        }
    ],
    visibility: { type: Boolean, default: true }, // true=public or false=private
    owner: { // user who owns the repo
        required: true,   
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    issues: [ // issues related to the repo
        {
            type: Schema.Types.ObjectId,
            ref: 'Issue'
        }
    ],
}
, { timestamps: true } // createdAt and updatedAt
);



const Repository = mongoose.model("Repository", RepoSchema);
module.exports = Repository;