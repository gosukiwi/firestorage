const { LocalStorage } = require("node-localstorage");
const {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} = require("../lib/index");

beforeAll(() => {
  global.localStorage = new LocalStorage("./scratch");
});

beforeEach(() => {
  global.localStorage.clear();
});

test("addDoc", async () => {
  const col = collection("people");
  const doc = await addDoc(col, { name: "Mike" });
  expect(doc.name).toBe("Mike");
});

test("getDocs", async () => {
  const col = collection("people");
  await addDoc(col, { name: "Mike" });
  const docs = await getDocs(col);
  expect(docs[0].name).toBe("Mike");
});

test("query + where", async () => {
  const col = collection("people");
  await addDoc(col, { name: "Mike" });
  await addDoc(col, { name: "John" });

  const docs = await query(col, where("name", "==", "Mike"));
  expect(docs[0].name).toBe("Mike");

  const docs2 = await query(col, where("name", "==", "John"));
  expect(docs2[0].name).toBe("John");
});

test("query + multiple where", async () => {
  const col = collection("people");
  await addDoc(col, { name: "Mike", surname: "Small", age: 18 });
  await addDoc(col, { name: "Mike", surname: "Big", age: 39 });

  const docs = await query(
    col,
    where("name", "==", "Mike"),
    where("age", ">", 18)
  );
  expect(docs[0].surname).toBe("Big");
});

test("query + order", async () => {
  const col = collection("people");
  await addDoc(col, { name: "Abel" });
  await addDoc(col, { name: "Zynosky" });

  let docs = await query(col, orderBy("name", "desc"));
  expect(docs[0].name).toBe("Zynosky");
  expect(docs[1].name).toBe("Abel");

  docs = await query(col, orderBy("name", "asc"));
  expect(docs[0].name).toBe("Abel");
  expect(docs[1].name).toBe("Zynosky");
});

test("query + numeric order", async () => {
  const col = collection("people");
  await addDoc(col, { name: "Abel", age: 40 });
  await addDoc(col, { name: "Zynosky", age: 30 });

  const docs = await query(col, orderBy("age", "desc"));
  expect(docs[0].name).toBe("Abel");
  expect(docs[1].name).toBe("Zynosky");
});
