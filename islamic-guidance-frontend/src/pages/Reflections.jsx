import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import { reflectionAPI } from '../services/api';

const PROMPTS = [
  'What is weighing on my heart today?',
  'What am I grateful for right now?',
  'Where do I need more Tawakkul?',
  'What would I say to Allah in du\'a tonight?',
  'What is one thing I can do to strengthen my Iman?',
];

export default function Reflections() {
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState('');
  const [prompt, setPrompt] = useState(PROMPTS[0]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    reflectionAPI.getAll()
      .then(setEntries)
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  const handlePrompt = () => {
    const next = PROMPTS[(PROMPTS.indexOf(prompt) + 1) % PROMPTS.length];
    setPrompt(next);
  };

  const handleSave = async () => {
    if (!text.trim()) return;
    setSaving(true);
    setError('');
    const newEntry = {
      text: text.trim(),
      created_at: new Date().toISOString(),
    };
    try {
      const saved = await reflectionAPI.create(newEntry);
      setEntries((prev) => [saved || newEntry, ...prev]);
      setText('');
    } catch {
      // Optimistically add even if API not connected
      setEntries((prev) => [{ ...newEntry, id: Date.now() }, ...prev]);
      setText('');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    try {
      await reflectionAPI.delete(id);
    } catch {}
  };

  const fmt = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Lora:ital@0;1&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background: #0D1117; }
        .reflections {
          min-height: 100vh;
          background: radial-gradient(ellipse at 80% 15%, #0f1e35 0%, #0D1117 60%);
          padding: 80px 20px 60px;
          font-family: system-ui, sans-serif;
          color: #E8DFD0;
        }
        .ref-inner {
          max-width: 680px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .page-header { padding: 8px 0; }
        .page-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          color: #E8C97A;
          margin-bottom: 4px;
        }
        .page-sub {
          color: #8a9ab5;
          font-size: 13px;
          font-family: 'Lora', serif;
          font-style: italic;
        }

        /* Write box */
        .write-card {
          background: linear-gradient(135deg, #1e2a3a, #1a2840);
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 20px;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }
        .write-card::before {
          content: '';
          position: absolute;
          top:0; left:0; right:0; height:2px;
          background: linear-gradient(90deg, transparent, #C9A84C, transparent);
        }
        .prompt-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .prompt-text {
          font-family: 'Lora', serif;
          font-style: italic;
          font-size: 14px;
          color: #8a9ab5;
        }
        .prompt-btn {
          background: none;
          border: none;
          color: #C9A84C;
          font-size: 12px;
          cursor: pointer;
          letter-spacing: 0.05em;
          padding: 4px 8px;
          border-radius: 6px;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .prompt-btn:hover { background: rgba(201,168,76,0.1); }
        .write-textarea {
          width: 100%;
          background: rgba(13,17,23,0.5);
          border: 1.5px solid rgba(42,58,80,1);
          border-radius: 14px;
          padding: 14px 16px;
          color: #E8DFD0;
          font-family: 'Lora', Georgia, serif;
          font-size: 15px;
          line-height: 1.75;
          resize: none;
          outline: none;
          transition: border-color 0.2s;
          min-height: 120px;
        }
        .write-textarea:focus { border-color: rgba(201,168,76,0.4); }
        .write-textarea::placeholder { color: #3a4a5a; }
        .write-footer {
          display: flex;
          justify-content: flex-end;
          margin-top: 12px;
          gap: 10px;
          align-items: center;
        }
        .char-count { color: #4a5a6a; font-size: 12px; }
        .save-btn {
          background: linear-gradient(135deg, #8a6e2f, #C9A84C);
          border: none;
          border-radius: 11px;
          padding: 10px 22px;
          color: #0D1117;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
          font-family: system-ui;
        }
        .save-btn:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
        .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Entries */
        .entries-header {
          font-size: 11px;
          color: #8a9ab5;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .entry-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .entry-card {
          background: #1a2235;
          border: 1px solid rgba(42,58,80,1);
          border-radius: 16px;
          padding: 18px 20px;
          position: relative;
          animation: entryIn 0.35s ease;
          transition: border-color 0.2s;
        }
        .entry-card:hover { border-color: rgba(201,168,76,0.2); }
        @keyframes entryIn {
          from { opacity:0; transform:translateY(12px); }
          to { opacity:1; transform:translateY(0); }
        }
        .entry-text {
          font-family: 'Lora', serif;
          font-style: italic;
          font-size: 15px;
          color: #E8DFD0;
          line-height: 1.75;
          margin-bottom: 12px;
        }
        .entry-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .entry-date { color: #4a5a6a; font-size: 12px; }
        .entry-delete {
          background: none;
          border: none;
          color: #4a5a6a;
          font-size: 12px;
          cursor: pointer;
          padding: 3px 8px;
          border-radius: 6px;
          transition: all 0.2s;
        }
        .entry-delete:hover { color: #E88C8C; background: rgba(232,140,140,0.1); }
        .empty-state {
          text-align: center;
          padding: 40px 0;
          color: #4a5a6a;
          font-family: 'Lora', serif;
          font-style: italic;
        }
        .loading-spinner {
          display: flex;
          justify-content: center;
          padding: 40px;
        }
        .spinner {
          width: 28px; height: 28px;
          border: 2px solid rgba(201,168,76,0.2);
          border-top-color: #C9A84C;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <NavBar />

      <div className="reflections">
        <div className="ref-inner">

          <div className="page-header">
            <div className="page-title">🌙 Reflection Journal</div>
            <div className="page-sub">Your thoughts are safe here — pour your heart out.</div>
          </div>

          {/* Write */}
          <div className="write-card">
            <div className="prompt-row">
              <div className="prompt-text">{prompt}</div>
              <button className="prompt-btn" onClick={handlePrompt}>↻ New prompt</button>
            </div>
            <textarea
              className="write-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write freely, without judgment..."
              rows={5}
            />
            <div className="write-footer">
              <span className="char-count">{text.length} chars</span>
              <button
                className="save-btn"
                onClick={handleSave}
                disabled={saving || !text.trim()}
              >
                {saving ? 'Saving...' : '✦ Save Reflection'}
              </button>
            </div>
          </div>

          {/* Entries */}
          <div className="entries-header">
            🌿 Past reflections ({entries.length})
          </div>

          {loading ? (
            <div className="loading-spinner"><div className="spinner" /></div>
          ) : entries.length === 0 ? (
            <div className="empty-state">
              No reflections yet.<br />Write your first one above ✦
            </div>
          ) : (
            <div className="entry-list">
              {entries.map((e) => (
                <div key={e.id || e.created_at} className="entry-card">
                  <div className="entry-text">"{e.text}"</div>
                  <div className="entry-footer">
                    <div className="entry-date">{fmt(e.created_at)}</div>
                    <button className="entry-delete" onClick={() => handleDelete(e.id)}>
                      delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}