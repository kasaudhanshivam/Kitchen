const express = require("express");
const  userController = require("../controllers/userController");

const userRouter = express.Router();

userRouter.get("/users", userController.getAllusers);
userRouter.get("/user/:userId", userController.getUserById);
userRouter.post("/signup", userController.signUp);
userRouter.post("/login", userController.logIn);
userRouter.put("/update/:userId", userController.updateUser);
userRouter.delete("/delete/:userId", userController.deleteUser);

module.exports = userRouter;