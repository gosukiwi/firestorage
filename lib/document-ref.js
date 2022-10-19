module.exports = class DocumentRef {
  constructor(collection, id) {
    this.collection = collection;
    this.id = id;
    this.isCollection = false;
    this.isDocument = true;
  }

  setDoc(doc, { merge }) {
    const oldDoc = this.collection.find(this.id);

    if (oldDoc) {
      if (!merge) {
        this.collection.update(this.id, { ...doc, id: this.id });
      } else {
        this.collection.update(this.id, { ...oldDoc, ...doc, id: this.id });
      }
    } else {
      this.collection.add(this.id, { ...doc });
    }
  }

  getDoc() {
    return this.collection.find(this.id);
  }

  deleteDoc() {
    return this.collection.delete(this.id);
  }
};
