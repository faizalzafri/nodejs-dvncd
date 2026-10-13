const { run } = require('../db');
const { Author, RefCourse } = require('../models');

// populate() can load only some author fields: here name and bio, without _id.
run('playgroundRef', async () => {
    const author = await Author.create({ name: 'John Snow', bio: 'King In The North', website: 'http://example.com' });
    const { _id } = await RefCourse.create({ name: 'How To Know Nothing 101', author: author._id });

    console.log(await RefCourse.findById(_id).populate('author', '-_id name bio'));
});
