import React, { useRef, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Link } from "react-router-dom";
import { nanoid } from "nanoid";
import usePrevious from "./usePrevious";
import Todo from "./components/Todo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Display from "./components/Display";

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState("All");

  const listHeadingRef = useRef(null);

  const prevTaskLength = usePrevious(tasks.length);

  function addTask(name) {
    const newTask = { id: "task-" + nanoid(), name: name, completed: false };
    setTasks([...tasks, newTask]);
  }

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, name: newName };
      }
      return task;
    });
    setTasks(editedTaskList);
  }
  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  const taskNoun = taskList.length === 1 ? "task" : "tasks";
  const headingText = `${taskList.length} ${taskNoun} remaining`;

  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  return (
    <Router>
      <Switch>
        <Route path="/rps">
          <Display />
        </Route>
        <Route path="/">
          <div className="todoapp stack-large">
            <h1>Todo</h1>

            <Form addTask={addTask} />
            <div className="filters btn-group stack-exception">
              {filterList}
            </div>

            <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
              {headingText}
            </h2>

            <ul
              role="list"
              className="todo-list stack-large stack-exception"
              aria-labelledby="list-heading"
            >
              {taskList}
            </ul>
            <footer className="footer-todo-app">
              <Link to="/rps">check out my rock-paper-scissors game</Link>
            </footer>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
