import React from "react";

export default function Header({ title, children }) {
  return (
    <header className="text-center mx-auto my-10">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <span className="text-sm text-gray-500">{children}</span>
    </header>
  );
}
