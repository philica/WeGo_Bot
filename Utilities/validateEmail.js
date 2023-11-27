function validateEmail(email) {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return emailRegex.test(email);
}

module.exports = { validateEmail };

// Usage example:
// const emailAddress = "example@email.com"; // Replace with the email address to validate
// if (validateEmail(emailAddress)) {
//     console.log("Email address is valid.");
// } else {
//     console.log("Please enter a valid email address.");
// }