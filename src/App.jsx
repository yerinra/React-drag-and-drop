import React from "react";

import Header from "./components/Header";
import MultiDragAndDrop from "./components/MultiDragAndDrop";
import initial from "./lib/data";

export default function App() {
  return (
    <div className="flex flex-col p-4 h-full">
      <Header title="Drag and Drop">
        자유롭게 선택하고 드래그 해보세요!✨
      </Header>

      <main className="flex justify-center gap-20 mt-4">
        <MultiDragAndDrop data={initial} />
      </main>
    </div>
  );
}
