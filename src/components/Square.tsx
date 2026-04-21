import type { Piece } from '@/types';

interface SquareProps {
    row: number;
    col: number;
    piece: Piece;
}

export default function Square({ row, col, piece }: SquareProps) {
    return (
        <div className={`${(row + col) % 2 === 0 ? "bg-green-300" : "bg-green-500"} w-[40px] h-[40px]`}>
            {piece !== null && <img src={`/src/assets/pieces-svg/${piece}.svg`} alt="" />}
        </div>)
}