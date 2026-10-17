const { test } = require('node:test');
const assert = require('node:assert');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { run } = require('../db');
const { Course, ArrayCourse } = require('../models');

// Run an example script as its own process and return what it printed.
function example(script, ...args) {
    return execFileSync(process.execPath, [path.join(__dirname, '..', script), ...args], { encoding: 'utf8' });
}

test('embed saves a course with an embedded author', () => {
    assert.match(example('embedded-doc/embed.js'), /Course Saved[\s\S]*name: 'Faiz'/);
});

test('update-and-unset changes then removes the embedded author', async () => {
    let id;
    await run('playgroundEmb', async () => {
        ({ _id: id } = await Course.create({ name: 'Test', author: { name: 'Someone' } }));
    });

    const out = example('embedded-doc/update-and-unset.js', String(id));
    assert.match(out, /After find and save[\s\S]*Faizal Zafri/);
    assert.match(out, /After \$set[\s\S]*John Doe/);

    await run('playgroundEmb', async () => {
        assert.equal((await Course.findById(id)).author, undefined);
    });
});

test('no-ref drops the author field', () => {
    assert.doesNotMatch(example('references/no-ref.js'), /author:/);
});

test('ref loads the author with populate', () => {
    assert.match(example('references/ref.js'), /With populate:[\s\S]*King In The North/);
});

test('selected-fields loads only name and bio', () => {
    const out = example('references/selected-fields.js');
    assert.match(out, /bio: 'King In The North'/);
    assert.doesNotMatch(out, /website/);
});

test('adding-subdoc saves a course with two authors', () => {
    assert.match(example('subdoc-arrays/adding-subdoc.js'), /name: 'First'[\s\S]*name: 'Second'/);
});

test('add-remove-from-subdoc adds one author and removes another', async () => {
    let course;
    await run('playgroundSubArr', async () => {
        course = await ArrayCourse.create({ name: 'Test', authors: [{ name: 'First' }, { name: 'Second' }] });
    });

    example('subdoc-arrays/add-remove-from-subdoc.js', String(course._id), String(course.authors[0]._id));

    await run('playgroundSubArr', async () => {
        const { authors } = await ArrayCourse.findById(course._id);
        assert.deepEqual(authors.map(a => a.name), ['Second', 'Third']);
    });
});
