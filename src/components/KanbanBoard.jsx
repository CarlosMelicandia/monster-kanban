import { useState } from "react";
import Column from "./Column";
import Monster from "./Monster";

export default function KanbanBoard() {
const [boards, setBoards] = useState({
    backlog: [
    { id: 1, text: "Learn React Basics" },
    { id: 2, text: "Understand State & Props" },
    ],
    doing: [{ id: 3, text: "Build a Kanban board" }],
    review: [],
    done: [],
});

const moveTask = (from, to, task) => {
    if (from === to) return;
    setBoards((prev) => {
    const newBoards = { ...prev };
    newBoards[from] = newBoards[from].filter((t) => t.id !== task.id);
    newBoards[to] = [...newBoards[to], task];
    return newBoards;
    });
};

return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-6xl">
    <Column
        title="Backlog"
        color="bg-rose-200"
        tasks={boards.backlog}
        onMove={moveTask}
        name="backlog"
        monster={{ color: "bg-red-500", height: "h-16" }}
    />
    <Column
        title="Doing"
        color="bg-amber-200"
        tasks={boards.doing}
        onMove={moveTask}
        name="doing"
        monster={{ color: "bg-orange-500", height: "h-16" }}
    />
    <Column
        title="Review"
        color="bg-green-200"
        tasks={boards.review}
        onMove={moveTask}
        name="review"
        monster={{ color: "bg-green-600", height: "h-16" }}
    />
    <Column
        title="Done"
        color="bg-sky-200"
        tasks={boards.done}
        onMove={moveTask}
        name="done"
        monster={{ color: "bg-blue-500", height: "h-16" }}
    />
    </div>
);
}