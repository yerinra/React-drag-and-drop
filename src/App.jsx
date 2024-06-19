import React from "react";

import Header from "./components/Header";
import MultiDragAndDrop from "./components/MultiDragAndDrop";
import initial from "./lib/data";

export default function App() {
  return (
    <div className="flex flex-col p-4 h-full">
      <Header title="Drag and Drop">
        <span className="text-gray-400 text-sm">
          자유롭게 선택하고 드래그 해보세요!✨
        </span>
        <ul className="mt-4 text-start text-red-400 text-sm">
          <li>One에 있는 아이템을 Three로 옮길 수 없습니다.</li>
          <li>짝수 아이템 앞에 짝수 아이템을 놓을 수 없습니다.</li>
        </ul>
      </Header>

      <main className="flex justify-center gap-10 mt-4">
        <MultiDragAndDrop data={initial} />
      </main>
    </div>
  );
}
