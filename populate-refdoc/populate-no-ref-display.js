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
    //defining auhtor property in schema is important otherwise auhtor property passed in cousrse object will not be saved
    //it still doesnt guarantees the validation since invalid objectId can be passed
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    }
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
    const course = new Course({
        name,
        author
    });

    const result = await course.save();
    console.log('Course Saved: ', result)
}

async function listCourses() {
    const courses = await Course.find().select();
    console.log(courses);
}

// createAuthor('MIYI','BIOI','WIBISI');
createCourse('CISI', '5ccbf176b5207d005828a2d9');
  // listCourses();