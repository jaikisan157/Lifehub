import React, { useState, useEffect, useRef } from 'react';
import { startAlarm, stopAlarm, playChime, playDelete } from '../utils/audio';

export default function TickTock({ alarms, setAlarms, reminders, setReminders }) {
  const [view, setView] = useState('alarms');
  const [ringing, setRinging] = useState(null); // alarm object that's ringing
  const alarmRef = useRef(null);

  // Check alarms every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const nowStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      alarms.forEach((alarm) => {
        if (alarm.enabled && alarm.time === nowStr && now.getSeconds() < 2 && !ringing) {
          setRinging(alarm);
          alarmRef.current = startAlarm();
        }
      });

      // Check reminders
      reminders.forEach((rem) => {
        if (!rem.fired) {
          const remTime = new Date(rem.datetime);
          if (now >= remTime) {
            playChime();
            setReminders((prev) =>
              prev.map((r) => (r.id === rem.id ? { ...r, fired: true } : r))
            );
          }
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [alarms, reminders, ringing]);

  const dismissAlarm = () => {
    stopAlarm();
    setRinging(null);
  };

  const snoozeAlarm = () => {
    stopAlarm();
    const snoozed = { ...ringing };
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    snoozed.time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setAlarms((prev) => prev.map((a) => (a.id === snoozed.id ? snoozed : a)));
    setRinging(null);
  };

  const toggleAlarm = (id) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const deleteAlarm = (id) => {
    playDelete();
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  };

  const deleteReminder = (id) => {
    playDelete();
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="tab-panel" id="ticktock-panel">
      {/* Ringing Overlay */}
      {ringing && (
        <div className="alarm-ring-overlay" id="alarm-ring">
          <div className="alarm-ring-icon">🔔</div>
          <div className="alarm-ring-time">{ringing.time}</div>
          <div className="alarm-ring-label">{ringing.label || 'Alarm'}</div>
          <div className="alarm-ring-actions">
            <button className="alarm-ring-btn snooze" onClick={snoozeAlarm} id="alarm-snooze">
              😴
              <span>Snooze</span>
            </button>
            <button className="alarm-ring-btn dismiss" onClick={dismissAlarm} id="alarm-dismiss">
              ✕
              <span>Dismiss</span>
            </button>
          </div>
        </div>
      )}

      <div className="section-header">
        <h2 className="section-title">Alarms & Reminders</h2>
      </div>

      {/* Sub-tabs */}
      <div className="modal-tabs mb-md">
        <button
          className={`modal-tab${view === 'alarms' ? ' active' : ''}`}
          onClick={() => setView('alarms')}
          id="ticktock-tab-alarms"
        >
          ⏰ Alarms
        </button>
        <button
          className={`modal-tab${view === 'reminders' ? ' active' : ''}`}
          onClick={() => setView('reminders')}
          id="ticktock-tab-reminders"
        >
          🔔 Reminders
        </button>
      </div>

      {/* Alarms */}
      {view === 'alarms' && (
        <>
          {alarms.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">⏰</div>
              <div className="empty-state-text">No alarms set</div>
              <div className="empty-state-sub">Tap + to create an alarm</div>
            </div>
          ) : (
            alarms.map((alarm) => (
              <div className="alarm-item" key={alarm.id} id={`alarm-${alarm.id}`}>
                <div style={{ flex: 1 }}>
                  <div className="alarm-time">{alarm.time}</div>
                  <div className="alarm-label">{alarm.label || 'Alarm'}</div>
                </div>
                <button
                  className={`alarm-toggle${alarm.enabled ? ' on' : ''}`}
                  onClick={() => toggleAlarm(alarm.id)}
                  aria-label="Toggle alarm"
                  id={`alarm-toggle-${alarm.id}`}
                />
                <button
                  className="task-delete"
                  onClick={() => deleteAlarm(alarm.id)}
                  aria-label="Delete alarm"
                  style={{ marginLeft: '8px' }}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </>
      )}

      {/* Reminders */}
      {view === 'reminders' && (
        <>
          {reminders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔔</div>
              <div className="empty-state-text">No reminders</div>
              <div className="empty-state-sub">Tap + to set a reminder</div>
            </div>
          ) : (
            reminders
              .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
              .map((rem) => {
                const dt = new Date(rem.datetime);
                const isPast = rem.fired;
                return (
                  <div
                    className="alarm-item"
                    key={rem.id}
                    id={`reminder-${rem.id}`}
                    style={{ opacity: isPast ? 0.5 : 1 }}
                  >
                    <div style={{ flex: 1 }}>
                      <div className="alarm-time" style={{ fontSize: '1.1rem' }}>
                        {rem.message}
                      </div>
                      <div className="alarm-label">
                        {isPast ? '✅ Done • ' : '⏳ '}
                        {dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at{' '}
                        {dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <button
                      className="task-delete"
                      onClick={() => deleteReminder(rem.id)}
                      aria-label="Delete reminder"
                    >
                      ✕
                    </button>
                  </div>
                );
              })
          )}
        </>
      )}
    </div>
  );
}
