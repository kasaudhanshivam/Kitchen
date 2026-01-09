const express = require("express");
const repoRouter = express.Router();

const repositioryController = require("../controllers/repositoryController.js");


repoRouter.get("/repo/all", repositioryController.getAllRepositories);
repoRouter.post("/repo/create", repositioryController.createRepository);
repoRouter.get("/repo/:id", repositioryController.getRepositoryById);
repoRouter.get("/repo/name/:name", repositioryController.getRepositoryByName);
repoRouter.get("/repo/user/:userId", repositioryController.getAllRepositoriesForCurrUser);
repoRouter.delete("/repo/delete/:id", repositioryController.deleteRepository);
repoRouter.put("/repo/update/:id", repositioryController.updateRepository);
repoRouter.patch("/repo/visibility/:id", repositioryController.toggleRepositoryVisibility);

module.exports = repoRouter;
