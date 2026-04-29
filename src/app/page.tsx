"use client";

import React, { useState, useEffect } from "react";
import { Plus, Check, Trash2, ListTodo } from "lucide-react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

type FilterType = "all" | "active" | "completed";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [isClient, setIsClient] = useState(false);

  // Candidate Welcome Logs - The "Reward"
  useEffect(() => {
    // Trigger a network request that will stand out in the Network tab
    fetch("/secret-notes.txt").catch(() => { });

    console.group("🎨 Styling Secrets");
    console.log("- Header Gradient: linear-gradient(135deg, #a855f7, #6366f1)");
    console.log("- Glass Card: background: #1e1e24; backdrop-filter: blur(10px); border: 1px solid #33333d;");
    console.log("- Animations: Use '@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } }'");
    console.groupEnd();
  }, []);

  // Load from local storage
  useEffect(() => {
    setIsClient(true);
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (e) {
        console.error("Failed to parse todos");
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos, isClient]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
    };

    setTodos([newTodo, ...todos]);
    setInputValue("");
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  if (!isClient) return null; // Avoid hydration mismatch

  return (
    <main className="app-container">
      <div className="header">
        <h1>Tasks</h1>
        <p>Stay organized, stay focused.</p>
      </div>

      <div className="todo-card">
        <form className="todo-form" onSubmit={handleAddTodo}>
          <input
            type="text"
            className="todo-input"
            placeholder="What needs to be done?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="add-btn" aria-label="Add Task">
            <Plus size={20} />
            <span style={{ marginLeft: "8px" }}>Add</span>
          </button>
        </form>

        {todos.length === 0 ? (
          <div className="empty-state">
            <ListTodo size={48} opacity={0.5} />
            <p>You're all caught up! Add a task above.</p>
          </div>
        ) : (
          <>
            <ul className="todo-list">
              {filteredTodos.map((todo) => (
                <li
                  key={todo.id}
                  className={`todo-item ${todo.completed ? "completed" : ""}`}
                >
                  <div className="todo-content" onClick={() => toggleTodo(todo.id)}>
                    <div className="checkbox">
                      {todo.completed && <Check size={16} />}
                    </div>
                    <span className="todo-text">{todo.text}</span>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => deleteTodo(todo.id)}
                    aria-label="Delete Task"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="filters">
              <button
                className={`filter-btn ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={`filter-btn ${filter === "active" ? "active" : ""}`}
                onClick={() => setFilter("active")}
              >
                Active
              </button>
              <button
                className={`filter-btn ${filter === "completed" ? "active" : ""}`}
                onClick={() => setFilter("completed")}
              >
                Completed
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
