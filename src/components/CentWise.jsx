import React, { useState, useMemo } from 'react';
import { playCoin, playDelete } from '../utils/audio';

const categoryConfig = {
  Food: { emoji: '🍕', color: '#e0694f' },
  Transport: { emoji: '🚗', color: '#6366f1' },
  Shopping: { emoji: '🛍️', color: '#a78bfa' },
  Rent: { emoji: '🏠', color: '#5d8a4c' },
  Entertainment: { emoji: '🎮', color: '#e8a44c' },
  Health: { emoji: '💊', color: '#4caf7d' },
  Bills: { emoji: '📄', color: '#06b6d4' },
  Other: { emoji: '📦', color: '#8c7262' },
};

const categoryNames = Object.keys(categoryConfig);

// SVG Donut Chart
function DonutChart({ data, total }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  if (total === 0) {
    return (
      <div className="donut-container">
        <svg className="donut-svg" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="var(--skeleton)" strokeWidth="16" />
          <text x="80" y="76" textAnchor="middle" className="donut-center-text">$0</text>
          <text x="80" y="94" textAnchor="middle" className="donut-center-label">No expenses</text>
        </svg>
      </div>
    );
  }

  return (
    <div className="donut-container">
      <svg className="donut-svg" viewBox="0 0 160 160">
        {data.map((seg) => {
          const dash = (seg.value / total) * circumference;
          const gap = circumference - dash;
          const currentOffset = offset;
          offset += dash;
          return (
            <circle
              key={seg.name}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="16"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-currentOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.6s ease, stroke-dashoffset 0.6s ease' }}
            />
          );
        })}
        <text x="80" y="76" textAnchor="middle" className="donut-center-text">${total.toFixed(0)}</text>
        <text x="80" y="94" textAnchor="middle" className="donut-center-label">Total Spent</text>
      </svg>
      <div className="donut-legend">
        {data.map((seg) => (
          <div className="legend-item" key={seg.name}>
            <div className="legend-dot" style={{ background: seg.color }} />
            <span>{seg.name} — ${seg.value.toFixed(0)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CentWise({ expenses, setExpenses, budgets, setBudgets }) {
  const [view, setView] = useState('overview'); // overview | log | budget

  const now = new Date();
  const monthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const totalSpent = monthExpenses.reduce((s, e) => s + e.amount, 0);

  // Category breakdown
  const categoryTotals = useMemo(() => {
    const map = {};
    monthExpenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map)
      .map(([name, value]) => ({
        name,
        value,
        color: categoryConfig[name]?.color || '#888',
      }))
      .sort((a, b) => b.value - a.value);
  }, [monthExpenses]);

  const deleteExpense = (id) => {
    playDelete();
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const totalBudget = Object.values(budgets).reduce((s, v) => s + v, 0);

  return (
    <div className="tab-panel" id="centwise-panel">
      <div className="section-header">
        <h2 className="section-title">Finance</h2>
      </div>

      {/* View Tabs */}
      <div className="modal-tabs mb-md">
        {['overview', 'log', 'budget'].map((v) => (
          <button
            key={v}
            className={`modal-tab${view === v ? ' active' : ''}`}
            onClick={() => setView(v)}
            id={`finance-tab-${v}`}
          >
            {v === 'overview' ? '📊 Overview' : v === 'log' ? '📝 Log' : '🎯 Budget'}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {view === 'overview' && (
        <>
          <div className="card" id="spending-summary">
            <div className="card-title">{now.toLocaleString('default', { month: 'long' })} Spending</div>
            <div className="card-value" style={{ color: totalSpent > totalBudget && totalBudget > 0 ? 'var(--danger)' : 'var(--text-main)' }}>
              ${totalSpent.toFixed(2)}
            </div>
            {totalBudget > 0 && (
              <>
                <div className="card-subtitle">of ${totalBudget.toFixed(0)} budget</div>
                <div className="progress-bar mt-sm">
                  <div
                    className={`progress-fill${totalSpent > totalBudget ? ' danger' : totalSpent > totalBudget * 0.8 ? ' warning' : ' success'}`}
                    style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
                  />
                </div>
              </>
            )}
          </div>

          <div className="card">
            <div className="card-title">Category Breakdown</div>
            <DonutChart data={categoryTotals} total={totalSpent} />
          </div>

          {/* Category Budget Bars */}
          {categoryNames.map((cat) => {
            const spent = categoryTotals.find((c) => c.name === cat)?.value || 0;
            const budget = budgets[cat] || 0;
            if (spent === 0 && budget === 0) return null;
            const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
            return (
              <div className="card" key={cat} style={{ padding: '14px 16px' }}>
                <div className="flex-between mb-sm">
                  <span className="fw-600 fs-sm">
                    {categoryConfig[cat].emoji} {cat}
                  </span>
                  <span className="fs-sm text-muted">
                    ${spent.toFixed(0)}{budget > 0 ? ` / $${budget}` : ''}
                  </span>
                </div>
                {budget > 0 && (
                  <div className="progress-bar" style={{ height: '6px' }}>
                    <div
                      className={`progress-fill${pct >= 100 ? ' danger' : pct >= 80 ? ' warning' : ' success'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {/* LOG VIEW */}
      {view === 'log' && (
        <>
          {monthExpenses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">💳</div>
              <div className="empty-state-text">No expenses this month</div>
              <div className="empty-state-sub">Tap + to log your first expense</div>
            </div>
          ) : (
            <div className="card">
              {monthExpenses
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((exp) => (
                  <div className="expense-item" key={exp.id} id={`expense-${exp.id}`}>
                    <div className="expense-icon" style={{ background: `${categoryConfig[exp.category]?.color}18` }}>
                      {categoryConfig[exp.category]?.emoji || '📦'}
                    </div>
                    <div className="expense-body">
                      <div className="expense-name">{exp.description}</div>
                      <div className="expense-cat">
                        {exp.category} • {new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <div className="expense-amount">-${exp.amount.toFixed(2)}</div>
                    <button className="task-delete" onClick={() => deleteExpense(exp.id)} aria-label="Delete expense" style={{ marginLeft: '4px' }}>✕</button>
                  </div>
                ))}
            </div>
          )}
        </>
      )}

      {/* BUDGET VIEW */}
      {view === 'budget' && (
        <div className="card">
          <div className="card-title">Monthly Budget Limits</div>
          <div className="card-subtitle mb-md">Set spending goals for each category</div>
          {categoryNames.map((cat) => (
            <div key={cat} className="flex gap-sm mb-sm" style={{ alignItems: 'center' }}>
              <span style={{ fontSize: '1.2rem', width: '32px', textAlign: 'center' }}>
                {categoryConfig[cat].emoji}
              </span>
              <span className="fw-600 fs-sm" style={{ width: '80px' }}>{cat}</span>
              <div style={{ position: 'relative', flex: 1 }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>$</span>
                <input
                  type="number"
                  className="input-field"
                  style={{ paddingLeft: '28px' }}
                  value={budgets[cat] || ''}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setBudgets((prev) => ({ ...prev, [cat]: val }));
                  }}
                  placeholder="0"
                  id={`budget-${cat.toLowerCase()}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
