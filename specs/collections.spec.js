const { LocalStorage } = require("node-localstorage");
const {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  skip,
  deleteDocs,
  updateDocs,
} = require("../lib/index");

beforeAll(() => {
  global.localStorage = new LocalStorage("./scratch");
});

beforeEach(() => {
  global.localStorage.clear();
});

test("addDoc", () => {
  const col = collection("people");
  const doc = addDoc(col, { name: "Mike" });
  expect(doc.name).toBe("Mike");
});

test("getDocs", () => {
  const col = collection("people");
  addDoc(col, { name: "Mike" });
  const docs = getDocs(col);
  expect(docs[0].name).toBe("Mike");
});

test("query + where", () => {
  const col = collection("people");
  addDoc(col, { name: "Mike" });
  addDoc(col, { name: "John" });

  const docs = query(col, where("name", "==", "Mike"));
  expect(docs[0].name).toBe("Mike");

  const docs2 = query(col, where("name", "==", "John"));
  expect(docs2[0].name).toBe("John");
});

test("query + multiple where", () => {
  const col = collection("people");
  addDoc(col, { name: "Mike", surname: "Small", age: 18 });
  addDoc(col, { name: "Mike", surname: "Big", age: 39 });

  const docs = query(col, where("name", "==", "Mike"), where("age", ">", 18));
  expect(docs[0].surname).toBe("Big");
});

test("query + order", () => {
  const col = collection("people");
  addDoc(col, { name: "Abel" });
  addDoc(col, { name: "Zynosky" });

  let docs = query(col, orderBy("name", "desc"));
  expect(docs[0].name).toBe("Zynosky");
  expect(docs[1].name).toBe("Abel");

  docs = query(col, orderBy("name", "asc"));
  expect(docs[0].name).toBe("Abel");
  expect(docs[1].name).toBe("Zynosky");
});

test("query + numeric order", () => {
  const col = collection("people");
  addDoc(col, { name: "Abel", age: 40 });
  addDoc(col, { name: "Zynosky", age: 30 });

  const docs = query(col, orderBy("age", "desc"));
  expect(docs[0].name).toBe("Abel");
  expect(docs[1].name).toBe("Zynosky");
});

test("limit", () => {
  const col = collection("people");
  addDoc(col, { name: "Abel", age: 40 });
  addDoc(col, { name: "Zynosky", age: 30 });
  addDoc(col, { name: "Pepe", age: 30 });

  const docs = query(col, limit(2));
  expect(docs[0].name).toBe("Abel");
  expect(docs[1].name).toBe("Zynosky");
});

test("skip", () => {
  const col = collection("people");
  addDoc(col, { name: "Abel", age: 40 });
  addDoc(col, { name: "Zynosky", age: 30 });
  addDoc(col, { name: "Pepe", age: 30 });

  const docs = query(col, skip(1));
  expect(docs[0].name).toBe("Zynosky");
  expect(docs[1].name).toBe("Pepe");
});

test("delete", () => {
  const col = collection("people");
  addDoc(col, { name: "Abel", age: 40 });
  addDoc(col, { name: "Zynosky", age: 30 });
  addDoc(col, { name: "Pepe", age: 30 });

  deleteDocs(col, where("name", "==", "Zynosky"));
  const docs = getDocs(col);
  expect(docs[0].name).toBe("Abel");
  expect(docs[1].name).toBe("Pepe");
});

test("update", () => {
  const col = collection("people");
  addDoc(col, { name: "Abel", age: 40 });

  updateDocs(col, where("name", "==", "Abel"), { age: 22 });
  const docs = getDocs(col);
  expect(docs[0].age).toBe(22);
});
