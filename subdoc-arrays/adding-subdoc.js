const { run } = require('../db');
const { ArrayCourse } = require('../models');

run('playgroundSubArr', async () => {
    const result = await ArrayCourse.create({
        name: 'NodeJS',
        authors: [{ name: 'First' }, { name: 'Second' }]
    });
    console.log('Course Saved: ', result);
});
