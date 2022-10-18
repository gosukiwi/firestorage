# FireStorage

This library provides a firebase-like interface to interacting with
[LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

# Installation

    $ npm i github:gosukiwi/firestorage

# Usage

```javascript
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  skip,
} from "firestorage";

// access a collection
const col = collection("people");

// insert doc
const doc = addDoc(col, { name: "Tolouse" });

// get all docs
const docs = getDocs(col);

// query docs
const docs = query(col, where("name", "==", "Tolouse"));
const docs = query(col, where("name", "==", "Tolouse"), where("age", ">", 1));
const docs = query(col, orderBy("name", "asc"));
const docs = query(col, limit(10));
const docs = query(col, skip(5));
const docs = query(
  col,
  where("name", "==", "Tolouse"),
  orderBy("name", "asc"),
  skip(1),
  limit(10)
);

// delete doc
deleteDocs(col, where("name", "==", "Tolouse"));

// update doc
updateDocs(col, where("name", "==", "Tolouse"), { age: 4 });
```
