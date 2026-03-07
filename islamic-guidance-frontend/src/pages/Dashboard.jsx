import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import AyahCard from '../components/AyahCard';
import { ayahAPI, habitAPI } from '../services/api';

// ─── Fallback data (shown if API not yet connected) ───────────────────────────
const FALLBACK_AYAH = {
  arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
  text: 'Verily, with hardship comes ease.',
  ref: 'Quran 94:6',
};

const HABITS = [
  { id: 'fajr',    label: 'Fajr',   icon: '🌅', color: '#4ECDC4' },
  { id: 'dhuhr',   label: 'Dhuhr',  icon: '☀️', color: '#C9A84C' },
  { id: 'asr',     label: 'Asr',    icon: '🌤️', color: '#E8C97A' },
  { id: 'maghrib', label: 'Maghrib',icon: '🌆', color: '#E88C8C' },
  { id: 'isha',    label: 'Isha',   icon: '🌙', color: '#a78bfa' },
  { id: 'quran',   label: "Qur'an", icon: '📖', color: '#4ECDC4' },
  { id: 'dhikr',   label: 'Dhikr',  icon: '📿', color: '#C9A84C' },
];

const GUIDANCE = [
  { id: 'tawakkul', label: 'Tawakkul', sub: 'Trust in Allah', icon: '🤲', color: '#4ECDC4',
    note: 'Take action, then trust Allah with the outcome. That is Tawakkul.' },
  { id: 'sabr',     label: 'Sabr',     sub: 'Patience',       icon: '🕊️', color: '#C9A84C',
    note: 'Sabr is not silence. It is choosing Allah while you hurt.' },
  { id: 'iman',     label: 'Iman',     sub: 'Faith',          icon: '✨', color: '#a78bfa',
    note: 'Iman breathes. Nurture it with small, sincere acts.' },
  { id: 'shukr',    label: 'Shukr',    sub: 'Gratitude',      icon: '🌿', color: '#E88C8C',
    note: 'Shukr is noticing the quiet gifts — breath, sight, a beating heart.' },
];

export default function Dashboard() {
  const [ayah, setAyah] = useState(FALLBACK_AYAH);
  const [ayahLoading, setAyahLoading] = useState(false);
  const [completed, setCompleted] = useState([]);
  const [guidance, setGuidance] = useState(null);

  // Try to load ayah from API
  useEffect(() => {
    ayahAPI.getDailyAyah()
      .then(setAyah)
      .catch(() => {}); // silently use fallback
  }, []);

  // Try to load today's habits
  useEffect(() => {
    habitAPI.getToday()
      .then((data) => setCompleted(data?.completed || []))
      .catch(() => {});
  }, []);

  const handleNextAyah = async () => {
    setAyahLoading(true);
    try {
      const data = await ayahAPI.getRandom();
      if (data) setAyah(data);
    } catch {
      // cycle through fallbacks
    } finally {
      setAyahLoading(false);
    }
  };

  const toggleHabit = async (id) => {
    const isDone = completed.includes(id);
    setCompleted((prev) => isDone ? prev.filter((x) => x !== id) : [...prev, id]);
    try {
      isDone ? await habitAPI.uncomplete(id) : await habitAPI.complete(id);
    } catch {
      // revert on error
      setCompleted((prev) => isDone ? [...prev, id] : prev.filter((x) => x !== id));
    }
  };

  const progress = Math.round((completed.length / HABITS.length) * 100);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Lora:ital@0;1&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background: #0D1117; }
        .dashboard {
          min-height: 100vh;
          background: radial-gradient(ellipse at 20% 15%, #0f1e35 0%, #0D1117 60%);
          padding: 80px 20px 60px;
          font-family: system-ui, sans-serif;
          color: #E8DFD0;
        }
        .dashboard-inner {
          max-width: 720px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .greeting {
          padding: 8px 0 4px;
        }
        .greeting-top {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          color: #E8C97A;
          margin-bottom: 4px;
        }
        .greeting-sub {
          color: #8a9ab5;
          font-size: 14px;
          font-family: 'Lora', serif;
          font-style: italic;
        }
        .section-title {
          font-size: 11px;
          color: #8a9ab5;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        /* Habit Card */
        .habit-card {
          background: linear-gradient(135deg, #1e2a3a, #1a2840);
          border: 1px solid rgba(42,58,80,1);
          border-radius: 20px;
          padding: 24px 20px;
        }
        .habit-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }
        .habit-count {
          background: rgba(201,168,76,0.12);
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 8px;
          padding: 4px 12px;
          color: #C9A84C;
          font-size: 13px;
          font-weight: 700;
        }
        .habit-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 16px;
        }
        @media (max-width: 400px) {
          .habit-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .habit-btn {
          background: #111827;
          border: 1.5px solid rgba(42,58,80,1);
          border-radius: 14px;
          padding: 12px 6px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          transition: all 0.22s ease;
        }
        .habit-btn.done {
          transform: scale(1.04);
        }
        .habit-btn span.label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: #8a9ab5;
        }
        .habit-btn.done span.label {
          color: var(--c);
        }
        .habit-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--c);
        }
        .progress-track {
          background: rgba(255,255,255,0.06);
          border-radius: 100px;
          height: 6px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4ECDC4, #C9A84C);
          border-radius: 100px;
          transition: width 0.4s ease;
        }

        /* Guidance Grid */
        .guidance-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        .guidance-btn {
          background: #111827;
          border: 1.5px solid rgba(42,58,80,1);
          border-radius: 16px;
          padding: 18px 14px;
          cursor: pointer;
          text-align: left;
          transition: all 0.22s ease;
        }
        .guidance-btn.active {
          border-color: var(--c);
          background: rgba(0,0,0,0.3);
        }
        .guidance-btn:hover { border-color: var(--c); }
        .guidance-icon { font-size: 22px; margin-bottom: 8px; }
        .guidance-label {
          font-weight: 700;
          font-size: 14px;
          color: #E8DFD0;
          margin-bottom: 2px;
        }
        .guidance-btn.active .guidance-label { color: var(--c); }
        .guidance-sub { font-size: 11px; color: #8a9ab5; }

        .guidance-detail {
          background: linear-gradient(135deg, #1e2a3a, #1a2840);
          border-radius: 16px;
          padding: 20px;
          border-left: 3px solid var(--c);
          color: #E8DFD0;
          font-family: 'Lora', serif;
          font-style: italic;
          font-size: 15px;
          line-height: 1.75;
          animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
          from { opacity:0; transform:translateY(10px); }
          to { opacity:1; transform:translateY(0); }
        }
      `}</style>

      <NavBar />

      <div className="dashboard">
        <div className="dashboard-inner">

          {/* Greeting */}
          <div className="greeting">
            <div className="greeting-top">
              {new Date().getHours() < 12 ? '🌅 Good morning' :
               new Date().getHours() < 17 ? '☀️ Good afternoon' : '🌙 Good evening'}
            </div>
            <div className="greeting-sub">
              "And He found you lost and guided you." — 93:7
            </div>
          </div>

          {/* Ayah of the Day */}
          <div>
            <div className="section-title">✦ Ayah of the Day</div>
            <AyahCard ayah={ayah} onNext={handleNextAyah} loading={ayahLoading} />
          </div>

          {/* Habit Tracker */}
          <div>
            <div className="section-title">📿 Today's Ibadah</div>
            <div className="habit-card">
              <div className="habit-header">
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16 }}>
                  Daily Tracker
                </div>
                <div className="habit-count">{completed.length}/{HABITS.length}</div>
              </div>
              <div className="habit-grid">
                {HABITS.map((h) => {
                  const done = completed.includes(h.id);
                  return (
                    <button
                      key={h.id}
                      onClick={() => toggleHabit(h.id)}
                      className={`habit-btn ${done ? 'done' : ''}`}
                      style={{
                        '--c': h.color,
                        borderColor: done ? h.color : undefined,
                        background: done ? `${h.color}14` : undefined,
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{h.icon}</span>
                      <span className="label">{h.label}</span>
                      {done && <div className="habit-dot" style={{ '--c': h.color }} />}
                    </button>
                  );
                })}
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          {/* Guidance */}
          <div>
            <div className="section-title">🧭 Spiritual Guidance</div>
            <div className="guidance-grid">
              {GUIDANCE.map((g) => (
                <button
                  key={g.id}
                  className={`guidance-btn ${guidance === g.id ? 'active' : ''}`}
                  style={{ '--c': g.color }}
                  onClick={() => setGuidance(guidance === g.id ? null : g.id)}
                >
                  <div className="guidance-icon">{g.icon}</div>
                  <div className="guidance-label">{g.label}</div>
                  <div className="guidance-sub">{g.sub}</div>
                </button>
              ))}
            </div>
            {guidance && (() => {
              const g = GUIDANCE.find((x) => x.id === guidance);
              return (
                <div className="guidance-detail" style={{ '--c': g.color, marginTop: 12 }}>
                  {g.note}
                </div>
              );
            })()}
          </div>

        </div>
      </div>
    </>
  );
}