function validateFullName(fullName) {
    // Regular expression to match the format: Firstname Middlename Lastname
    const fullNameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+){2}$/;

    return fullNameRegex.test(fullName);
}

module.exports = { validateFullName };
// Usage example:
// const fullName = "Abebe Kebede Birhanu";
// if (validateFullName(fullName)) {
//     console.log("Full name is in the correct format.");
// } else {
//     console.log("Please enter the full name in the format: Firstname Middlename Lastname");
// }