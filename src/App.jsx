import React from "react";

import Header from "./components/Header";
import MultiDragAndDrop from "./components/MultiDragAndDrop";

export default function App() {
  return (
    <div className="flex flex-col p-4 h-dvh">
      <Header title="Drag and Drop">자유롭게 드래그해서 움직여보세요!✨</Header>

      <main className="flex justify-center gap-20 mt-4">
        <MultiDragAndDrop />
      </main>
    </div>
  );
}
