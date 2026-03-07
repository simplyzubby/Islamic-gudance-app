import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: '✦', title: 'Ayah for Every Moment', desc: 'Quranic verses chosen for when you feel lost, anxious, or grateful.' },
  { icon: '📿', title: 'Daily Ibadah Tracker', desc: 'Track prayers, dhikr and Quran reading — build consistent habits.' },
  { icon: '🌙', title: 'Reflection Journal', desc: 'A private, peaceful space to pour your heart out.' },
  { icon: '🧭', title: 'Spiritual Guidance', desc: 'Explore Tawakkul, Sabr, Iman and Shukr with depth.' },
];

export default function Landing() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lora:ital@0;1&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .landing {
          min-height: 100vh;
          background: radial-gradient(ellipse at 25% 15%, #0f1e35 0%, #0D1117 65%);
          color: #E8DFD0;
          font-family: system-ui, sans-serif;
          overflow-x: hidden;
        }

        /* Stars */
        .stars {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .star {
          position: absolute;
          border-radius: 50%;
          background: #E8C97A;
          animation: twinkle var(--dur) var(--delay) infinite ease-in-out;
        }
        @keyframes twinkle {
          0%,100% { opacity: 0; }
          50% { opacity: 0.55; }
        }

        /* Nav */
        .landing-nav {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 40px;
        }
        .brand {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          background: linear-gradient(135deg, #E8C97A, #C9A84C);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-decoration: none;
        }
        .nav-actions { display: flex; gap: 12px; }
        .btn-ghost {
          background: none;
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 10px;
          padding: 8px 20px;
          color: #C9A84C;
          text-decoration: none;
          font-size: 13px;
          transition: all 0.2s;
        }
        .btn-ghost:hover {
          background: rgba(201,168,76,0.1);
        }
        .btn-primary {
          background: linear-gradient(135deg, #8a6e2f, #C9A84C);
          border: none;
          border-radius: 10px;
          padding: 8px 20px;
          color: #0D1117;
          font-weight: 700;
          text-decoration: none;
          font-size: 13px;
          transition: opacity 0.2s;
        }
        .btn-primary:hover { opacity: 0.85; }

        /* Hero */
        .hero {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 80px 24px 60px;
        }
        .hero-badge {
          display: inline-block;
          background: rgba(201,168,76,0.12);
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 100px;
          padding: 6px 18px;
          font-size: 12px;
          color: #C9A84C;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 28px;
        }
        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(40px, 8vw, 72px);
          font-weight: 700;
          line-height: 1.15;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #E8C97A 0%, #C9A84C 50%, #b8c5d6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-sub {
          font-family: 'Playfair Display', serif;
          font-size: clamp(18px, 3vw, 26px);
          font-style: italic;
          color: #8a9ab5;
          margin-bottom: 40px;
        }
        .hero-arabic {
          font-family: 'Traditional Arabic', 'Amiri', serif;
          font-size: 28px;
          color: rgba(201,168,76,0.7);
          direction: rtl;
          margin-bottom: 48px;
        }
        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #8a6e2f, #C9A84C);
          border: none;
          border-radius: 14px;
          padding: 16px 36px;
          color: #0D1117;
          font-weight: 700;
          font-size: 16px;
          text-decoration: none;
          transition: transform 0.2s, opacity 0.2s;
        }
        .hero-cta:hover { transform: translateY(-2px); opacity: 0.9; }

        /* Features */
        .features {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 24px 100px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }
        .feature-card {
          background: linear-gradient(135deg, #1e2a3a, #1a2840);
          border: 1px solid rgba(42,58,80,1);
          border-radius: 18px;
          padding: 24px 20px;
          transition: border-color 0.25s, transform 0.25s;
        }
        .feature-card:hover {
          border-color: rgba(201,168,76,0.3);
          transform: translateY(-4px);
        }
        .feature-icon {
          font-size: 24px;
          margin-bottom: 14px;
        }
        .feature-title {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          color: #E8DFD0;
          margin-bottom: 8px;
        }
        .feature-desc {
          font-size: 13px;
          color: #8a9ab5;
          line-height: 1.65;
        }

        /* Footer quote */
        .footer-quote {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 0 24px 60px;
          color: #8a9ab5;
          font-family: 'Lora', serif;
          font-style: italic;
          font-size: 15px;
        }
        .footer-quote span {
          color: #C9A84C;
          display: block;
          margin-top: 6px;
          font-size: 12px;
          font-style: normal;
        }
      `}</style>

      <div className="landing">
        {/* Star field */}
        <div className="stars">
          {Array.from({ length: 55 }, (_, i) => (
            <div key={i} className="star" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 1.5 + 0.5}px`,
              height: `${Math.random() * 1.5 + 0.5}px`,
              '--dur': `${Math.random() * 3 + 2}s`,
              '--delay': `${Math.random() * 4}s`,
            }} />
          ))}
        </div>

        {/* Nav */}
        <nav className="landing-nav">
          <span className="brand">🌙 Sakina</span>
          <div className="nav-actions">
            <Link to="/login" className="btn-ghost">Sign in</Link>
            <Link to="/register" className="btn-primary">Get started</Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="hero">
          <div className="hero-badge">Islamic Healing & Guidance</div>
          <h1 className="hero-title">Find Peace<br />in His Words</h1>
          <p className="hero-sub">A sanctuary for the Muslim heart</p>
          <div className="hero-arabic">وَلَذِكْرُ اللَّهِ أَكْبَرُ</div>
          <Link to="/register" className="hero-cta">
            ✦ Begin your journey
          </Link>
        </section>

        {/* Features */}
        <section className="features">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </section>

        {/* Footer */}
        <div className="footer-quote">
          "Verily, with hardship comes ease."
          <span>— Quran 94:6</span>
        </div>
      </div>
    </>
  );
}