import { useEffect, useRef } from "react";

// Glowing cursor that follows the mouse with a soft lag
export default function CursorGlow() {
  const glowRef = useRef(null);
  const pos = useRef({ x: -200, y: -200 });
  const current = useRef({ x: -200, y: -200 });
  const rafRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      current.current.x = lerp(current.current.x, pos.current.x, 0.1);
      current.current.y = lerp(current.current.y, pos.current.y, 0.1);

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${current.current.x - 200}px, ${current.current.y - 200}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 pointer-events-none"
      style={{
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.09) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)",
        zIndex: 9999,
        willChange: "transform",
        mixBlendMode: "screen",
      }}
    />
  );
}
