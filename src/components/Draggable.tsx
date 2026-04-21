import {useDraggable} from '@dnd-kit/react';
import type { ReactNode } from 'react';

interface DraggableProps {
    id: string;
    children: ReactNode;
}

export function Draggable({id, children}: DraggableProps) {
  const {ref} = useDraggable({
    id,
  });

  return (
    <button ref={ref}>
      {children}
    </button>
  );
}