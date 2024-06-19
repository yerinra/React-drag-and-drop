import { useCallback, useState } from "react";
import { multiDragAwareReorder } from "../lib/utils";

export const useDrag = (
  entities,
  setEntities,
  selectedIds,
  setSelectedIds,
  setDraggingId,
  unselectAll,
  setStartIdx,
) => {
  const [error, setError] = useState(false);

  const onDragStart = useCallback(
    (start) => {
      const { draggableId } = start;

      const selected =
        selectedIds && selectedIds.find((id) => id === draggableId);

      // 이동을 시작하는 col의 인덱스(첫번째에서 세번째 col로 이동하는 것을 막기 위해 필요)
      const newIdx = entities.columnOrder.indexOf(start.source.droppableId);
      setStartIdx(newIdx);

      if (!selected) unselectAll();

      setDraggingId(start.draggableId);
    },
    [
      entities.columnOrder,
      selectedIds,
      setDraggingId,
      setStartIdx,
      unselectAll,
    ],
  );

  const onDragEnd = (result) => {
    const { source, destination, reason } = result;

    if (!destination || reason === "CANCEL") {
      setDraggingId(undefined);
      return;
    }

    // 첫 번째 column에서 세번째 column으로 이동 금지
    if (source.droppableId === "one" && destination.droppableId === "three") {
      setDraggingId(undefined);
      return;
    }

    const processed = multiDragAwareReorder({
      entities,
      selectedItemIds: selectedIds,
      source,
      destination,
    });

    // 제약조건 때문에 util.js의 multiDragAwareReorder에서 return 되었다면 error를
    // true로 설정해서 1초동안 에러 UI 표시
    if (JSON.stringify(entities) === JSON.stringify(processed.entities)) {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }

    setEntities(processed.entities);
    setSelectedIds(processed.selectedItemIds);
    setDraggingId(undefined);
    setStartIdx(null);
  };

  return { onDragStart, onDragEnd, error };
};
