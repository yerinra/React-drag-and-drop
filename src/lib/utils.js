// 재배치하는 유틸함수
const reorder = (list, startIndex, endIndex) => {
  const copied = [...list];
  const [removed] = copied.splice(startIndex, 1);
  copied.splice(endIndex, 0, removed);

  return copied;
};

// 새로운 itemIds를 만드는 유틸함수
const withNewItemIds = (column, itemIds) => ({
  id: column.id,
  title: column.title,
  itemIds,
});

// 하나의 아이템 재배치
const reorderSingleDrag = ({
  entities,
  selectedItemIds,
  source,
  destination,
}) => {
  // 같은 col 내 이동
  if (source.droppableId === destination.droppableId) {
    const column = entities.columns[source.droppableId];
    const reordered = reorder(column.itemIds, source.index, destination.index);

    const updated = {
      ...entities,
      columns: {
        ...entities.columns,
        [column.id]: withNewItemIds(column, reordered),
      },
    };

    return {
      entities: updated,
      selectedItemIds,
    };
  }

  // 다른 col로 이동
  const home = entities.columns[source.droppableId];
  const foreign = entities.columns[destination.droppableId];

  // 이동할 아이템
  const itemId = home.itemIds[source.index];

  // 기존 col에서 제거
  const newHomeItemIds = [...home.itemIds];
  newHomeItemIds.splice(source.index, 1);

  // 새로운 col에 추가
  const newForeignItemIds = [...foreign.itemIds];
  newForeignItemIds.splice(destination.index, 0, itemId);

  const updated = {
    ...entities,
    columns: {
      ...entities.columns,
      [home.id]: withNewItemIds(home, newHomeItemIds),
      [foreign.id]: withNewItemIds(foreign, newForeignItemIds),
    },
  };

  return {
    entities: updated,
    selectedItemIds,
  };
};

// itemId에 해당하는 아이템이 속한 col을 찾는 유틸함수
const getHomeColumn = (entities, itemId) => {
  const columnId = entities.columnOrder.find((id) => {
    const column = entities.columns[id];
    return column.itemIds.includes(itemId);
  });

  return entities.columns[columnId];
};

// 여러 개의 아이템 재배치(multi select)
const reorderMultiDrag = ({
  entities,
  selectedItemIds,
  source,
  destination,
}) => {
  const start = entities.columns[source.droppableId];
  const dragged = start.itemIds[source.index];

  // 이동하고자 하는 col에 삽입할 index 계산
  const insertAtIndex = (() => {
    const destinationIndexOffset = selectedItemIds.reduce(
      (previous, current) => {
        if (current === dragged) {
          return previous;
        }

        const final = entities.columns[destination.droppableId];
        const column = getHomeColumn(entities, current);

        if (column !== final) {
          return previous;
        }

        const index = column.itemIds.indexOf(current);

        if (index >= destination.index) {
          return previous;
        }

        // the selected item is before the destination index
        // we need to account for this when inserting into the new location
        return previous + 1;
      },
      0,
    );

    const result = destination.index - destinationIndexOffset;
    return result;
  })();

  const orderedSelectedItemIds = [...selectedItemIds];

  // 선택한 아이템들을 기존의 col에서 제거
  const withRemovedItems = entities.columnOrder.reduce((previous, columnId) => {
    const column = entities.columns[columnId];

    const remainingItemIds = column.itemIds.filter(
      (id) => !selectedItemIds.includes(id),
    );

    previous[column.id] = withNewItemIds(column, remainingItemIds);
    return previous;
  }, entities.columns);

  const final = withRemovedItems[destination.droppableId];

  // 선택한 아이템들을 이동할 col(destination)에 삽입
  const withInserted = (() => {
    const base = [...final.itemIds];
    base.splice(insertAtIndex, 0, ...orderedSelectedItemIds);
    return base;
  })();

  // 제거와 삽입 결과를 반영한 columns 객체 생성
  const withAddedItems = {
    ...withRemovedItems,
    [final.id]: withNewItemIds(final, withInserted),
  };

  const updated = {
    ...entities,
    columns: withAddedItems,
  };

  return {
    entities: updated,
    selectedItemIds: orderedSelectedItemIds,
  };
};

// 하나의 아이템이나 여러 개의 아이템을 드래그하여 재배치하는 함수
const multiDragAwareReorder = (args) => {
  const { entities, selectedItemIds, source, destination } = args;
  const { droppableId, index } = destination;
  const { columns } = entities;

  // 여러 개의 아이템(그 중 마지막 아이템이 짝수)을 다른 짝수 아이템 앞으로 이동금지
  if (selectedItemIds.length > 1) {
    if (
      +selectedItemIds[selectedItemIds.length - 1].split("-")[1] % 2 == 0 &&
      columns[droppableId].itemIds[index] &&
      +columns[droppableId].itemIds[index].split("-")[1] % 2 == 0
    ) {
      return args;
    }

    return reorderMultiDrag(args);
  }

  // 한 개의 짝수 아이템을 다른 짝수 아이템 앞으로 이동금지
  if (
    +columns[source.droppableId].itemIds[source.index].split("-")[1] % 2 == 0 &&
    columns[droppableId].itemIds[index] &&
    +columns[droppableId].itemIds[index].split("-")[1] % 2 == 0
  ) {
    return args;
  }
  return reorderSingleDrag(args);
};

const multiSelectTo = (entities, selectedItemIds, newItemId) => {
  if (!selectedItemIds.length) {
    return [newItemId];
  }

  const columnOfNew = getHomeColumn(entities, newItemId);
  const indexOfNew = columnOfNew.itemIds.indexOf(newItemId);

  const lastSelected = selectedItemIds[selectedItemIds.length - 1];
  const columnOfLast = getHomeColumn(entities, lastSelected);
  const indexOfLast = columnOfLast.itemIds.indexOf(lastSelected);

  // 기존에 선택한 아이템들과 다른 col의 아이템들을 선택한 경우 기존의 아이템들을 버리고 새롭게 선택
  if (columnOfNew !== columnOfLast) {
    return columnOfNew.itemIds.slice(0, indexOfNew + 1);
  }

  if (indexOfNew === indexOfLast) {
    return null;
  }

  const isSelectingForwards = indexOfNew > indexOfLast;
  const start = isSelectingForwards ? indexOfLast : indexOfNew;
  const end = isSelectingForwards ? indexOfNew : indexOfLast;

  // start 부터 end 까지의 모든 아이템 선택
  const inBetween = columnOfNew.itemIds.slice(start, end + 1);

  // 이미 선택되어 있는 아이템을 제외하고 추가할 아이템 배열
  const toAdd = inBetween.filter((itemId) => {
    if (selectedItemIds.includes(itemId)) {
      return false;
    }
    return true;
  });

  const sorted = isSelectingForwards ? toAdd : [...toAdd].reverse();
  const combined = [...selectedItemIds, ...sorted];

  return combined;
};

export { multiDragAwareReorder, multiSelectTo };
