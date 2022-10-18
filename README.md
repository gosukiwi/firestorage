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
const doc = await addDoc(col, { name: "Tolouse" });

// get all docs
const docs = await getDocs(col);

// query docs
const docs = await query(col, where("name", "==", "Tolouse"));
const docs = await query(
  col,
  where("name", "==", "Tolouse"),
  where("age", ">", 1)
);
const docs = await query(col, orderBy("name", "asc"));
const docs = await query(col, limit(10));
const docs = await query(col, skip(5));
const docs = await query(
  col,
  where("name", "==", "Tolouse"),
  orderBy("name", "asc"),
  skip(1),
  limit(10)
);

// delete doc
await deleteDocs(col, where("name", "==", "Tolouse"));

// update doc
await updateDocs(col, where("name", "==", "Tolouse"), { age: 4 });
```
