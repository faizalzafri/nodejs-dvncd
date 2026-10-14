const { run } = require('../db');
const { ArrayCourse } = require('../models');

const [courseId, authorId] = process.argv.slice(2);
if (!courseId || !authorId) {
    console.error('Usage: node add-remove-from-subdoc.js <courseId> <authorIdToRemove>');
    process.exit(1);
}

run('playgroundSubArr', async () => {
    const course = await ArrayCourse.findById(courseId);
    if (!course) throw new Error(`Course ${courseId} not found`);

    // Add an author to the array.
    course.authors.push({ name: 'Third' });
    await course.save();
    console.log('After add', course.authors);

    // Remove an author from the array by its id.
    const author = course.authors.id(authorId);
    if (!author) throw new Error(`Author ${authorId} not found`);
    author.deleteOne();
    await course.save();
    console.log('After remove', course.authors);
});
