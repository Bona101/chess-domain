import {useDraggable} from '@dnd-kit/react';
import type { ReactNode } from 'react';

interface DraggableProps {
    id: string;
    children: ReactNode;
    setIdOfMovingPiece: (str: string) => void;
}

export function Draggable({id, children, setIdOfMovingPiece}: DraggableProps) {
  const {ref} = useDraggable({
    id,
  });

  return (
    <button ref={ref} onMouseDown={() => setIdOfMovingPiece(id)}>
      {children}
    </button>
  );
}