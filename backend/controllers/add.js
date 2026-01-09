const fs = require('fs').promises;
const path = require('path');

async function addToRepo(filePath) {
    const repoPath = path.resolve(process.cwd(), '.kit');
    const stagingPath = path.join(repoPath, 'staging');

    try {
        await fs.mkdir(stagingPath, { recursive: true });
        const fileName = path.basename(filePath);
        await fs.copyFile(filePath, path.join(stagingPath, fileName));

        console.log(`File ${fileName} committed to staging!`);
    }catch (err) {
        console.error('Error committing repository:', err);
    }
}

module.exports = {addToRepo};