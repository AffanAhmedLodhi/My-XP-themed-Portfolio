import { useState, useRef, useEffect } from 'react';

export const useDraggable = (id: string, initialPos: { x: number; y: number }, onFocus: (id: string) => void) => {
  const [pos, setPos] = useState(initialPos);
  const [dragging, setDragging] = useState(false);
  const rel = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    onFocus(id);
    setDragging(true);
    rel.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    };
    e.stopPropagation();
    e.preventDefault();
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      setPos({
        x: e.clientX - rel.current.x,
        y: e.clientY - rel.current.y
      });
    };
    const onMouseUp = () => setDragging(false);

    if (dragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, pos.x, pos.y, id, onFocus]);

  return { pos, onMouseDown, dragging };
};