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

//updating directly in db
async function updateAuthor2(courseId) {
    const course = await Course.update({ _id: courseId },
        {
            $set: {
                'author.name': 'John Done'
            }
        });
}

//deleting emb obj
async function updateAuthor3(courseId) {
    const course = await Course.update({ _id: courseId },
        {
            $unset: {
                'author': ''
            }
        });
}

// updateAuthor('5ccebb63d0ffc22dacf6aa83');
// updateAuthor2('5ccebb63d0ffc22dacf6aa83');
updateAuthor3('5ccebb63d0ffc22dacf6aa83');