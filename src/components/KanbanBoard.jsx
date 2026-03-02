import { useEffect, useState } from "react";
import Column from "./Column";
import { getTasks, addTask as addTaskAPI, updateTask, deleteTask } from "../api/tasks";

export default function KanbanBoard() {
  const [boards, setBoards] = useState({
    backlog: [],
    doing: [],
    review: [],
    done: [],
  });

  // Load tasks from backend on mount
  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await getTasks();

        // Group backend tasks by status → column
        const groups = { backlog: [], doing: [], review: [], done: [] };
        for (const t of data) {
          const column = t.status === "todo" ? "backlog" : t.status;
          if (groups[column]) {
            groups[column].push({ id: t.id, text: t.title });
          }
        }
        setBoards(groups);
      } catch (err) {
        console.error("Error loading tasks:", err);
      }
    }

    loadTasks();
  }, []);

  // Add a new task
  const addTask = async (column, text) => {
    if (!text) return;
    const status = column === "backlog" ? "todo" : column;
    try {
      const newTask = await addTaskAPI(text, status);
      setBoards((prev) => {
        const newBoards = { ...prev };
        newBoards[column] = [
          ...newBoards[column],
          { id: newTask.id, text: newTask.title },
        ];
        return newBoards;
      });
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // Move task between columns (update status)
  const moveTask = async (from, to, task) => {
    if (from === to) return;
    const newStatus = to === "backlog" ? "todo" : to;
    try {
      await updateTask(task.id, { title: task.text, status: newStatus });
      setBoards((prev) => {
        const newBoards = { ...prev };
        newBoards[from] = newBoards[from].filter((t) => t.id !== task.id);
        newBoards[to] = [...newBoards[to], task];
        return newBoards;
      });
    } catch (err) {
      console.error("Error moving task:", err);
    }
  };

  // Edit task title
  const editTask = async (column, id, newText) => {
    const status = column === "backlog" ? "todo" : column;
    try {
      await updateTask(id, { title: newText, status });
      setBoards((prev) => {
        const newBoards = { ...prev };
        newBoards[column] = newBoards[column].map((t) =>
          t.id === id ? { ...t, text: newText } : t
        );
        return newBoards;
      });
    } catch (err) {
      console.error("Error editing task:", err);
    }
  };

  // Remove task (delete)
  const removeTask = async (column, id) => {
    try {
      await deleteTask(id);
      setBoards((prev) => {
        const newBoards = { ...prev };
        newBoards[column] = newBoards[column].filter((t) => t.id !== id);
        return newBoards;
      });
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-6xl">
      <Column
        title="Backlog"
        color="bg-red-200"
        tasks={boards.backlog}
        onMove={moveTask}
        onAdd={addTask}
        onRemove={removeTask}
        onEdit={editTask}
        name="backlog"
        monster={{ color: "bg-red-500", upper: 4, lower: 3, eyes: { left: "4rem", right: "6rem" } }}
      />
      <Column
        title="Doing"
        color="bg-orange-100"
        tasks={boards.doing}
        onMove={moveTask}
        onAdd={addTask}
        onRemove={removeTask}
        onEdit={editTask}
        name="doing"
        monster={{ color: "bg-orange-500", upper: 6, lower: 5, eyes: { left: "5.5rem", right: "3.5rem" } }}
      />
      <Column
        title="Review"
        color="bg-green-100"
        tasks={boards.review}
        onMove={moveTask}
        onAdd={addTask}
        onRemove={removeTask}
        onEdit={editTask}
        name="review"
        monster={{ color: "bg-green-500", upper: 3, lower: 6, eyes: { left: "6rem", right: "4.5rem" } }}
      />
      <Column
        title="Done"
        color="bg-blue-100"
        tasks={boards.done}
        onMove={moveTask}
        onAdd={addTask}
        onRemove={removeTask}
        onEdit={editTask}
        name="done"
        monster={{ color: "bg-blue-500", upper: 5, lower: 4, eyes: { left: "3.5rem", right: "5rem" } }}
      />
    </div>
  );
}
