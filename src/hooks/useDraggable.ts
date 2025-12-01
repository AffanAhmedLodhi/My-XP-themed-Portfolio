import { useState, useRef, useEffect } from 'react';

export const useDraggable = (id: string, initialPos: { x: number; y: number }, onFocus: (id: string) => void) => {
  const [pos, setPos] = useState(initialPos);
  const [dragging, setDragging] = useState(false);
  const rel = useRef({ x: 0, y: 0 });

  const onStart = (clientX: number, clientY: number) => {
    onFocus(id);
    setDragging(true);
    rel.current = {
      x: clientX - pos.x,
      y: clientY - pos.y
    };
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    onStart(e.clientX, e.clientY);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.touches[0];
    onStart(touch.clientX, touch.clientY);
  };

  useEffect(() => {
    const onMove = (clientX: number, clientY: number) => {
      if (!dragging) return;
      setPos({
        x: clientX - rel.current.x,
        y: clientY - rel.current.y
      });
    };

    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
        if (dragging) e.preventDefault(); // Prevent scrolling while dragging
        const touch = e.touches[0];
        onMove(touch.clientX, touch.clientY);
    };
    const onEnd = () => setDragging(false);

    if (dragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [dragging]);

  return { pos, onMouseDown, onTouchStart, dragging };
};