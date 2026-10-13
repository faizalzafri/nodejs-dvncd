const mongoose = require('mongoose');
const { run } = require('../db');
const { Author } = require('../models');

// Course schema without an author field: mongoose drops the author on save.
const Course = mongoose.model('NoRefCourse', new mongoose.Schema({
    name: String
}));

run('playgroundRef', async () => {
    const author = await Author.create({ name: 'John Snow', bio: 'King In The North' });
    const course = await Course.create({ name: 'How To Know Nothing 101', author: author._id });
    console.log('Course Saved (no author): ', course);
});
