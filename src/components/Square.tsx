import type { InCheck, Piece, Shade, WhoseTurn } from '@/types';
import { useDroppable } from "@dnd-kit/react";
import { useDraggable } from "@dnd-kit/react";

interface SquareProps {
    id: string;
    shade: Shade;
    piece: Piece;
    highlight: boolean;
    whoseTurn: WhoseTurn;
    handleClick: (id: string, piece: Piece) => void;
    inCheck: InCheck;
}

export default function Square({ id, shade, piece, highlight, whoseTurn, handleClick, inCheck }: SquareProps) {
    const { ref: dropRef } = useDroppable({ id });

    const { ref: dragRef } = useDraggable({
        id,
        disabled: !piece || whoseTurn !== piece.slice(-1),
    });

    return (
        <div
            ref={dropRef}
            className={`${shade === "light" ? "bg-green-300" : "bg-green-500"} w-[40px] h-[40px] relative flex items-center justify-center`}
            onClick={() => handleClick(id, piece)}
        >
            {piece ? (
                <div ref={whoseTurn === piece.slice(-1) ? dragRef : undefined} className='flex items-center justify-center'>
                    <img src={`/src/assets/pieces-svg/${piece}.svg`} alt={`${piece}`} />

                    {(inCheck && piece === "king-" + inCheck) &&
                        <div className="absolute z-15 w-[15px] h-[8px] rounded-full bg-gradient-to-r from-transparent via-red-500 to-transparent">

                        </div>
                    }

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