function validatePhoneNumber(phoneNumber) {
    // Regular expression to match local Ethiopian phone number format: Starts with 09 and has 10 digits
    const localPhoneRegex = /^09\d{8}$/;

    // Check if the phone number matches the local format and contains only digits
    return localPhoneRegex.test(phoneNumber) && /^\d+$/.test(phoneNumber);
}

module.exports = { validatePhoneNumber };

// Usage example:
// const phone = "0912345678"; // Replace with the phone number to validate
// if (validatePhoneNumber(phone)) {
//     console.log("Phone number is a valid Ethiopian local number.");
// } else {
//     console.log("Please enter a valid Ethiopian local phone number containing only digits and starting with '09'.");
// }