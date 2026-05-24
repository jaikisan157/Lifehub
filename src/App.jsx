import React, { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { initAudio } from './utils/audio';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import TaskFlow from './components/TaskFlow';
import CentWise from './components/CentWise';
import TickTock from './components/TickTock';
import Extras, { defaultHabits } from './components/Extras';
import QuickAddModal from './components/QuickAddModal';
import InstallPrompt from './components/InstallPrompt';

const themes = [
  { id: 'sunrise-blossom', emoji: '🌅', label: 'Sunrise' },
  { id: 'matcha-sage', emoji: '🍃', label: 'Matcha' },
  { id: 'dreamy-aurora', emoji: '🌌', label: 'Aurora' },
  { id: 'nordic-autumn', emoji: '🍂', label: 'Autumn' },
];

export default function App() {
  const [theme, setTheme] = useLocalStorage('lifehub-theme', 'sunrise-blossom');
  const [activeTab, setActiveTab] = useLocalStorage('lifehub-tab', 'dashboard');
  const [audioReady, setAudioReady] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Data stores
  const [tasks, setTasks] = useLocalStorage('lifehub-tasks', []);
  const [expenses, setExpenses] = useLocalStorage('lifehub-expenses', []);
  const [budgets, setBudgets] = useLocalStorage('lifehub-budgets', {});
  const [alarms, setAlarms] = useLocalStorage('lifehub-alarms', []);
  const [reminders, setReminders] = useLocalStorage('lifehub-reminders', []);
  const [habits] = useLocalStorage('lifehub-habits', defaultHabits);

  const todayKey = new Date().toISOString().split('T')[0];
  const [todayHabitsMap, setTodayHabitsMap] = useLocalStorage('lifehub-today-habits', {});
  const todayHabits = todayHabitsMap[todayKey] || [];
  const setTodayHabits = useCallback(
    (updater) => {
      setTodayHabitsMap((prev) => {
        const current = prev[todayKey] || [];
        const next = typeof updater === 'function' ? updater(current) : updater;
        return { ...prev, [todayKey]: next };
      });
    },
    [todayKey, setTodayHabitsMap]
  );

  const [streaks, setStreaks] = useLocalStorage('lifehub-streaks', {});
  const [notes, setNotes] = useLocalStorage('lifehub-notes', '');

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Init audio on first touch
  const handleFirstInteraction = useCallback(() => {
    if (!audioReady) {
      initAudio();
      setAudioReady(true);
    }
  }, [audioReady]);

  // Quick add handlers
  const handleAddTask = (task) => setTasks((prev) => [task, ...prev]);
  const handleAddExpense = (exp) => setExpenses((prev) => [exp, ...prev]);
  const handleAddAlarm = (alarm) => setAlarms((prev) => [...prev, alarm]);
  const handleAddReminder = (rem) => setReminders((prev) => [...prev, rem]);

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            tasks={tasks}
            expenses={expenses}
            alarms={alarms}
            habits={habits}
            todayHabits={todayHabits}
          />
        );
      case 'tasks':
        return <TaskFlow tasks={tasks} setTasks={setTasks} />;
      case 'finance':
        return (
          <CentWise
            expenses={expenses}
            setExpenses={setExpenses}
            budgets={budgets}
            setBudgets={setBudgets}
          />
        );
      case 'alarms':
        return (
          <TickTock
            alarms={alarms}
            setAlarms={setAlarms}
            reminders={reminders}
            setReminders={setReminders}
          />
        );
      case 'extras':
        return (
          <Extras
            habits={habits}
            todayHabits={todayHabits}
            setTodayHabits={setTodayHabits}
            streaks={streaks}
            setStreaks={setStreaks}
            notes={notes}
            setNotes={setNotes}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div onClick={handleFirstInteraction} style={{ minHeight: '100dvh' }}>
      {/* Animated background orbs */}
      <div className="app-bg">
        <div className="orb-3" />
      </div>

      <div className="app-container">
        {/* Header */}
        <header className="app-header" id="app-header">
          <h1>
            Life<span>Hub</span>
          </h1>
          <div className="theme-switcher" id="theme-switcher">
            {themes.map((t) => (
              <button
                key={t.id}
                className={`theme-btn${theme === t.id ? ' active' : ''}`}
                onClick={() => setTheme(t.id)}
                title={t.label}
                aria-label={`Switch to ${t.label} theme`}
                id={`theme-${t.id}`}
              >
                {t.emoji}
              </button>
            ))}
          </div>
        </header>

        {/* Main content */}
        <main className="app-main" id="app-main">
          {renderTab()}
        </main>

        {/* FAB */}
        <button
          className={`fab${showQuickAdd ? ' open' : ''}`}
          onClick={() => setShowQuickAdd((p) => !p)}
          aria-label="Quick add"
          id="fab-button"
        >
          +
        </button>

        {/* Bottom nav */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Quick Add Modal */}
        <QuickAddModal
          isOpen={showQuickAdd}
          onClose={() => setShowQuickAdd(false)}
          onAddTask={handleAddTask}
          onAddExpense={handleAddExpense}
          onAddAlarm={handleAddAlarm}
          onAddReminder={handleAddReminder}
        />
      </div>

      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  );
}
