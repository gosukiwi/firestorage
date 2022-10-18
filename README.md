# FireStorage

This library provides a very simplistic firebase-like interface to interacting
with
[LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

# Installation

    $ npm i github:gosukiwi/firestorage

# Usage

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

// access a collection
const col = collection("people");

// insert document
const doc = addDoc(col, { name: "Tolouse", likes: ["Piano", "Singing"] });
const doc = addDoc(col, { name: "Thomas O'Malley", likes: ["Duchess"] });
const doc = addDoc(col, {
  name: "Duchess",
  likes: ["Thomas O'Malley", "Dancing"],
  age: 3, // Not all documents have to be equal! Duchess has `age`
});

// get all documents
const docs = getDocs(col);

// get all documents matching a certain query
const docs = getDocs(col, where("name", "==", "Tolouse"));
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

// get single document
const doc = getDoc(col);
const doc = getDoc(col, where("name", "==", "Duchess"));

// delete all documents matching the query
deleteDocs(col, where("name", "==", "Tolouse"));

// delete the first document matching query
deleteDoc(col, where("name", "==", "Tolouse"));

// update all documents
updateDocs(col, where("name", "==", "Tolouse"), { age: 4 });

// update the first document matching the query
updateDoc(col, where("name", "==", "Tolouse"), { age: 4 });
```
