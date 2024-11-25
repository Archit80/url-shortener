const shortid = require('shortid');

function generateShortId() {
    const id = shortid.generate();
    console.log("Generated Short ID:", id); // Log the generated ID
    return id;
}

generateShortId();