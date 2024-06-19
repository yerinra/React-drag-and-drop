import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Item from "./Item";

export default function Column({
  column,
  items,
  selectedIds,
  draggingId,
  toggleSelection,
  toggleSelectionInGroup,
  multiSelectTo,
  unDraggable,
  error,
}) {
  // 아이템 선택 여부를 확인하기 위한 객체 생성하는 함수
  const getSelectedMap = (selectedIds) =>
    selectedIds.reduce((previous, current) => {
      previous[current] = true;
      return previous;
    }, {});

  return (
    <>
      <h2 className="text-2xl font-semibold">{column.title}</h2>
      <div className="mt-5 h-full">
        <Droppable droppableId={column.id} key={column.id}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`
                          flex flex-col gap-3 rounded-xl p-4 ring-1 ring-gray-300 w-[112px] transition-shadow min-h-[300px] ${(unDraggable && snapshot.isDraggingOver) || error ? "bg-red-400/60" : snapshot.isDraggingOver ? "shadow-lg bg-blue-300" : "bg-gray-200 shadow"}
                        `}
            >
              {items.map((item, index) => {
                // 아이템이 선택되었는지 여부
                const isSelected = Boolean(
                  getSelectedMap(selectedIds)[item.id],
                );

                // 아이템이 선택되었고, 드래깅 중인지 여부
                const isGhosting =
                  isSelected && Boolean(draggingId) && draggingId !== item.id;

                return (
                  <Item
                    item={item}
                    index={index}
                    key={item.id}
                    isSelected={isSelected}
                    isGhosting={isGhosting}
                    selectionCount={selectedIds.length}
                    toggleSelection={toggleSelection}
                    toggleSelectionInGroup={toggleSelectionInGroup}
                    multiSelectTo={multiSelectTo}
                  />
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </>
  );
}
