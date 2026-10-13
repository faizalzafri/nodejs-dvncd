const { run } = require('../db');
const { Author, RefCourse } = require('../models');

// The course stores only the author id. populate() loads the full author.
// Mongoose does not check that the id points to a real author.
run('playgroundRef', async () => {
    const author = await Author.create({ name: 'John Snow', bio: 'King In The North' });
    const { _id } = await RefCourse.create({ name: 'How To Know Nothing 101', author: author._id });

    console.log('Without populate: ', await RefCourse.findById(_id));
    console.log('With populate: ', await RefCourse.findById(_id).populate('author'));
});
