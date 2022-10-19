module.exports = class QuerySnapshot {
  constructor(colRef, transformers) {
    this.colRef = colRef;
    this.transformers = transformers;
  }

  data() {
    if (!this._data) this._data = this.colRef.apply(this.transformers);
    return this._data;
  }
};
