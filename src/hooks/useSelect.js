import { useEffect } from "react";
import { multiSelectTo as multiSelect } from "../lib/utils";

export const useSelect = (
  entities,
  selectedIds,
  setSelectedIds,
  unselectAll,
) => {
  useEffect(() => {
    const onWindowKeyDown = (event) => {
      if (event.defaultPrevented) {
        return;
      }

      if (event.key === "Escape") {
        unselectAll();
      }
    };

    const onWindowClick = (event) => {
      if (event.defaultPrevented) {
        return;
      }
      unselectAll();
    };

    const onWindowTouchEnd = (event) => {
      if (event.defaultPrevented) {
        return;
      }
      unselectAll();
    };

    window.addEventListener("click", onWindowClick);
    window.addEventListener("keydown", onWindowKeyDown);
    window.addEventListener("touchend", onWindowTouchEnd);

    return () => {
      window.removeEventListener("click", onWindowClick);
      window.removeEventListener("keydown", onWindowKeyDown);
      window.removeEventListener("touchend", onWindowTouchEnd);
    };
  }, [unselectAll]);

  // 하나의 아이템 선택을 토글
  const toggleSelection = (itemId) => {
    const wasSelected = selectedIds.includes(itemId);

    const newItemIds = (() => {
      // 이전에 선택되지 않은 아이템을 클릭했다면 유일한 아이템으로 선택
      if (!wasSelected) {
        return [itemId];
      }

      // 이전에 선택되었던 아이템들 중 하나였다면 유일한 아이템으로 선택
      if (selectedIds.length > 1) {
        return [itemId];
      }

      // 이전에 유일하게 선택되었던 아이템이라면 선택을 해제
      return [];
    })();

    setSelectedIds(newItemIds);
  };

  // 여러개의 아이템 선택 토글
  const toggleSelectionInGroup = (itemId) => {
    const index = selectedIds.indexOf(itemId);

    // 이전에 선택되지 않았다면 선택된 아이템에 추가
    if (index === -1) {
      setSelectedIds((prevState) => [...prevState, itemId]);
      return;
    }

    // 이전에 선택되었다면 선택된 아이템에서 제거
    const shallow = [...selectedIds];
    shallow.splice(index, 1);
    setSelectedIds(shallow);
  };

  // 선택된 아이템들을 selectedIds에 업데이트
  const multiSelectTo = (newItemId) => {
    const updated = multiSelect(entities, selectedIds, newItemId);

    if (updated == null) {
      return;
    }

    setSelectedIds(updated);
  };

  return {
    toggleSelection,
    toggleSelectionInGroup,
    multiSelectTo,
  };
};
