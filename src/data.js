const getItems = (count) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

const initialArr = getItems(10);

export const columnInfo = {
  one: {
    name: "One",
    items: initialArr,
  },
  two: {
    name: "Two",
    items: [],
  },
  three: {
    name: "Three",
    items: [],
  },
  four: {
    name: "Four",
    items: [],
  },
};

export const columnOrder = ["one", "two", "three", "four"];
