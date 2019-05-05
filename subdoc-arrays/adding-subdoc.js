const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/playground-subarr')
    .then(() => console.log('Connected to Cloud Mongo'))
    .catch(() => console.log('Failed to connect'));

const authorSchema = new mongoose.Schema({
    name: String,
    bio: String,
    wesite: String
});

const Course = mongoose.model('Course', new mongoose.Schema({
    name: String,
    authors: [authorSchema]
}));

async function createCourse(name, authors) {
    const course = new Course({
        name,
        authors
    });

    const result = await course.save();
    console.log('Course Saved: ', result)
}

async function listCourses() {
    const courses = await Course.find();
    console.log(JSON.stringify(courses));
}

createCourse('NodeJS', [{ name: 'First' }, { name: 'Second' }]);

// listCourses();