// Import bcrypt
const bcrypt = require('bcryptjs');

// Function to hash a password
async function hashPassword(plainPassword) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    
    // Output the hashed password
    console.log('Hashed Password:', hashedPassword);
  } catch (error) {
    console.error('Error hashing password:', error);
  }
}

// If you want to provide the password from the command line
const inputPassword = process.argv[2]; // Take the password as a command-line argument
if (!inputPassword) {
  console.log('Please provide a password to hash');
} else {
  hashPassword(inputPassword);
}
