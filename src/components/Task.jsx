import { useState } from "react";

export default function Task({ task, from, onRemove, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);

  const handleDragStart = (e) => {
    e.dataTransfer.setData("task", JSON.stringify({ from, task }));
  };

  const handleSave = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== task.text) {
      onEdit(from, task.id, trimmed);
    }
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setDraft(task.text);
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <div className="bg-white p-3 rounded-md shadow flex items-center gap-2">
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 text-sm text-gray-700 outline-none border-b border-gray-300 focus:border-gray-500"
        />
        <button
          onClick={handleSave}
          className="text-green-600 hover:text-green-800 text-sm"
        >
          ✔
        </button>
        <button
          onClick={() => { setDraft(task.text); setEditing(false); }}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          ✖
        </button>
      </div>
    );
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-white p-3 rounded-md shadow flex justify-between items-center cursor-grab hover:bg-gray-50 transition"
    >
      <p className="text-gray-700 flex-1">{task.text}</p>
      <button
        onClick={() => setEditing(true)}
        className="text-gray-400 hover:text-gray-600 text-sm ml-2"
      >
        ✏
      </button>
      <button
        onClick={() => onRemove(from, task.id)}
        className="text-red-400 hover:text-red-600 text-sm ml-1"
      >
        ✖
      </button>
    </div>
  );
}
