import React, { useCallback, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { columnInfo, columnOrder } from "../data";
import Column from "./Column";

export default function MultiDragAndDrop() {
  const [columns, setColumns] = useState(columnInfo);
  const [startIdx, setStartIdx] = useState(null);

  const [selectedIds, setSelectedIds] = useState([]);
  const [draggingId, setDraggingId] = useState(undefined);

  const unselectAll = () => {
    setSelectedIds([]);
  };

  const onDragStart = useCallback((start) => {
    const id = start.draggableId;
    const selected = selectedIds.find((selected) => selected == id);

    const newIdx = columnOrder.indexOf(start.source.droppableId);
    setStartIdx(newIdx);

    if (!selected) unselectAll();

    setDraggingId(start.draggableId);
  }, []);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!result.destination || result.reason === "CANCEL") {
      setDraggingId(undefined);
      return;
    }

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    const sourceItem = columns[source.droppableId].items[source.index];
    const destinationItem =
      columns[destination.droppableId].items[destination.index];

    // 작은 짝수 아이템을 큰 짝수 아이템 앞으로 이동 금지
    if (
      +sourceItem.content.split(" ")[1] % 2 === 0 &&
      destinationItem &&
      sourceItem.content < destinationItem.content &&
      +destItems[destination.index + 1]?.content.split(" ")[1] % 2 === 0
    ) {
      return;
    }

    // 큰 짝수 아이템을 작은 짝수 아이템 앞으로 이동 금지
    if (
      +sourceItem.content.split(" ")[1] % 2 == 0 &&
      destinationItem &&
      sourceItem.content > destinationItem.content &&
      destItems[destination.index].content.split(" ")[1] % 2 == 0
    ) {
      return;
    }

    // 첫 번째 column에서 세번째 column으로 이동 금지
    if (source.droppableId === "one" && destination.droppableId === "three") {
      return;
    }

    if (source.droppableId !== destination.droppableId) {
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }

    setStartIdx(null);
    setDraggingId(undefined);
  };

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      {Object.entries(columns).map((column, index) => {
        const [columnId, columnItems] = column;
        return (
          <div key={columnId} className="flex flex-col items-center h-full">
            <h2 className="text-2xl font-semibold">{columnItems.name}</h2>
            <div className="mt-5 h-full">
              <Column
                column={column}
                unDraggable={index == 2 && startIdx == 0}
              />
            </div>
          </div>
        );
      })}
    </DragDropContext>
  );
}
