const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected'))
    .catch(() => console.log('Failed to connect'));

const Author = mongoose.model('Author', new mongoose.Schema({
    name: String,
    bio: String,
    wesite: String
}));

const Course = mongoose.model('Course', new mongoose.Schema({
    name: String,
}));

async function createAuthor(name, bio, website) {
    const author = new Author({
        name,
        bio,
        website
    });

    const result = await author.save();
    console.log('Author Saved: ', result)
}


async function createCourse(name, author) {
    //schema definition doesn't refer author so mentioning here would not work
    const course = new Course({
        name,
        author
    });

    const result = await course.save();
    console.log('Course Saved: ', result)
}

async function listCourses() {
    const courses = await Course.find().select({ name: 1 });
    console.log(courses);
}

// createAuthor('John Snow', 'King In The North', 'http://areyouserious.com/jsnow');

// createCourse('How To Know Nothing 101', '5cce8d87723f6d00f4a3e3c7');

listCourses();
