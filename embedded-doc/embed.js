const { run } = require('../db');
const { Author, Course } = require('../models');

run('playgroundEmb', async () => {
    const course = new Course({
        name: 'MIYI',
        author: new Author({ name: 'Faiz' })
    });

    const result = await course.save();
    console.log('Course Saved: ', result);
});
