/**
 * BackgroundMesh — Performance-optimized version
 * Uses CSS animations (not Framer Motion) and will-change for GPU compositing.
 * blur() is applied to static divs; only opacity animates to avoid layout thrash.
 */
export default function BackgroundMesh() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: -1, background: '#000' }}
    >
      <style>{`
        @keyframes glowPulse1 {
          0%, 100% { opacity: 0.06; transform: scale(1); }
          50%       { opacity: 0.12; transform: scale(1.08); }
        }
        @keyframes glowPulse2 {
          0%, 100% { opacity: 0.06; transform: scale(1.08); }
          50%       { opacity: 0.10; transform: scale(1); }
        }
        .bg-glow-1 {
          position: absolute;
          top: -250px; left: -250px;
          width: 700px; height: 700px;
          border-radius: 50%;
          background: #4f46e5;
          filter: blur(130px);
          will-change: opacity, transform;
          animation: glowPulse1 14s ease-in-out infinite;
        }
        .bg-glow-2 {
          position: absolute;
          bottom: -250px; right: -250px;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: #7c3aed;
          filter: blur(150px);
          will-change: opacity, transform;
          animation: glowPulse2 20s ease-in-out infinite;
        }
      `}</style>

      <div className="bg-glow-1" />
      <div className="bg-glow-2" />

      {/* Subtle dot grid — purely CSS, zero JS */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
}
