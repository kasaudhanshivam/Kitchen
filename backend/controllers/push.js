const fs = require('fs');
const path = require('path');
const {s3, S3_BUCKET} = require('../config/aws-config.js');

async function pushRepo() {
    const repoPath = path.resolve(process.cwd(), '.kit');
    const commitsPath = path.join(repoPath, 'commits');

    try{
        const commitDirs = fs.readdirSync(commitsPath);
        for(const commitDir of commitDirs) {
            const commitPath = path.join(commitsPath, commitDir);
            const files = fs.readdirSync(commitPath);
            for(const file of files) {
                const filePath = path.join(commitPath, file);
                const fileContent = fs.readFileSync(filePath);

                const params = {
                    Bucket: S3_BUCKET,
                    Key: `commits/${commitDir}/${file}`,
                    Body: fileContent
                }

                await s3.putObject(params).promise();
                console.log(`Pushed ${file} of commit ${commitDir} to remote repository.`);
            }
        }

        console.log('All commits have been pushed to the remote repository.');
    }catch (err) {
        console.error('Error pushing to remote repository:', err);
    }
}

module.exports = {pushRepo};