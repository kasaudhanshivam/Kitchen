const Mongoose = require('mongoose');
const Repository = require('../models/repoModel.js');
const User = require('../models/userModel.js');
const Issue = require('../models/issueModel.js');

const getAllRepositories = async (req, res) => {
    try{
        const repositories = await Repository.find()
        .populate('owner')
        .populate('issues');
        res.status(200).json(repositories);
    }catch(error){
        console.error("Error fetching repositories:", error);
        res.status(500).send("Error fetching repositories");
    }
}

const createRepository = async (req, res) => {
    const { owner, name, issues, content, description, visibility } = req.body;

    try{
        if(!name || !Mongoose.Types.ObjectId.isValid(owner)){
            return res.status(400).send("Name and owner are required!");
        }

        const newRepository = new Repository({
            owner,
            name,
            issues,
            content,
            description,
            visibility
        });

        const result = await newRepository.save();
        res.status(201).send({msg : "Repository created successfully!", repoID : result._id});
    }catch(error){
        console.error("Error creating repository:", error);
        res.status(500).send("Error creating repository");
    }
}

const getRepositoryById = async (req, res) => {
    const { id } = req.params;

    try{
        if(!Mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).send("Invalid repository ID");
        }
        const repository = await Repository.findById({_id : id})
        .populate('owner')
        .populate('issues');
        res.status(200).json(repository);
    }catch(error){
        console.error("Error fetching repository:", error);
        res.status(500).send("Error fetching repository");
    }
}

const getRepositoryByName = async (req, res) => {
    const repoName = req.params.name;

    try{
        const repository = await Repository.findOne({name : repoName})
        .populate('owner')
        .populate('issues');
        res.status(200).json(repository);
    }catch(error){
        console.error("Error fetching repository by name:", error);
        res.status(500).send("Error fetching repository by name");
    }
}

const deleteRepository = async (req, res) => {
    const { id } = req.params;

    try{
        if(!Mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).send("Invalid repository ID");
        }

        const deletedRepository = await Repository.findByIdAndDelete({ _id: id });

        if(!deletedRepository){
            return res.status(404).send("Repository not found");
        }

        res.status(200).send({msg : "Repository deleted successfully!"});
    }catch(error){
        console.error("Error deleting repository:", error);
        res.status(500).send("Error deleting repository");
    }
}

const getAllRepositoriesForCurrUser = async (req, res) => {
    const { userId } = req.params;

    try {
        if (!Mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send("Invalid user ID");
        }
        const repositories = await Repository.find({ owner: userId });
        res.status(200).json({msg : "Repositories fetched successfully!", repositories});
    } catch (error) {
        console.error("Error fetching repositories for user:", error);
        res.status(500).send("Error fetching repositories for user");
    }
}

const updateRepository = async (req, res) => {
    const { id } = req.params;

    const {content, description} = req.body;

    try{
        const repository = await Repository.findById({_id : id});
        if(!repository){
            return res.status(404).send("Repository not found");
        }

        repository.content.push = content || repository.content;
        repository.description = description;

        const updatedRepository = await repository.save();
        res.status(200).json({msg : "Repository updated successfully!", updatedRepository});
    }catch(error){
        console.error("Error updating repository:", error);
        res.status(500).send("Error updating repository");
    }
}

const toggleRepositoryVisibility = async (req, res) => {
    const { id } = req.params;

    try{
        const repository = await Repository.findById({_id : id});

        if(!repository){
            return res.status(404).send("Repository not found");
        }

        repository.visibility = !repository.visibility;
        const updatedRepository = await repository.save();
        res.status(200).json({msg : "Repository visibility toggled successfully!", updatedRepository});
    }catch(error){
        console.error("Error toggling repository visibility:", error);
        res.status(500).send("Error toggling repository visibility");
    }
}

module.exports = {
    getAllRepositories,
    createRepository,
    getRepositoryById,
    getRepositoryByName,
    deleteRepository,
    getAllRepositoriesForCurrUser,
    updateRepository,
    toggleRepositoryVisibility
};