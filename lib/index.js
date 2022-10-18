const crypto = require("crypto");

class Collection {
  constructor(name) {
    this.name = name;
  }

  add(document) {
    const doc = { ...document };
    doc.id = crypto.randomUUID();
    const key = `${this.name}/${doc.id}`;
    localStorage.setItem(key, JSON.stringify(doc));

    const meta = JSON.parse(localStorage.getItem("meta")) || [];
    meta.push(key);
    localStorage.setItem("meta", JSON.stringify(meta));

    return doc;
  }

  all() {
    const meta = JSON.parse(localStorage.getItem("meta")) || [];
    return meta
      .filter((key) => key.startsWith(`${this.name}/`))
      .map((key) => JSON.parse(localStorage.getItem(key)));
  }

  delete(doc) {
    const key = `${this.name}/${doc.id}`;
    const meta = JSON.parse(localStorage.getItem("meta")) || [];
    localStorage.setItem(
      "meta",
      JSON.stringify(meta.filter((item) => item !== key))
    );
    localStorage.removeItem(key);
  }

  update(doc) {
    localStorage.setItem(`${this.name}/${doc.id}`, JSON.stringify(doc));
  }
}

const collection = (name) => new Collection(name);

const addDoc = (col, doc) => col.add(doc);

const getDocs = (col, ...transformations) => {
  let docs = col.all();

  transformations.forEach((transform) => {
    docs = transform(docs);
  });

  return docs;
};

const getDoc = (col, ...transformations) =>
  getDocs(col, ...transformations)[0] || null;

// Queries
const where = (field, comparator, value) => (docs) =>
  docs.filter((doc) => {
    const fieldValue = doc[field];
    switch (comparator) {
      case "==":
        return fieldValue === value;
      case "!=":
        return fieldValue !== value;
      case ">":
        return fieldValue > value;
      case ">=":
        return fieldValue >= value;
      case "<":
        return fieldValue < value;
      case "<=":
        return fieldValue <= value;
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

// Delete Docs
const deleteDocs = (col, ...queries) => {
  const docs = getDocs(col, ...queries);
  docs.forEach((doc) => col.delete(doc));
};

const deleteDoc = (col, ...queries) => {
  const doc = getDoc(col, ...queries);
  if (!doc) throw new Error("Could not delete null document");

  col.delete(doc);
};

// Update
const updateDocs = (col, ...queries) => {
  const newFields = queries.pop();
  const docs = getDocs(col, ...queries);
  docs.forEach((doc) => col.update({ ...doc, ...newFields }));
};

const updateDoc = (col, ...queries) => {
  const newFields = queries.pop();
  const doc = getDoc(col, ...queries);
  col.update({ ...doc, ...newFields });
};

module.exports = {
  collection,
  addDoc,
  getDocs,
  getDoc,
  where,
  orderBy,
  skip,
  limit,
  deleteDocs,
  deleteDoc,
  updateDocs,
  updateDoc,
};
