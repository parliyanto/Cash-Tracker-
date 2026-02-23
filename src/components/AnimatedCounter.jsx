import { useEffect, useState } from "react";

function AnimatedCounter({ value, duration = 800 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(value);
    if (start === end) return;

    const incrementTime = 16;
    const totalFrames = Math.round(duration / incrementTime);
    const increment = end / totalFrames;

    let currentFrame = 0;

    const counter = setInterval(() => {
      currentFrame++;
      start += increment;

      if (currentFrame >= totalFrames) {
        clearInterval(counter);
        setDisplayValue(end);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(counter);
  }, [value, duration]);

  return <span>{displayValue.toLocaleString("id-ID")}</span>;
}

export default AnimatedCounter;