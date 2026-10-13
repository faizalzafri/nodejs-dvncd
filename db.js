const mongoose = require('mongoose');

// Connect to the given database, run the demo, always disconnect so the script exits.
async function run(dbName, fn) {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017', { dbName });
    try {
        await fn();
    } finally {
        await mongoose.disconnect();
    }
}

module.exports = { run };
