const Mongoose = require('mongoose');
const Repository = require('../models/repoModel.js');
const User = require('../models/userModel.js');
const Issue = require('../models/issueModel.js');

const createIssue = async (req, res) => {
    const {repoId} = req.params;
    const {title, description} = req.body;

    try {
        const newIssue = new Issue({
            title,
            description,
            repository: repoId
        });
        await newIssue.save();
        res.status(201).json({message: "Issue created successfully", issue: newIssue});
    } catch (error) {
        console.error("Error creating issue:", error);
        res.status(500).json({message: "Error creating issue", error: error.message});
    }
}

const updateIssueById = async (req, res) => {
    const {id} = req.params;
    const {title, description, status} = req.body;

    try{
        const issue = await Issue.findById(id);

        if(!issue){
            return res.status(404).json({message: "Issue not found"});
        }
        issue.title = title;
        issue.description = description;
        issue.status = status;
        await issue.save();

        res.status(200).json({message: "Issue updated successfully", issue});
    }catch(error){
        console.error("Error updating issue:", error);
        res.status(500).json({message: "Error updating issue", error: error.message});
    }
}

const deleteIssueById = async (req, res) => {
    const {id} = req.params;

    try{
        const issue = await Issue.findByIdAndDelete(id);

        if(!issue){
            return res.status(404).json({message: "Issue not found"});
        }

        res.status(200).json({message: "Issue deleted successfully"});
    }catch(error){
        console.error("Error deleting issue:", error);
        res.status(500).json({message: "Error deleting issue", error: error.message});
    }
}

const getAllIssues = async (req, res) => {
    const {id} = req.params;

    try{
        const issues = await Issue.find({repository: id});

        if(!issues){
            return res.status(404).json({message: "No issues found"});
        }

        res.status(200).json({issues});
    }catch(error){
        console.error("Error fetching issues:", error);
        res.status(500).json({message: "Error fetching issues", error: error.message});
    }
}

const getIssueById = async (req, res) => {
    const {id} = req.params;

    try{
        const issue = await Issue.findById(id);

        if(!issue){
            return res.status(404).json({message: "Issue not found"});
        }

        res.status(200).json({issue});
    }catch(error){
        console.error("Error fetching issue:", error);
        res.status(500).json({message: "Error fetching issue", error: error.message});
    }
}

module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssueById
};