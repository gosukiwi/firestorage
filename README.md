# FireStorage

This library provides a firebase-like interface to
[LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

It can't handle large amounts of data, and it's designed to be used primarily
for educational purposes.

# Installation

    $ npm i github:gosukiwi/firestorage

# Usage Overview

```javascript
import { collection, addDoc, ... } from "firestorage";

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

# Collections

You can think of a collection as a bag of documents, with documents being just
JSON objects. Unlike Firebase, there are no subcollections in this library.

You do not need to "create" or "delete" collections. After you create the
first document in a collection, the collection exists. If you delete all of
the documents in a collection, it no longer exists.

You can get a reference to a collection in two ways:

```javascript
const col = collection("my-collection");
const col = doc("my-collection");
```

They are both equal, and will return a collection reference, or just `colRef`.

# References

A reference is a pointer to some data, either a collection or a document. You
can think of it like an address, such as "FakeStreet 123". Given that address,
the library knows how to access a given piece of data.

# Document Identifiers

There are two ways to work with document identifiers, either setting them
yourself, or letting the library do it.

To create a custom ID, you can use `doc`:

```javascript
const tolouse = doc("cats", "tolouse");
```

The first part (`cats`) is the collection, and the second part (`tolouse`) is
the ID.

Note that we created a reference, but the actual document doesn't exist yet,
we have to add it:

```javascript
const tolouse = doc("cats", "tolouse");
addDoc(tolouse, { name: "Tolouse" });
const id = getDoc(tolouse).data().id; // "tolouse"
```

Most of the time though, you want automatic unique IDs. For that, you can use
`addDoc`:

```javascript
const tolouse = addDoc(doc("cats"), { name: "Tolouse" });
const id = getDoc(tolouse).data().id; // An auto-generated UID
```

`addDoc` returns a reference to the added document, so you can access it later
if you need to.

# Queries

When fetching multiple documents, most of the time you'll want to filter those
documents. The most common filter is `where`:

```javascript
const q = query(col, where("name", "==", "Tolouse"));
```

We define a query by using the `query` function. It takes a collection
reference as first parameter, and we can pass as many "filters" as we want. In
this case, we pass a single one: `where`.

Once we have a query, we can pass it to `getDocs` to get the
results:

```javascript
const q = query(col, where("name", "==", "Tolouse"));
const result = getDocs(q);

result.data().forEach((cat) => {
  console.log(cat);
});
```

If we want to match by another field, for example, where the age is greater
than 1, we can simply add another `where`. It will work like an `AND`
condition.

```javascript
const q = query(col, where("name", "==", "Tolouse"), where("age", ">", 1));
```

If we want to perform an `OR`, we can use the `in` comparator:

```javascript
const q = query(col, where("name", "in", ["Tolouse", "Duchess"]));
```

That will match all cats named either `"Tolouse"` or `"Duchess"`.

## Working with Arrays

Documents are JSON objects, and as such, can have arrays. We can filter
documents by their array values using `array-contains` and
`array-contains-any`.

```javascript
const q = query(col, where("likes", "array-contains", ["Piano", "Singing"]));
```

The query above will match all documents in `col` where the `likes` array
contains _both_ `"Piano"` and `"Singing"`.

If we want to match if it contains any (either `"Piano"` or `"Singing"`) we
can use `array-contains-any` instead:

```javascript
const q = query(
  col,
  where("likes", "array-contains-any", ["Piano", "Singing"])
);
```

## All Comparators

The comparators `where` supports are: `==`, `!=`, `>`, `>=`, `<`, `<=`, `in`,
`not-in`, `array-contains`, `array-contains-any`.

## Sorting

You can sort documents by using `orderBy`, which takes a field as first
parameter, and the second parameter can be either `"asc"` or `"desc"`, for
ascending or descending order:

```javascript
const q = query(col, orderBy("name", "asc"));
```

In the query above, we'll sort all documents in `col` by `name` ascending,
meaning we'll go from A to Z. If we passed `"desc"` instead, it would sort
from Z to A.

At the moment, this library supports sorting by strings and numbers only.

## Skip and Limit

You can skip a fixed amount of results, or limit the amount of results
returned by a query by using `skip` and `limit`:

```javascript
const q = query(col, limit(10)); // Limit the result to 10 documents
const q = query(col, skip(5)); // Skip the first 5 documents
```

## Using it all together

By combining the filters above, you can create complex queries:

```javascript
const q = query(
  col,
  where("name", "!=", "Tolouse"),
  where("likes", "array-contains-any", ["Dancing", "Singing"]),
  orderBy("name", "asc"),
  skip(1),
  limit(10)
);
```

# TODO

- `updateDoc`: dot notation, `arrayUnion`, `arrayRemove` and `increment`
