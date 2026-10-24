# nodejs-dvncd

Small Mongoose examples I wrote while learning how to model related data in MongoDB: embedded documents, references with `populate()`, and arrays of subdocuments. Each script runs on its own against a local MongoDB.

## Prerequisites

- Node.js 24 (see `.nvmrc`; 20.19+ works)
- Docker, for MongoDB

```sh
npm install
npm run db:up     # start mongo:8 on port 27017
npm run db:down   # stop it
```

Scripts use `MONGO_URL`, default `mongodb://localhost:27017`. Each folder uses its own database.

## Layout

- [db.js](db.js): connects, runs one demo, always disconnects so the script exits.
- [models.js](models.js): all schemas in one place: `Author`, `Course` (embedded author), `RefCourse` (author id), `ArrayCourse` (list of authors).

## Topics

| Folder | Topic | Run |
| --- | --- | --- |
| [embedded-doc](embedded-doc) | Author stored inside the course | `node embedded-doc/embed.js` |
| | Update the embedded author, then remove it | `node embedded-doc/update-and-unset.js <courseId>` |
| [references](references) | Author field missing from the schema is dropped | `node references/no-ref.js` |
| | Store the author id, load it with `populate()` | `node references/ref.js` |
| | `populate()` only some author fields | `node references/selected-fields.js` |
| [subdoc-arrays](subdoc-arrays) | Course with a list of embedded authors | `node subdoc-arrays/adding-subdoc.js` |
| | Add and remove one author in the list | `node subdoc-arrays/add-remove-from-subdoc.js <courseId> <authorId>` |

Get the ids from the output of `embed.js` and `adding-subdoc.js`.

## Embed or reference?

| | Embedded | Referenced | Hybrid |
| --- | --- | --- | --- |
| How | Author is stored inside the course | Course stores only the author `_id` | Course stores the `_id` plus a few author fields, like `name` |
| Read | One query, fast | Needs `populate()`, an extra query | One query for the common fields |
| Update author | Change every course that has a copy | Change one author document | Change the author, and the copies if they must stay the same |
| Consistency | Copies can get out of date | Always current | Copied fields can get out of date |
| Size limit | Whole document must fit in 16 MB | No problem | Small extra size |
| Good for | Data read together and owned by the parent | Shared data that changes often | Lists that show a name but rarely need the rest |

## Checks

```sh
npm run lint
npm test   # needs MongoDB running
```

## Interview notes

Short answers to common questions, one group per topic.

### Embed or reference

**Q: When do you embed a document?**
A: When the child belongs to one parent, is read together with it, and stays small. Example: an address inside a user. One query gets everything.

**Q: When do you use a reference?**
A: When the data is shared by many documents, changes often, or can grow without limit. Example: an author used by many courses. You update it in one place.

**Q: What is the hybrid approach?**
A: Store the `_id` plus a few fields you show often, like the author `name`. Lists need one query, and you load the full author only when needed. The copied fields can get out of date, so pick fields that rarely change.

### populate()

**Q: What does `populate()` do?**
A: It replaces a stored `_id` with the real document. Mongoose runs a second query to the other collection. MongoDB has no joins here, so this happens in the app. See [references/ref.js](references/ref.js).

**Q: What does `populate()` cost?**
A: One extra query per populated path, and nested populates add more. On big lists, select only the fields you need, for example `populate('author', 'name')`, or use the hybrid approach.

**Q: Does Mongoose check that a referenced id exists?**
A: No. You can save an id that points to nothing, and `populate()` then returns `null`. Check it yourself if it matters.

### Subdocument arrays

**Q: How do you add or remove an item in a subdocument array?**
A: Load the parent, `push()` the new item or call `deleteOne()` on `course.authors.id(id)`, then `save()` the parent. Or use `$push` / `$pull` in one `updateOne` without loading. See [subdoc-arrays](subdoc-arrays).

**Q: What is the risk of big embedded arrays?**
A: A document has a 16 MB limit, and every read and write moves the whole array. If a list can grow without limit, like comments or orders, put the items in their own collection with a reference to the parent.

### Consistency

**Q: Embedding copies data. How do you keep the copies up to date?**
A: Update every copy with `updateMany`, accept that old copies may differ (fine for things like the name at the time of an order), or use a reference instead.

**Q: Is a write to one document atomic?**
A: Yes. A write to one document, including its embedded docs and arrays, is atomic. Changes across several documents need a transaction. This is another reason to embed data that must change together.
