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
