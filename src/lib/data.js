const getItems = (count) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

const initialArr = getItems(10);
const itemMap = initialArr.reduce((prev, curr) => {
  prev[curr.id] = curr;
  return prev;
}, {});

const one = {
  id: "one",
  title: "One",
  itemIds: initialArr.map((item) => item.id),
};

const two = {
  id: "two",
  title: "Two",
  itemIds: [],
};

const three = {
  id: "three",
  title: "Three",
  itemIds: [],
};

const four = {
  id: "four",
  title: "Four",
  itemIds: [],
};

const entities = {
  columnOrder: [one.id, two.id, three.id, four.id],
  columns: {
    [one.id]: one,
    [two.id]: two,
    [three.id]: three,
    [four.id]: four,
  },
  items: itemMap,
};

export default entities;
