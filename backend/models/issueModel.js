const mongoose = require("mongoose");
const Repository = require("./repoModel");
const {Schema} = mongoose;


const IssueSchema = new Schema({
    title: { type: String, required: true }, // title of the issue
    description: { type: String, required: true }, // detailed description
    status: { type: String, enum: ['open', 'in progress', 'closed'], default: 'open' }, // status
    repository: { // reference to associated repository
        required: true,   
        type: Schema.Types.ObjectId,
        ref: 'Repository'
    }
}
, { timestamps: true } // createdAt and updatedAt
);



const Issue = mongoose.model("Issue", IssueSchema);
module.exports = Issue;