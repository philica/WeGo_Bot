// chatIdToUserId.js

const User = require('../Models/user.model'); // Assuming you have a User model

// Retrieve the user ID based on the chat ID
async function findUserIdByChatId(chatId) {
  try {
    const user = await User.findOne({ chatId: chatId });
    if (user) {
      return user._id;
    } else {
      // Handle the case when the chat ID is not found
      throw new Error('User not found');
    }
  } catch (error) {
    // Handle any error that occurs during the database query
    console.error('Error finding user ID:', error);
    throw error;
  }
}

module.exports = {
  findUserIdByChatId,
};