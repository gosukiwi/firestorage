module.exports = class Snapshot {
  constructor(docRef) {
    this.docRef = docRef;
  }

  data() {
    if (!this._data) this._data = this.docRef.getDoc();
    return this._data;
  }

  exists() {
    return !!this.data();
  }
};
