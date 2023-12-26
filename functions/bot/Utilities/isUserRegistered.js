const User = require('../Models/user.model'); // Import your User model

async function isUserRegistered(chatID) {
    try {
        const user = await User.findOne({ chatID }); // Find user by chatID
        return !!user; // Return true if user exists, false otherwise
    } catch (error) {
        console.error('Error checking user registration:', error);
        return false; // Return false in case of an error
    }
}

module.exports = { isUserRegistered };