const DocumentRef = require("./document-ref");
const CollectionRef = require("./collection-ref");
const Collection = require("./collection");
const Snapshot = require("./snapshot");
const QuerySnapshot = require("./query-snapshot");

// Returns a collection reference
const collection = (name) => new CollectionRef(new Collection(name));

// Returns a document reference, or a collection reference, depending if a
// document is specified
const doc = (name, document) => {
  const col = typeof name === "string" ? new Collection(name) : name;
  return document ? new DocumentRef(col, document) : new CollectionRef(col);
};

const setDoc = (docRef, document, options = { merge: false }) =>
  docRef.setDoc(document, options);

const addDoc = (colRef, document) => colRef.addDoc(document);

const updateDoc = (docRef, document) =>
  setDoc(docRef, document, { merge: true });

const query = (colRef, ...transformations) => ({ colRef, transformations });

const getDocs = (colRefOrQuery) => {
  if (colRefOrQuery instanceof CollectionRef) {
    return new QuerySnapshot(colRefOrQuery, []);
  }

  const { colRef, transformations } = colRefOrQuery;
  return new QuerySnapshot(colRef, transformations);
};

const getDoc = (docRef) => new Snapshot(docRef);

// Queries
const where = (field, comparator, value) => (docs) =>
  docs.filter((doc) => {
    const fieldValue = doc[field];
    switch (comparator) {
      case "==":
        return fieldValue === value;
      case "!=": {
        if (fieldValue === undefined) return false;

        return fieldValue !== value;
      }
      case ">":
        return fieldValue > value;
      case ">=":
        return fieldValue >= value;
      case "<":
        return fieldValue < value;
      case "<=":
        return fieldValue <= value;
      case "in":
        return value.includes(fieldValue);
      case "not-in":
        return !value.includes(fieldValue);
      case "array-contains": {
        if (!Array.isArray(fieldValue)) return false;

        return fieldValue.every((item) => value.includes(item));
      }
      case "array-contains-any": {
        if (!Array.isArray(fieldValue)) return false;

        return fieldValue.some((item) => value.includes(item));
      }
      default:
        throw new Error(`Invalid comparator: "${comparator}"`);
    }
  });

const orderBy =
  (field, direction = "asc") =>
  (docs) =>
    docs.sort((a, b) => {
      if (Number.isInteger(a[field]) && Number.isInteger(b[field])) {
        return direction === "asc" ? a[field] - b[field] : b[field] - a[field];
      }

      return direction === "asc"
        ? a[field].localeCompare(b[field])
        : a[field].localeCompare(b[field]) * -1;
    });

const skip = (amount) => (docs) => docs.slice(amount);

const limit = (amount) => (docs) => docs.slice(0, amount);

const deleteDoc = (docRef) => {
  docRef.deleteDoc();
};

module.exports = {
  collection,
  addDoc,
  query,
  getDocs,
  getDoc,
  where,
  orderBy,
  skip,
  limit,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
};
