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
}

const collection = (name) => new Collection(name);

const addDoc = (col, doc) =>
  new Promise((resolve) => {
    resolve(col.add(doc));
  });

const getDocs = (col) =>
  new Promise((resolve) => {
    resolve(col.all());
  });

const query = async (col, ...transformations) => {
  let docs = await getDocs(col);

  transformations.forEach((transform) => {
    docs = transform(docs);
  });

  return docs;
};

// Query filters
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

module.exports = {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  skip,
  limit,
};
