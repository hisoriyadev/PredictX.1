// Animated gradient blob background with aurora strip
export default function BlobBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>

      {/* Aurora top strip */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: "2px",
          background: "linear-gradient(90deg, transparent 0%, #6366f1 20%, #a855f7 40%, #06b6d4 60%, #6366f1 80%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "auroraShift 5s linear infinite",
          boxShadow: "0 0 30px rgba(99,102,241,0.6), 0 0 60px rgba(168,85,247,0.3)",
        }}
      />

      {/* Blob 1 – top-left vivid indigo */}
      <div
        className="absolute rounded-full"
        style={{
          width: "60vw", height: "60vw",
          top: "-22vw", left: "-18vw",
          background: "radial-gradient(circle, rgba(79,70,229,0.2) 0%, rgba(99,102,241,0.08) 40%, transparent 70%)",
          filter: "blur(55px)",
          animation: "blobFloat1 20s ease-in-out infinite",
        }}
      />

      {/* Blob 2 – bottom-right vivid purple */}
      <div
        className="absolute rounded-full"
        style={{
          width: "55vw", height: "55vw",
          bottom: "-18vw", right: "-12vw",
          background: "radial-gradient(circle, rgba(147,51,234,0.18) 0%, rgba(168,85,247,0.07) 40%, transparent 70%)",
          filter: "blur(65px)",
          animation: "blobFloat2 24s ease-in-out infinite",
        }}
      />

      {/* Blob 3 – mid cyan accent */}
      <div
        className="absolute rounded-full"
        style={{
          width: "38vw", height: "38vw",
          top: "38%", left: "45%",
          transform: "translate(-50%,-50%)",
          background: "radial-gradient(circle, rgba(6,182,212,0.09) 0%, transparent 65%)",
          filter: "blur(75px)",
          animation: "blobFloat3 28s ease-in-out infinite",
        }}
      />

      {/* Blob 4 – subtle pink hint */}
      <div
        className="absolute rounded-full"
        style={{
          width: "30vw", height: "30vw",
          top: "60%", left: "10%",
          background: "radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 65%)",
          filter: "blur(80px)",
          animation: "blobFloat1 32s ease-in-out 3s infinite reverse",
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(5,6,15,0.6) 100%)",
        }}
      />
    </div>
  );
}
