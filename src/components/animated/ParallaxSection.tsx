import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  offset?: number;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  className = '',
  speed = 0.5,
  offset = 0
}) => {
  const { scrollY } = useScroll();
  const [elementTop, setElementTop] = useState(0);
  const [elementHeight, setElementHeight] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);

  const y = useTransform(
    scrollY,
    [elementTop - clientHeight, elementTop + elementHeight],
    [offset, -offset * speed]
  );

  useEffect(() => {
    const element = document.getElementById('parallax-element');
    if (element) {
      const onResize = () => {
        setElementTop(element.offsetTop);
        setElementHeight(element.offsetHeight);
        setClientHeight(window.innerHeight);
      };
      onResize();
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
  }, []);

  return (
    <motion.div
      id="parallax-element"
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};