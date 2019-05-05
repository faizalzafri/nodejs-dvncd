const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/playgroundEmb')
    .then(() => console.log('Connected'))
    .catch(() => console.log('Failed to connect'));

const authorSchema = new mongoose.Schema({
    name: String,
    bio: String,
    wesite: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
    name: String,
    author: authorSchema
}));

async function createCourse(name, author) {
    const course = new Course({
        name,
        author
    });

    const result = await course.save();
    console.log('Course Saved: ', result)
}

createCourse('MIYI', new Author({
    name: 'Faiz'
}));