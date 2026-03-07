import { useState } from 'react';

/**
 * AyahCard — displays a Quranic verse with Arabic, translation & reference.
 *
 * Props:
 *  ayah: { arabic: string, text: string, ref: string }
 *  onNext?: () => void   — callback to load next/random ayah
 *  loading?: boolean
 */
export default function AyahCard({ ayah, onNext, loading = false }) {
  const [saved, setSaved] = useState(false);

  if (!ayah) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Lora:ital@1&display=swap');

        .ayah-card {
          background: linear-gradient(135deg, #1e2a3a 0%, #1a2840 100%);
          border: 1px solid rgba(201, 168, 76, 0.2);
          border-radius: 20px;
          padding: 32px 28px;
          position: relative;
          overflow: hidden;
          font-family: system-ui, sans-serif;
          transition: border-color 0.3s ease;
        }
        .ayah-card:hover {
          border-color: rgba(201, 168, 76, 0.4);
        }
        .ayah-card-topline {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #C9A84C, transparent);
        }
        .ayah-arabic {
          font-family: 'Amiri', 'Traditional Arabic', serif;
          font-size: 22px;
          color: #C9A84C;
          text-align: center;
          direction: rtl;
          line-height: 1.9;
          margin-bottom: 20px;
        }
        .ayah-divider {
          width: 40px;
          height: 1px;
          background: rgba(201, 168, 76, 0.3);
          margin: 0 auto 20px;
        }
        .ayah-text {
          font-family: 'Lora', Georgia, serif;
          font-size: 17px;
          font-style: italic;
          color: #E8DFD0;
          text-align: center;
          line-height: 1.75;
          margin-bottom: 14px;
        }
        .ayah-ref {
          text-align: center;
          color: #C9A84C;
          font-size: 13px;
          opacity: 0.85;
          margin-bottom: 24px;
          letter-spacing: 0.05em;
        }
        .ayah-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
        }
        .ayah-btn {
          background: none;
          border: 1.5px solid rgba(138, 154, 181, 0.25);
          border-radius: 10px;
          padding: 8px 18px;
          color: #8a9ab5;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: system-ui;
        }
        .ayah-btn:hover {
          border-color: rgba(201, 168, 76, 0.4);
          color: #C9A84C;
        }
        .ayah-btn.saved {
          border-color: rgba(78, 205, 196, 0.5);
          color: #4ECDC4;
        }
        .ayah-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .ayah-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 160px;
        }
        .ayah-spinner {
          width: 28px; height: 28px;
          border: 2px solid rgba(201, 168, 76, 0.2);
          border-top-color: #C9A84C;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="ayah-card">
        <div className="ayah-card-topline" />

        {loading ? (
          <div className="ayah-loading">
            <div className="ayah-spinner" />
          </div>
        ) : (
          <>
            {ayah.arabic && (
              <div className="ayah-arabic">{ayah.arabic}</div>
            )}
            <div className="ayah-divider" />
            <div className="ayah-text">"{ayah.text}"</div>
            <div className="ayah-ref">— {ayah.ref}</div>

            <div className="ayah-actions">
              {onNext && (
                <button className="ayah-btn" onClick={onNext}>
                  ↻ Another Ayah
                </button>
              )}
              <button
                className={`ayah-btn ${saved ? 'saved' : ''}`}
                onClick={() => setSaved((s) => !s)}
              >
                {saved ? '✓ Saved' : '♡ Save'}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}