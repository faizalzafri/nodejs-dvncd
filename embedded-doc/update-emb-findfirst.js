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
    author: {
        type: authorSchema,
        required: true
    }
}));

//find first update
async function updateAuthor(courseId) {
    const course = await Course.findById(courseId);
    course.author.name = 'Faizal Zafri';
    course.save();
}

updateAuthor('5ccebb63d0ffc22dacf6aa83');