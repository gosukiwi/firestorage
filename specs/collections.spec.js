const { LocalStorage } = require("node-localstorage");
const {
  collection,
  addDoc,
  getDocs,
  getDoc,
  where,
  orderBy,
  limit,
  skip,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
  query,
} = require("../lib/index");

beforeAll(() => {
  global.localStorage = new LocalStorage("./scratch");
});

beforeEach(() => {
  global.localStorage.clear();
});

describe("setDoc", () => {
  test("inserts when empty", () => {
    const ref = doc("people", "mike");
    setDoc(ref, { name: "Mike" });

    const docSnap = getDoc(ref);
    expect(docSnap.exists()).toBe(true);
    expect(docSnap.data().id).toBe("mike");
    expect(docSnap.data().name).toBe("Mike");
    expect(ref.collection.all().length).toBe(1);
  });

  test("merges", () => {
    const ref = doc("people", "mike");
    setDoc(ref, { name: "Mike" });
    setDoc(ref, { age: 18 }, { merge: true });

    const docSnap = getDoc(ref);
    expect(docSnap.data().name).toBe("Mike");
    expect(docSnap.data().age).toBe(18);
  });

  test("overrides", () => {
    const ref = doc("people", "mike");
    setDoc(ref, { name: "Mike" });
    setDoc(ref, { age: 18 });

    const docSnap = getDoc(ref);
    expect(docSnap.data().name).toBe(undefined);
    expect(docSnap.data().age).toBe(18);
  });
});

test("addDoc", () => {
  const docRef = addDoc(doc("people"), { name: "Mike" });

  const docSnap = getDoc(docRef);
  expect(docSnap.exists()).toBe(true);
  expect(docSnap.data().id).not.toBe(undefined);
  expect(docSnap.data().name).toBe("Mike");
});

test("updateDoc", () => {
  const ref = doc("people", "mike");
  setDoc(ref, { name: "Mike" });
  updateDoc(ref, { age: 18 });

  const docSnap = getDoc(ref);
  expect(docSnap.data().name).toBe("Mike");
  expect(docSnap.data().age).toBe(18);
});

test("deleteDoc", () => {
  const docRef = addDoc(doc("people"), { name: "Mike" });
  expect(getDoc(docRef).exists()).toBe(true);

  deleteDoc(docRef);

  expect(getDoc(docRef).exists()).toBe(false);
});

test("getDocs", () => {
  setDoc(doc("people", "mike"), { name: "Mike" });
  setDoc(doc("people", "john"), { name: "John" });

  const querySnapshot = getDocs(collection("people"));

  expect(querySnapshot.data().length).toBe(2);
  expect(querySnapshot.data()[0].name).toBe("Mike");
  expect(querySnapshot.data()[1].name).toBe("John");
});

describe("queries", () => {
  test("where", () => {
    const col = collection("people");
    addDoc(col, { name: "Mike" });
    addDoc(col, { name: "John" });

    let q = query(col, where("name", "==", "Mike"));
    let querySnapshot = getDocs(q);
    let docs = querySnapshot.data();
    expect(docs[0].name).toBe("Mike");

    q = query(col, where("name", "==", "John"));
    querySnapshot = getDocs(q);
    docs = querySnapshot.data();
    expect(docs[0].name).toBe("John");
  });

  test("multiple wheres work like AND", () => {
    const col = collection("people");
    addDoc(col, { name: "Mike", surname: "Small", age: 18 });
    addDoc(col, { name: "Mike", surname: "Big", age: 39 });

    const q = query(col, where("name", "==", "Mike"), where("age", ">", 18));
    const querySnapshot = getDocs(q);
    const docs = querySnapshot.data();

    expect(docs.length).toBe(1);
    expect(docs[0].surname).toBe("Big");
  });

  test("in", () => {
    const col = collection("people");
    addDoc(col, { name: "Mike" });
    addDoc(col, { name: "John" });
    addDoc(col, { name: "Pfteven" });

    const q = query(col, where("name", "in", ["Mike", "John"]));
    const querySnapshot = getDocs(q);
    const docs = querySnapshot.data();

    expect(docs.length).toBe(2);
    expect(docs[0].name).toBe("Mike");
    expect(docs[1].name).toBe("John");
  });

  test("not-in", () => {
    const col = collection("people");
    addDoc(col, { name: "Mike" });
    addDoc(col, { name: "John" });
    addDoc(col, { name: "Pfteven" });

    const q = query(col, where("name", "not-in", ["Mike", "John"]));
    const querySnapshot = getDocs(q);
    const docs = querySnapshot.data();

    expect(docs.length).toBe(1);
    expect(docs[0].name).toBe("Pfteven");
  });

  test("array-contains", () => {
    const col = collection("people");
    addDoc(col, { name: "Mike", likes: ["potatoes", "hunger"] });
    addDoc(col, { name: "John", likes: ["coffee", "potatoes"] });
    addDoc(col, { name: "Pfteven", likes: ["dogs"] });

    const q = query(
      col,
      where("likes", "array-contains", ["potatoes", "hunger"])
    );
    const querySnapshot = getDocs(q);
    const docs = querySnapshot.data();

    expect(docs.length).toBe(1);
    expect(docs[0].name).toBe("Mike");
  });

  test("array-contains-any", () => {
    const col = collection("people");
    addDoc(col, { name: "Mike", likes: ["potatoes", "hunger"] });
    addDoc(col, { name: "John", likes: ["coffee", "potatoes"] });
    addDoc(col, { name: "Pfteven", likes: ["dogs"] });

    const q = query(
      col,
      where("likes", "array-contains-any", ["potatoes", "hunger"])
    );
    const querySnapshot = getDocs(q);
    const docs = querySnapshot.data();

    expect(docs.length).toBe(2);
    expect(docs[0].name).toBe("Mike");
    expect(docs[1].name).toBe("John");
  });

  test("getDocs + order", () => {
    const col = collection("people");
    addDoc(col, { name: "Abel" });
    addDoc(col, { name: "Zynosky" });

    let q = query(col, orderBy("name", "desc"));
    let querySnapshot = getDocs(q);
    let docs = querySnapshot.data();
    expect(docs[0].name).toBe("Zynosky");
    expect(docs[1].name).toBe("Abel");

    q = query(col, orderBy("name", "asc"));
    querySnapshot = getDocs(q);
    docs = querySnapshot.data();
    expect(docs[0].name).toBe("Abel");
    expect(docs[1].name).toBe("Zynosky");
  });

  test("getDocs + numeric order", () => {
    const col = collection("people");
    addDoc(col, { name: "Abel", age: 40 });
    addDoc(col, { name: "Zynosky", age: 30 });

    const q = query(col, orderBy("age", "desc"));
    const querySnapshot = getDocs(q);
    const docs = querySnapshot.data();

    expect(docs[0].name).toBe("Abel");
    expect(docs[1].name).toBe("Zynosky");
  });

  test("limit", () => {
    const col = collection("people");
    addDoc(col, { name: "Abel", age: 40 });
    addDoc(col, { name: "Zynosky", age: 30 });
    addDoc(col, { name: "Pepe", age: 30 });

    const q = query(col, limit(2));
    const querySnapshot = getDocs(q);
    const docs = querySnapshot.data();

    expect(docs[0].name).toBe("Abel");
    expect(docs[1].name).toBe("Zynosky");
  });

  test("skip", () => {
    const col = collection("people");
    addDoc(col, { name: "Abel", age: 40 });
    addDoc(col, { name: "Zynosky", age: 30 });
    addDoc(col, { name: "Pepe", age: 30 });

    const q = query(col, skip(1));
    const querySnapshot = getDocs(q);
    const docs = querySnapshot.data();

    expect(docs[0].name).toBe("Zynosky");
    expect(docs[1].name).toBe("Pepe");
  });
});
