const DocumentRef = require("./document-ref");

const generateUUID = () => {
  let d = new Date().getTime(),
    d2 = (performance && performance.now && performance.now() * 1000) || 0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    let r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c == "x" ? r : (r & 0x7) | 0x8).toString(16);
  });
};

module.exports = class CollectionRef {
  constructor(collection) {
    this.collection = collection;
    this.isCollection = true;
    this.isDocument = false;
  }

  addDoc(doc) {
    const id = generateUUID();
    this.collection.add(id, doc);
    return new DocumentRef(this.collection, id);
  }

  apply(transformations) {
    let docs = this.collection.all();

    transformations.forEach((transform) => {
      docs = transform(docs);
    });

    return docs;
  }
};
