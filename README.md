# FireStorage

This library provides a firebase-like interface to
[LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

It can't handle large amounts of data, and it's designed to be used primarily
for educational purposes.

# Installation

    $ npm i github:gosukiwi/firestorage

# Usage Overview

```javascript
import { collection, doc, ... } from "firestorage";

// You do not need to "create" or "delete" collections. After you create the
// first document in a collection, the collection exists. If you delete all of
// the documents in a collection, it no longer exists.
//
// You can get a reference to a collection (colRef) by using `collection`.
const colRef = collection("cats");

// Once you have a reference, you can pass it to `addDoc` to add documents
// into it.
//
// You'll get back a "document reference" (docRef).
const tolouseRef = addDoc(colRef, { name: "Tolouse", likes: ["Piano", "Singing"] });
const thomasRef = addDoc(colRef, { name: "Thomas O'Malley", likes: ["Duchess"] });

// Not all documents have to be equal! Duchess has an `age` key-value, but
// it's recommended that they all have the same keys so it's easier to work
// with.
const duchessRef = addDoc(colRef, {
  name: "Duchess",
  likes: ["Thomas O'Malley", "Dancing"],
  age: 3,
});

// You can create a reference to a document that doesn't exist
const berliozRef = doc('cats', 'Berlioz')
// And add it later
addDoc(berliozRef, { name: 'Berlioz' })

// A document reference is like a direction pointing to the document in the
// collection. You can use it to get the document back using `getDoc`
const tolouse = getDoc(tolouseRef);
// We need to use `data()` to access the document
console.log(tolouse.data().name) // logs 'Tolouse'
// We can also use `exists()` to check it's existance
console.log(tolouse.exists()) // logs true

// Pass a collection reference to `getDocs` to get all documents
const docs = getDocs(colRef);

// To filter documents in a collection, pass a query to `getDocs` instead
const q = query(colRef, where("name", "==", "Tolouse"))
const docs = getDocs(q);

// Delete document
deleteDoc(thomasRef);

// Set document - If there is a document already in the reference, it will
// override it
setDoc(tolouseRef, { name: 'Tolouse', age: 1 })

// If you don't want to override, just change it's values, you can pass
// `{ merge: true }`
setDoc(tolouseRef, { name: 'Tolouse', age: 1 }, { merge: true })

// Or use `updateDoc`, which will not override and merge by default
updateDoc(duchessRef, { age: 2 });
```

# Document Identifiers

TODO

# Queries

```javascript
const q = query(col, where("name", "in", ["Tolouse", "Duchess"]));
const docs = getDocs(q);

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

# TODO

- `updateDoc`: dot notation, `arrayUnion`, `arrayRemove` and `increment`
