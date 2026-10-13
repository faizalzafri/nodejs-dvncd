const { run } = require('../db');
const { Course } = require('../models');

const id = process.argv[2];
if (!id) {
    console.error('Usage: node update-and-unset.js <courseId>');
    process.exit(1);
}

run('playgroundEmb', async () => {
    // Find first, change the embedded doc, save the parent.
    const course = await Course.findById(id);
    course.author.name = 'Faizal Zafri';
    await course.save();
    console.log('After find and save', await Course.findById(id));

    // Update the embedded doc directly in the database.
    await Course.updateOne({ _id: id }, { $set: { 'author.name': 'John Doe' } });
    console.log('After $set', await Course.findById(id));

    // Remove the embedded doc.
    await Course.updateOne({ _id: id }, { $unset: { author: '' } });
    console.log('After $unset', await Course.findById(id));
});
