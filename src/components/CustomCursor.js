import { useEffect, useRef, useState } from "react";
import "./CustomCursor.css";

const CustomCursor = () => {
  const [enabled, setEnabled] = useState(true);
  const dotRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      setEnabled(false);
      return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let circleX = 0;
    let circleY = 0;

    const DOT_SIZE = 10;
    const CIRCLE_SIZE = 28;
    const SMOOTHING = 0.12;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX - DOT_SIZE / 2}px`;
        dotRef.current.style.top = `${mouseY - DOT_SIZE / 2}px`;
      }
    };

    const animateCircle = () => {
      circleX += (mouseX - circleX) * SMOOTHING;
      circleY += (mouseY - circleY) * SMOOTHING;

      if (circleRef.current) {
        circleRef.current.style.left = `${circleX - CIRCLE_SIZE / 2}px`;
        circleRef.current.style.top = `${circleY - CIRCLE_SIZE / 2}px`;
      }

      requestAnimationFrame(animateCircle);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animateCircle();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // 🔴 THIS IS THE KEY LINE
  if (!enabled) return null;

  return (
    <>
      <div ref={circleRef} className="cursor-circle" />
      <div ref={dotRef} className="cursor-dot" />
    </>
  );
};

export default CustomCursor;
