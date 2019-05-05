const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/playground-subarr')
    .then(() => console.log('Connected to Cloud Mongo'))
    .catch(() => console.log('Failed to connect'));

const authorSchema = new mongoose.Schema({
    name: String,
    bio: String,
    wesite: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
    name: String,
    authors: [authorSchema]
}));

async function listCourses() {
    const courses = await Course.find();
    console.log(JSON.stringify(courses));
}

async function addAuthor(couseId, author) {
    const course = await Course.findById(couseId);
    course.authors.push(author);
    course.save();
}

async function removeAuthor(couseId, authorId) {
    const course = await Course.findById(couseId);
    const author = course.authors.id(authorId);
    author.remove();
    course.save();
}

// addAuthor('5cced5fa56cb8325acfa2ca1', new Author({ name: 'Third' }));
// removeAuthor('5cced5fa56cb8325acfa2ca1', '5cced5fa56cb8325acfa2ca2');
listCourses();