import { useState } from "react";
import Monster from "./Monster";
import Task from "./Task";

export default function Column({
  title,
  color,
  tasks,
  onMove,
  onAdd,
  onRemove,
  onEdit,
  name,
  monster,
}) {
  const [newTask, setNewTask] = useState("");

  const handleDrop = (e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("task"));
    onMove(data.from, name, data.task);
  };

  const handleAdd = () => {
    if (newTask.trim() === "") return;
    onAdd(name, newTask);
    setNewTask("");
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <Monster color={monster.color} bodyColor={color} upperTeeth={monster.upper} lowerTeeth={monster.lower} eyes={monster.eyes}>
        <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">
          {title}
        </h2>

        {/* Tasks */}
        <div className="flex-1 space-y-2 mb-3">
          {tasks.length === 0 ? (
            <p className="text-sm text-gray-500 text-center italic">
              No tasks yet
            </p>
          ) : (
            tasks.map((t) => (
              <Task key={t.id} task={t} from={name} onRemove={onRemove} onEdit={onEdit} />
            ))
          )}
        </div>

        {/* Add Task Box */}
        <div className="flex space-x-2">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 px-2 py-1 text-sm border rounded-md"
            placeholder="New Task..."
          />
          <button
            onClick={handleAdd}
            className="bg-white border text-sm px-3 rounded-md hover:bg-white/70 transition"
          >
            ➕
          </button>
        </div>
      </Monster>
    </div>
  );
}
