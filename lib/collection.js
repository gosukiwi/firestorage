module.exports = class Collection {
  constructor(name) {
    this.name = name;
  }

  add(id, document) {
    const key = `${this.name}/${id}`;
    const doc = { ...document, id };
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

  delete(id) {
    const key = `${this.name}/${id}`;
    const meta = JSON.parse(localStorage.getItem("meta")) || [];
    localStorage.setItem(
      "meta",
      JSON.stringify(meta.filter((item) => item !== key))
    );
    localStorage.removeItem(key);
  }

  update(id, doc) {
    localStorage.setItem(`${this.name}/${id}`, JSON.stringify(doc));
  }

  find(id) {
    return JSON.parse(localStorage.getItem(`${this.name}/${id}`));
  }
};
