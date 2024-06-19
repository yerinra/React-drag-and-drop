import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { KEY_CODES } from "../lib/constants";

export default function Item({
  item,
  index,
  isSelected,
  isGhosting,
  selectionCount,
  toggleSelection,
  toggleSelectionInGroup,
  multiSelectTo,
}) {
  // 윈도우에서는 ctrl, 맥에서는 cmd로 토글 가능
  const wasToggleInSelectionGroupKeyUsed = (event) => {
    const isUsingWindows = navigator.userAgent.includes("Windows");
    return isUsingWindows ? event.ctrlKey : event.metaKey;
  };

  const wasMultiSelectKeyUsed = (event) => event.shiftKey;

  const performAction = (event) => {
    if (wasToggleInSelectionGroupKeyUsed(event)) {
      toggleSelectionInGroup(item.id);
      return;
    }

    if (wasMultiSelectKeyUsed(event)) {
      multiSelectTo(item.id);
      return;
    }

    toggleSelection(item.id);
  };

  const onKeyDown = (event, provided, snapshot) => {
    if (event.defaultPrevented) {
      return;
    }

    if (snapshot.isDragging) {
      return;
    }

    if (event.keyCode !== KEY_CODES.enter) {
      return;
    }

    event.preventDefault();

    performAction(event);
  };

  const onClick = (event) => {
    if (event.defaultPrevented) {
      return;
    }

    // 왼쪽 마우스 클릭이 아닐 경우 return
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();

    performAction(event);
  };

  const onTouchEnd = (event) => {
    if (event.defaultPrevented) {
      return;
    }

    event.preventDefault();
    toggleSelectionInGroup(item.id);
  };

  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => {
        // 여러 아이템을 선택하고 드래그할 때 아이템 개수 표시 여부
        const shouldShowSelection = snapshot.isDragging && selectionCount > 1;

        return (
          <Container
            provided={provided}
            onClick={onClick}
            onTouchEnd={onTouchEnd}
            onKeyDown={(e) => onKeyDown(e, provided, snapshot)}
            isDragging={snapshot.isDragging}
            isSelected={isSelected}
            isGhosting={isGhosting}
            snapshot={snapshot}
            shouldShowSelection={shouldShowSelection}
            selectionCount={selectionCount}
          >
            {item.content}
          </Container>
        );
      }}
    </Draggable>
  );
}

function Container({
  provided,
  onClick,
  onTouchEnd,
  onKeyDown,
  isSelected,
  snapshot,
  children,
  shouldShowSelection,
  selectionCount,
}) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      onClick={onClick}
      onTouchEnd={onTouchEnd}
      onKeyDown={onKeyDown}
      className={`rounded-lg p-4 w-[80px] transition-shadow ${
        isSelected ? "bg-purple-200" : "bg-white"
      } ${
        snapshot.isDragging
          ? "bg-opacity-90 shadow-2xl shadow-gray-400"
          : "shadow"
      }`}
    >
      {children}
      {shouldShowSelection ? (
        <div className="absolute right-0 -top-2 bg-white border border-gray-200 w-fit h-fit rounded-full px-2">
          {selectionCount}
        </div>
      ) : null}
    </div>
  );
}
