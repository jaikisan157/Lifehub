import React, { useState } from 'react';
import { playTock, playDelete, playPop } from '../utils/audio';

const categories = ['All', 'Work', 'Personal', 'Health', 'Shopping', 'Other'];
const priorities = ['low', 'medium', 'high'];

const categoryEmojis = {
  Work: '💼',
  Personal: '🏡',
  Health: '💪',
  Shopping: '🛒',
  Other: '📌',
};

export default function TaskFlow({ tasks, setTasks }) {
  const [filter, setFilter] = useState('All');
  const [showCompleted, setShowCompleted] = useState(false);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          if (!t.completed) playTock();
          return { ...t, completed: !t.completed };
        }
        return t;
      })
    );
  };

  const deleteTask = (id) => {
    playDelete();
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const filtered = tasks.filter((t) => {
    if (filter !== 'All' && t.category !== filter) return false;
    if (!showCompleted && t.completed) return false;
    return true;
  });

  const pending = filtered.filter((t) => !t.completed);
  const completed = filtered.filter((t) => t.completed);

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  pending.sort((a, b) => (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2));

  return (
    <div className="tab-panel" id="taskflow-panel">
      <div className="section-header">
        <h2 className="section-title">My Tasks</h2>
        <button
          className="section-action"
          onClick={() => setShowCompleted((p) => !p)}
          id="toggle-completed"
        >
          {showCompleted ? 'Hide done' : 'Show done'}
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-sm mb-md" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`badge ${filter === cat ? 'badge-accent' : ''}`}
            style={{
              padding: '6px 14px',
              fontSize: '0.78rem',
              whiteSpace: 'nowrap',
              background: filter === cat ? 'var(--accent-soft)' : 'var(--skeleton)',
              color: filter === cat ? 'var(--accent)' : 'var(--text-muted)',
              transition: 'all 0.15s ease',
            }}
            onClick={() => setFilter(cat)}
            id={`filter-${cat.toLowerCase()}`}
          >
            {cat !== 'All' && categoryEmojis[cat]} {cat}
          </button>
        ))}
      </div>

      {/* Pending Tasks */}
      {pending.length === 0 && completed.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <div className="empty-state-text">No tasks yet</div>
          <div className="empty-state-sub">Tap + to add your first task</div>
        </div>
      )}

      {pending.map((task) => (
        <div className="task-item" key={task.id} id={`task-${task.id}`}>
          <button
            className="task-check"
            onClick={() => toggleTask(task.id)}
            aria-label="Complete task"
          >
            ✓
          </button>
          <div className="task-body">
            <div className="task-text">{task.text}</div>
            <div className="task-meta">
              {task.category && (
                <span className="badge badge-accent">
                  {categoryEmojis[task.category]} {task.category}
                </span>
              )}
              {task.priority && (
                <span
                  className={`badge badge-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'success'}`}
                >
                  {task.priority}
                </span>
              )}
              {task.dueDate && (
                <span className="fs-sm text-muted">
                  📅 {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>
          </div>
          <button className="task-delete" onClick={() => deleteTask(task.id)} aria-label="Delete task">
            ✕
          </button>
        </div>
      ))}

      {/* Completed Tasks */}
      {showCompleted && completed.length > 0 && (
        <>
          <div className="card-title mt-md">Completed ({completed.length})</div>
          {completed.map((task) => (
            <div className="task-item completed" key={task.id} id={`task-${task.id}`}>
              <button
                className="task-check checked"
                onClick={() => toggleTask(task.id)}
                aria-label="Uncomplete task"
              >
                ✓
              </button>
              <div className="task-body">
                <div className="task-text">{task.text}</div>
              </div>
              <button className="task-delete" onClick={() => deleteTask(task.id)} aria-label="Delete task">
                ✕
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
