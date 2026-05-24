import React, { useState } from 'react';
import { playPop, playCoin } from '../utils/audio';

const quickAddTypes = [
  { id: 'task', label: '📋 Task' },
  { id: 'expense', label: '💳 Expense' },
  { id: 'alarm', label: '⏰ Alarm' },
  { id: 'reminder', label: '🔔 Reminder' },
];

const taskCategories = ['Work', 'Personal', 'Health', 'Shopping', 'Other'];
const expenseCategories = ['Food', 'Transport', 'Shopping', 'Rent', 'Entertainment', 'Health', 'Bills', 'Other'];
const priorities = ['low', 'medium', 'high'];

export default function QuickAddModal({ isOpen, onClose, onAddTask, onAddExpense, onAddAlarm, onAddReminder }) {
  const [type, setType] = useState('task');

  // Task fields
  const [taskText, setTaskText] = useState('');
  const [taskCategory, setTaskCategory] = useState('Personal');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskDue, setTaskDue] = useState('');

  // Expense fields
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState('Food');

  // Alarm fields
  const [alarmTime, setAlarmTime] = useState('');
  const [alarmLabel, setAlarmLabel] = useState('');

  // Reminder fields
  const [remMessage, setRemMessage] = useState('');
  const [remDatetime, setRemDatetime] = useState('');

  const resetFields = () => {
    setTaskText(''); setTaskCategory('Personal'); setTaskPriority('medium'); setTaskDue('');
    setExpDesc(''); setExpAmount(''); setExpCategory('Food');
    setAlarmTime(''); setAlarmLabel('');
    setRemMessage(''); setRemDatetime('');
  };

  const handleSubmit = () => {
    if (type === 'task' && taskText.trim()) {
      playPop();
      onAddTask({
        id: Date.now().toString(),
        text: taskText.trim(),
        category: taskCategory,
        priority: taskPriority,
        dueDate: taskDue || null,
        completed: false,
        createdAt: new Date().toISOString(),
      });
    } else if (type === 'expense' && expDesc.trim() && expAmount) {
      playCoin();
      onAddExpense({
        id: Date.now().toString(),
        description: expDesc.trim(),
        amount: parseFloat(expAmount),
        category: expCategory,
        date: new Date().toISOString(),
      });
    } else if (type === 'alarm' && alarmTime) {
      playPop();
      onAddAlarm({
        id: Date.now().toString(),
        time: alarmTime,
        label: alarmLabel.trim() || 'Alarm',
        enabled: true,
      });
    } else if (type === 'reminder' && remMessage.trim() && remDatetime) {
      playPop();
      onAddReminder({
        id: Date.now().toString(),
        message: remMessage.trim(),
        datetime: remDatetime,
        fired: false,
      });
    } else {
      return; // Don't close if nothing valid
    }
    resetFields();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} id="quick-add-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} id="quick-add-modal">
        <div className="modal-handle" />
        <div className="modal-title">Quick Add</div>

        {/* Type tabs */}
        <div className="modal-tabs">
          {quickAddTypes.map((t) => (
            <button
              key={t.id}
              className={`modal-tab${type === t.id ? ' active' : ''}`}
              onClick={() => setType(t.id)}
              id={`quick-add-tab-${t.id}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TASK FORM */}
        {type === 'task' && (
          <div>
            <input
              className="input-field mb-sm"
              placeholder="What needs to be done?"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              autoFocus
              id="task-input"
            />
            <div className="input-row">
              <select
                className="input-field"
                value={taskCategory}
                onChange={(e) => setTaskCategory(e.target.value)}
                id="task-category-select"
              >
                {taskCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                className="input-field"
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                id="task-priority-select"
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
            <input
              type="date"
              className="input-field mb-md"
              value={taskDue}
              onChange={(e) => setTaskDue(e.target.value)}
              id="task-due-input"
            />
          </div>
        )}

        {/* EXPENSE FORM */}
        {type === 'expense' && (
          <div>
            <input
              className="input-field mb-sm"
              placeholder="What did you spend on?"
              value={expDesc}
              onChange={(e) => setExpDesc(e.target.value)}
              autoFocus
              id="expense-desc-input"
            />
            <div className="input-row">
              <input
                type="number"
                className="input-field"
                placeholder="Amount ($)"
                value={expAmount}
                onChange={(e) => setExpAmount(e.target.value)}
                step="0.01"
                min="0"
                id="expense-amount-input"
              />
              <select
                className="input-field"
                value={expCategory}
                onChange={(e) => setExpCategory(e.target.value)}
                id="expense-category-select"
              >
                {expenseCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* ALARM FORM */}
        {type === 'alarm' && (
          <div>
            <input
              type="time"
              className="input-field mb-sm"
              value={alarmTime}
              onChange={(e) => setAlarmTime(e.target.value)}
              autoFocus
              id="alarm-time-input"
            />
            <input
              className="input-field mb-md"
              placeholder="Label (e.g. Wake Up, Gym Time)"
              value={alarmLabel}
              onChange={(e) => setAlarmLabel(e.target.value)}
              id="alarm-label-input"
            />
          </div>
        )}

        {/* REMINDER FORM */}
        {type === 'reminder' && (
          <div>
            <input
              className="input-field mb-sm"
              placeholder="Remind me to..."
              value={remMessage}
              onChange={(e) => setRemMessage(e.target.value)}
              autoFocus
              id="reminder-message-input"
            />
            <input
              type="datetime-local"
              className="input-field mb-md"
              value={remDatetime}
              onChange={(e) => setRemDatetime(e.target.value)}
              id="reminder-datetime-input"
            />
          </div>
        )}

        {/* Submit */}
        <button className="btn btn-primary btn-block" onClick={handleSubmit} id="quick-add-submit">
          Add {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      </div>
    </div>
  );
}
