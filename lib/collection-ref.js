const crypto = require("crypto");
const DocumentRef = require("./document-ref");

module.exports = class CollectionRef {
  constructor(collection) {
    this.collection = collection;
    this.isCollection = true;
    this.isDocument = false;
  }

  addDoc(doc) {
    const id = crypto.randomUUID();
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
