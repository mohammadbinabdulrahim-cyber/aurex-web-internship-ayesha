function TaskForm({ task, setTask, addTask }) {
  return (
    <form onSubmit={addTask}>
      <input
        type="text"
        placeholder="Enter your task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;
