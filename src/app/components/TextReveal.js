import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';


const TextReveal = ({ text, className }) => {
  const textRef = useRef(null);

  useEffect(() => {
    const chars = textRef.current.querySelectorAll('span');
    gsap.fromTo(
      chars,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 7,
        ease: 'power2.out',
      }
    );
  }, []);

  return (
    <h1 className={`reveal-text ${className}`} ref={textRef}>
      {text.split('').map((char, index) => (
        <span key={index}>{char}</span>
      ))}
    </h1>
  );
};

export default TextReveal;