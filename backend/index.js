const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const {Server} = require("socket.io");
const mainRouter = require("./routes/mainRouter.js");


const yargs = require("yargs"); // apckage to handle(read) command line arguments
const {hideBin} = require("yargs/helpers"); // helper function for yargs

// import controller functions - commands
const {initRepo} = require("./controllers/init.js");
const {addToRepo} = require("./controllers/add.js");
const {commitRepo} = require("./controllers/commit.js");
const {revertRepo} = require("./controllers/revert.js");
const {pushRepo} = require("./controllers/push.js");
const {pullRepo} = require("./controllers/pull.js");



dotenv.config(); // Load environment variables from .env file




// Define CLI commands using yargs
yargs(hideBin(process.argv))
.command('start', 'Start the Kitchen version control system.', {}, start_server)
.command('init', 'Initialize the repositiory.', {}, initRepo)
.command('add <file>', 'Files to be added to staging area.', (yargs) => {
    yargs.positional('file', {
        describe: 'File(s) to add to staging area',
        type: 'string'
    });
}, (argv) => {
    addToRepo(argv.file);
})
.command('commit <message>', 'Commit changes to the repository.', (yargs) => {
    yargs.positional('message', {
        describe: 'Commit message',
        type: 'string'
    });
}, (argv) => {
    commitRepo(argv.message);
})
.command('push', 'Push changes to the remote repository.', {}, pushRepo)
.command('pull', 'Pull changes from the remote repository.', {}, pullRepo)
.command('revert <commitID>', 'Revert changes to specific commit.', (yargs) => {
    yargs.positional('commitID', {
        describe: 'Commit ID to revert to',
        type: 'string'
    });
}, (argv) => {  
    revertRepo(argv.commitID);
})
.demandCommand(1, 'You need at least one command before moving on.')
.help().argv;


function start_server() { // Function to start the server apart from commands
    // Initialize Express app
    const app = express();
    const port = process.env.PORT || 3000;

    app.use(bodyParser.json());
    app.use(cors());
    app.use(express.json());


    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI;
    mongoose
    .connect(mongoURI)
    .then(() => {
        console.log("Connection established with DataBase!");
    })
    .catch((err) => console.log("Error connecting to DataBase: ", err));
    


    app.use("/", mainRouter); // go to router




    let user = "test_kitchen";
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        socket.on("join_room", (userID) => {
            user = userID;
            console.log("===================");
            console.log(user);
            console.log("===================");
            socket.join(userID);
        });
    });

    const db = mongoose.connection;
    db.once("open", () => {
        console.log("CRUD OPs called!");
    });

    // Start the server
    server.listen(port, () => {
        console.log(`Server is running on port ${port}!`);
    });
}