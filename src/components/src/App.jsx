import { useState } from "react";

export default function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  function addTask(e) {
    e.preventDefault();

    const newTask = task.trim();
    if (!newTask) return;

    setTasks((previousTasks) => [
      ...previousTasks,
      {
        id: Date.now(),
        text: newTask,
        completed: false,
      },
    ]);

    setTask("");
  }

  function toggleTask(id) {
    setTasks((previousTasks) =>
      previousTasks.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  }

  function deleteTask(id) {
    setTasks((previousTasks) =>
      previousTasks.filter((item) => item.id !== id)
    );
  }

  return (
    <main>
      <h1>React Task Manager</h1>

      <form onSubmit={addTask}>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter your task"
        />
        <button type="submit">Add Task</button>
      </form>

      <ul>
        {tasks.map((item) => (
          <li key={item.id}>
            <span
              onClick={() => toggleTask(item.id)}
              style={{
                cursor: "pointer",
                textDecoration: item.completed
                  ? "line-through"
                  : "none",
              }}
            >
              {item.text}
            </span>{" "}
            <button type="button" onClick={() => deleteTask(item.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
