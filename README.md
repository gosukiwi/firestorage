# FireStorage

This library provides a firebase-like interface to
[LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

It can't handle large amounts of data, and it's designed to be used primarily
for educational purposes.

# Installation

    $ npm i github:gosukiwi/firestorage

# Usage Overview

```javascript
import {
  collection,
  addDoc,
  getDocs,
  where,
  orderBy,
  limit,
  skip,
} from "firestorage";

// You do not need to "create" or "delete" collections. After you create the
// first document in a collection, the collection exists. If you delete all of
// the documents in a collection, it no longer exists.
const col = collection("people");

// You can insert documents to a collection by using `addDoc`
const tolouse = addDoc(col, { name: "Tolouse", likes: ["Piano", "Singing"] });
const thomas = addDoc(col, { name: "Thomas O'Malley", likes: ["Duchess"] });
// Not all documents have to be equal! Duchess has an `age` key-value, but
// it's recommended that they all have the same keys so it's easier to work
// with.
const duchess = addDoc(col, {
  name: "Duchess",
  likes: ["Thomas O'Malley", "Dancing"],
  age: 3,
});

// Get all documents using `getDocs`
const docs = getDocs(col);

// You can pass "queries" to `getDocs` to filter the returned documents
const docs = getDocs(col, where("name", "==", "Tolouse"));

// Get a single document using `getDoc` (singular form)
const doc = getDoc(col);
const doc = getDoc(col, where("name", "==", "Duchess"));

// Delete all documents matching a given query by using `deleteDocs`
deleteDocs(col, where("name", "==", "Tolouse"));

// Delete the first document matching query
deleteDoc(col, where("name", "==", "Tolouse"));

// Update all documents matching a given query by using `updateDocs`
updateDocs(col, where("name", "==", "Tolouse"), { age: 4 });

// Update the first document matching the query
updateDoc(col, where("name", "==", "Tolouse"), { age: 4 });
```

# Queries

```javascript
const docs = getDocs(col, where("name", "in", ["Tolouse", "Duchess"]));
const docs = getDocs(
  col,
  where("likes", "array-contains", ["Piano", "Singing"])
);
const docs = getDocs(
  col,
  where("likes", "array-contains-any", ["Piano", "Singing"])
);
const docs = getDocs(col, orderBy("name", "asc"));
const docs = getDocs(col, limit(10));
const docs = getDocs(col, skip(5));
// you can pass as many queries as you want, they will be applied in order
const docs = getDocs(
  col,
  where("name", "==", "Tolouse"),
  orderBy("name", "asc"),
  skip(1),
  limit(10)
);
```
