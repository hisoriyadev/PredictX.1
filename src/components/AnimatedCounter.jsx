import { useState, useEffect, useRef } from "react";

// Hook: animates a number from 0 to `end` over `duration` ms
export function useAnimatedCounter(end, duration = 1200, trigger = true) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;
    const startTime = performance.now();
    const startVal = 0;
    const endVal = typeof end === "number" ? end : parseFloat(end) || 0;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(startVal + (endVal - startVal) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [end, duration, trigger]);

  return value;
}

// Component: wraps a number value with counter animation
export function AnimatedCounter({ value, suffix = "", prefix = "", duration = 1200 }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  // Parse numeric part
  const numericStr = String(value).replace(/[^0-9.]/g, "");
  const numericVal = parseFloat(numericStr) || 0;
  const nonNumericSuffix = String(value).replace(/[0-9.]/g, "");

  const count = useAnimatedCounter(numericVal, duration, inView);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{nonNumericSuffix}{suffix}
    </span>
  );
}
