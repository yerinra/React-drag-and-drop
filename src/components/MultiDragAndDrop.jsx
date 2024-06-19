import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";
import { useDrag } from "../hooks/useDrag";
import { useSelect } from "../hooks/useSelect";

const getItems = (entities, columnId) =>
  entities.columns[columnId].itemIds.map((itemId) => entities.items[itemId]);

export default function MultiDragAndDrop({ data }) {
  const [entities, setEntities] = useState(data);
  const [startIdx, setStartIdx] = useState(null);

  const [selectedIds, setSelectedIds] = useState([]);
  const [draggingId, setDraggingId] = useState(undefined);

  const unselectAll = () => {
    setSelectedIds([]);
  };

  const { toggleSelection, toggleSelectionInGroup, multiSelectTo } = useSelect(
    entities,
    selectedIds,
    setSelectedIds,
    unselectAll,
  );

  const { onDragStart, onDragEnd, error } = useDrag(
    entities,
    setEntities,
    selectedIds,
    setSelectedIds,
    setDraggingId,
    unselectAll,
    setStartIdx,
  );

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      {entities.columnOrder.map((columnId) => {
        return (
          <div
            key={columnId}
            className="flex flex-col items-center h-full mb-10"
          >
            <Column
              column={entities.columns[columnId]}
              items={getItems(entities, columnId)}
              selectedIds={selectedIds}
              key={columnId}
              draggingId={draggingId}
              toggleSelection={toggleSelection}
              toggleSelectionInGroup={toggleSelectionInGroup}
              multiSelectTo={multiSelectTo}
              unDraggable={startIdx == 0 && columnId == "three"}
              error={error}
            />
          </div>
        );
      })}
    </DragDropContext>
  );
}
