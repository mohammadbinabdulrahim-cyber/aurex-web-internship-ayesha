import { useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  function addTask(e) {
    e.preventDefault();
    if (!task.trim()) return;

    setTasks([
      ...tasks,
      { id: Date.now(), text: task, completed: false }
    ]);
    setTask("");
  }

  function toggleTask(id) {
    setTasks(tasks.map((item) =>
      item.id === id
        ? { ...item, completed: !item.completed }
        : item
    ));
  }

  function deleteTask(id) {
    setTasks(tasks.filter((item) => item.id !== id));
  }

  return (
    <main>
      <h1>React Task Manager</h1>
      <form onSubmit={addTask}>
        <input
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
                textDecoration: item.completed ? "line-through" : "none"
              }}
            >
              {item.text}
            </span>
            {" "}
            <button onClick={() => deleteTask(item.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
