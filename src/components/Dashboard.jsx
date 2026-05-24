import React, { useMemo } from 'react';

const quotes = [
  "Small steps every day lead to big changes.",
  "Today is a fresh canvas — paint it beautiful.",
  "You're doing better than you think.",
  "Progress, not perfection.",
  "One task at a time. You've got this.",
  "Be kind to yourself today.",
  "Your only limit is your mind.",
  "A little planning goes a long way.",
  "Breathe. Focus. Achieve.",
  "Every day is a chance to grow.",
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return { text: 'Still up? Rest well', emoji: '🌙' };
  if (hour < 12) return { text: 'Good morning, sunshine', emoji: '☀️' };
  if (hour < 17) return { text: 'Good afternoon', emoji: '🌤️' };
  if (hour < 21) return { text: 'Good evening', emoji: '🌇' };
  return { text: 'Time to unwind', emoji: '🌙' };
}

export default function Dashboard({ tasks, expenses, alarms, habits, todayHabits }) {
  const greeting = getGreeting();
  const quote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], []);

  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const taskPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const now = new Date();
  const monthStr = now.toLocaleString('default', { month: 'long' });
  const monthExpenses = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const activeAlarms = alarms.filter((a) => a.enabled).length;

  const todayKey = now.toISOString().split('T')[0];
  const habitsCompleted = todayHabits ? todayHabits.filter((h) => h.done).length : 0;
  const habitsTotal = habits.length;

  return (
    <div className="tab-panel" id="dashboard-panel">
      {/* Greeting Card */}
      <div className="greeting-card" id="greeting-card">
        <span className="greeting-wave">{greeting.emoji}</span>
        <div className="greeting-text">{greeting.text}</div>
        <div className="greeting-quote">"{quote}"</div>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card" id="stat-tasks">
          <div className="stat-value text-accent">{pendingTasks}</div>
          <div className="stat-label">Pending Tasks</div>
        </div>
        <div className="stat-card" id="stat-budget">
          <div className="stat-value" style={{ color: monthExpenses > 0 ? 'var(--danger)' : 'var(--success)' }}>
            ${monthExpenses.toFixed(0)}
          </div>
          <div className="stat-label">{monthStr} Spent</div>
        </div>
        <div className="stat-card" id="stat-alarms">
          <div className="stat-value">{activeAlarms}</div>
          <div className="stat-label">Active Alarms</div>
        </div>
        <div className="stat-card" id="stat-habits">
          <div className="stat-value text-success">{habitsCompleted}/{habitsTotal}</div>
          <div className="stat-label">Habits Today</div>
        </div>
      </div>

      {/* Task Progress */}
      {totalTasks > 0 && (
        <div className="card" id="task-progress-card">
          <div className="card-title">Today's Progress</div>
          <div className="flex-between mb-sm">
            <span className="fw-700" style={{ fontSize: '1.1rem' }}>{taskPercent}%</span>
            <span className="text-muted fs-sm">{completedTasks}/{totalTasks} done</span>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-fill${taskPercent === 100 ? ' success' : taskPercent >= 60 ? '' : ' warning'}`}
              style={{ width: `${taskPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Quick Today's Tasks Preview */}
      {pendingTasks > 0 && (
        <div className="card" id="quick-tasks-preview">
          <div className="card-title">Up Next</div>
          {tasks
            .filter((t) => !t.completed)
            .slice(0, 3)
            .map((t) => (
              <div key={t.id} className="flex gap-sm mb-sm" style={{ alignItems: 'center' }}>
                <span style={{ color: 'var(--accent)', fontSize: '0.7rem' }}>●</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{t.text}</span>
                {t.priority && (
                  <span className={`badge badge-${t.priority === 'high' ? 'danger' : t.priority === 'medium' ? 'warning' : 'success'}`} style={{ marginLeft: 'auto' }}>
                    {t.priority}
                  </span>
                )}
              </div>
            ))}
          {pendingTasks > 3 && (
            <div className="text-muted fs-sm mt-sm">+{pendingTasks - 3} more tasks</div>
          )}
        </div>
      )}

      {/* Empty state */}
      {totalTasks === 0 && monthExpenses === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🚀</div>
          <div className="empty-state-text">Ready to take on the day?</div>
          <div className="empty-state-sub">Tap + to add your first task or expense</div>
        </div>
      )}
    </div>
  );
}
