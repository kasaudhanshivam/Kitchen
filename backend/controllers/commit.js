const fs = require('fs').promises;
const path = require('path');
const {v4 : uuidv4} = require('uuid');

async function commitRepo(message) {
    const repoPath = path.resolve(process.cwd(), '.kit');
    const stagedPath = path.join(repoPath, 'staging');
    const commitsPath = path.join(repoPath, 'commits');

    try{
        const commitID = uuidv4();
        const commitDir = path.join(commitsPath, commitID);
        await fs.mkdir(commitDir, {recursive: true});

        const files = await fs.readdir(stagedPath);

        for (const file of files) {
            const srcPath = path.join(stagedPath, file);
            const destPath = path.join(commitDir, file);
            await fs.copyFile(srcPath, destPath);
        }

        await fs.writeFile(path.join(commitDir, 'commit.json'), JSON.stringify({
            id: commitID,
            message: message,
            date: new Date().toISOString()
        }));

        console.log(`Committed changes with ID: ${commitID}`);
    }catch (error) {
        console.error("Error during commit:", error);
    }
}

module.exports = {commitRepo};