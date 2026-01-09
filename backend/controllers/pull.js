const fs = require('fs').promises;
const path = require('path');
const {s3, S3_BUCKET} = require('../config/aws-config.js');

async function pullRepo() {
    const repoPath = path.resolve(process.cwd(), '.kit');
    const commitsPath = path.join(repoPath, 'commits'); // local commits directory

    try{
        const data = await s3.listObjectsV2({Bucket: S3_BUCKET, Prefix: 'commits/'}).promise();

        const objects = data.Contents; // list of objects in S3 under 'commits/'
        for(const obj of objects) {
            const key = obj.Key; // S3 object key
            const commitDir = path.join(commitsPath, path.dirname(key).split('/').pop()); // local commit directory

            await fs.mkdir(commitDir, {recursive: true}); // create commit directory

            const params = {Bucket: S3_BUCKET, Key: key}; // what we get from S3

            const fileData = await s3.getObject(params).promise(); // contents of the file

            await fs.writeFile(path.join(repoPath, key), fileData.Body); // copy the file locally

            console.log(`Pulled ${path.basename(key)} of commit ${path.dirname(key).split('/').pop()} from remote repository.`);
        }
    }catch (err) {
        console.error('Error pulling from remote repository:', err);
    }
}

module.exports = {pullRepo};