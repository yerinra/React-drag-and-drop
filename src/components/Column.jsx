import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

export default function Column({ column, unDraggable }) {
  const [columnId, columnItems] = column;
  return (
    <Droppable droppableId={columnId} key={columnId}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`
                          flex flex-col gap-3 rounded-xl p-4 ring-1 ring-gray-300 w-[112px] transition-shadow min-h-[300px] ${unDraggable && snapshot.isDraggingOver ? "bg-red-400/60" : snapshot.isDraggingOver ? "shadow-lg bg-blue-300" : "bg-gray-200 shadow"}
                        `}
        >
          {columnItems.items.map((item, index) => (
            <Draggable key={item.id} draggableId={item.id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`rounded-lg bg-white p-4 w-[80px] transition-shadow ${
                    snapshot.isDragging && false
                      ? "bg-red-500"
                      : snapshot.isDragging
                        ? "bg-opacity-90 shadow-2xl shadow-gray-400"
                        : "shadow"
                  }`}
                >
                  {item.content}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
