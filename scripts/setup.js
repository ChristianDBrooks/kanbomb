const prompt = require('prompt-sync')({ sigint: true });

console.log('This is the Catalyst of something great.')

const ironSessionPassword = prompt("What should your Iron session password be? https://www.lastpass.com/features/password-generator#generatorTool ")
const name = prompt("What would you like to name your project?");
const shouldCreateDatabase = prompt("Would you like to automatically create a new database? Y/n", 'y',).toLowerCase();
if (shouldCreateDatabase === 'y') {
  // create database at neon.tech
  // set env var in .env
}

const shouldSetupSendGrid = prompt("Would you like to turn on email sending with SendGrid? Y/n", 'y').toLowerCase();

if (shouldSetupSendGrid === 'y') {
  // 
}






