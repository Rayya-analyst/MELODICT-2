/**
 * A simple utility function to greet the user.
 * @param {string} name - The name to greet.
 * @returns {string} The greeting message.
 */
function greetUser(name) {
    console.log("Hello, " + name + "!");
    return "Hello, " + name + "!";
}

// Call the function so it pops up when the page loads
alert(greetUser("Visitor"));
