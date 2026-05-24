import React from 'react';

const icons = {
  home: '🏠',
  tasks: '✅',
  finance: '💰',
  clock: '⏰',
  star: '⭐',
};

const tabs = [
  { id: 'dashboard', icon: icons.home, label: 'Home' },
  { id: 'tasks', icon: icons.tasks, label: 'Tasks' },
  { id: 'finance', icon: icons.finance, label: 'Finance' },
  { id: 'alarms', icon: icons.clock, label: 'Alarms' },
  { id: 'extras', icon: icons.star, label: 'Extras' },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="bottom-nav" id="bottom-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nav-item${activeTab === tab.id ? ' active' : ''}`}
          onClick={() => onTabChange(tab.id)}
          id={`nav-${tab.id}`}
          aria-label={tab.label}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
