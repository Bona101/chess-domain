import type { Piece, Shade } from '@/types';
import { useDroppable } from "@dnd-kit/react";
import { useDraggable } from "@dnd-kit/react";
import { Divide } from 'lucide-react';

interface SquareProps {
    id: string;
    shade: Shade;
    piece: Piece;
    highlight: boolean;
}

export default function Square({ id, shade, piece, highlight }: SquareProps) {
    const { ref: dropRef } = useDroppable({ id });

    const { ref: dragRef } = useDraggable({
        id,
        disabled: !piece,
    });

    return (
        <div ref={dropRef} className={`${shade === "light" ? "bg-green-300" : "bg-green-500"} w-[40px] h-[40px] relative flex items-center justify-center`}>
            {piece ? (
                <div ref={dragRef} className='flex'>
                    <img src={`/src/assets/pieces-svg/${piece}.svg`} alt={`${piece}`} />
                   
                    {highlight &&
                   <div className='absolute z-10 w-[40px] h-[40px] rounded-full border-2 border-blue-300'>

                    </div>
                    }
                </div>
            ) : (
                highlight && <div className='absolute z-10 w-[10px] h-[10px] bg-blue-300 rounded-full'>

                </div>
            )}
        </div>
    );
}