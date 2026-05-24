import React from 'react';
import { playTock } from '../utils/audio';

const defaultHabits = [
  { id: 'water', name: 'Drink Water', emoji: '💧' },
  { id: 'exercise', name: 'Exercise', emoji: '🏃' },
  { id: 'read', name: 'Read', emoji: '📚' },
  { id: 'meditate', name: 'Meditate', emoji: '🧘' },
  { id: 'sleep', name: 'Sleep 8hrs', emoji: '😴' },
  { id: 'healthy', name: 'Eat Healthy', emoji: '🥗' },
];

export default function Extras({ habits, todayHabits, setTodayHabits, streaks, setStreaks, notes, setNotes }) {
  const todayKey = new Date().toISOString().split('T')[0];

  const toggleHabit = (habitId) => {
    const current = todayHabits.find((h) => h.id === habitId);
    const newDone = !current?.done;

    if (newDone) playTock();

    setTodayHabits((prev) => {
      const exists = prev.find((h) => h.id === habitId);
      if (exists) {
        return prev.map((h) => (h.id === habitId ? { ...h, done: newDone } : h));
      }
      return [...prev, { id: habitId, done: true }];
    });

    // Update streaks
    if (newDone) {
      setStreaks((prev) => ({
        ...prev,
        [habitId]: {
          count: (prev[habitId]?.count || 0) + 1,
          lastDate: todayKey,
        },
      }));
    }
  };

  return (
    <div className="tab-panel" id="extras-panel">
      {/* Habits Section */}
      <div className="section-header">
        <h2 className="section-title">Daily Habits</h2>
        <span className="text-muted fs-sm">
          {todayHabits.filter((h) => h.done).length}/{habits.length} done
        </span>
      </div>

      <div className="habit-grid mb-md">
        {habits.map((habit) => {
          const isDone = todayHabits.find((h) => h.id === habit.id)?.done || false;
          const streak = streaks[habit.id]?.count || 0;
          return (
            <div
              key={habit.id}
              className={`habit-card${isDone ? ' done' : ''}`}
              onClick={() => toggleHabit(habit.id)}
              id={`habit-${habit.id}`}
            >
              <div className="habit-emoji">{habit.emoji}</div>
              <div className="habit-name">{habit.name}</div>
              <div className="habit-streak">
                {isDone ? '✅ Done' : streak > 0 ? `🔥 ${streak} day streak` : 'Tap to complete'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Notes Section */}
      <div className="section-header">
        <h2 className="section-title">Quick Notes</h2>
        <span className="text-muted fs-sm">Auto-saved</span>
      </div>

      <textarea
        className="notes-area"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Jot down your thoughts, ideas, phone numbers... anything you need to remember ✍️"
        id="quick-notes"
      />
    </div>
  );
}

export { defaultHabits };
