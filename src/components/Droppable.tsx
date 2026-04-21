import {useDroppable} from '@dnd-kit/react';
import type { ReactNode } from 'react';

interface DroppableProps {
    id: string;
    children: ReactNode;
}

export function Droppable({id, children}: DroppableProps) {
  const {ref} = useDroppable({
    id,
  });

  return (
    <div ref={ref}>
      {children}
    </div>
  );
}