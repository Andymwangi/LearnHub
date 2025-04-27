const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directories to clean
const dirsToClean = [
  '.next',
  'node_modules',
  'temp',
  'tmp'
];

// Function to delete directory
function deleteDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    console.log(`Deleting ${dirPath}...`);
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`✅ ${dirPath} deleted.`);
  } else {
    console.log(`Directory ${dirPath} does not exist.`);
  }
}

// Function to run git gc
function runGitGC() {
  console.log('Running git garbage collection...');
  try {
    execSync('git gc --aggressive --prune=now', { stdio: 'inherit' });
    console.log('✅ Git garbage collection completed.');
  } catch (error) {
    console.error('Error during git garbage collection:', error.message);
  }
}

// Main function
function cleanRepository() {
  console.log('Starting repository cleanup...');
  
  // Delete specified directories
  dirsToClean.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    deleteDirectory(dirPath);
  });
  
  // Run git garbage collection
  runGitGC();
  
  console.log('Repository cleanup completed. You can now push to GitHub.');
  console.log('Note: Run npm install after cloning to restore node_modules.');
}

// Run the main function
cleanRepository(); 