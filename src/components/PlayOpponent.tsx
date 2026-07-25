import { useRef, useState } from "react";
import Board, { type BoardHandle } from "./Board";

export default function PlayOpponent({
    opponent,
}: {
    opponent: string;
}) {
    const [movesPlayed, setMovesPlayed] = useState<string[][]>([]);
    const boardRef = useRef<BoardHandle>(null);


    function goToChessPosition(moveRowIndex: number, moveSubIndex: number) {
        boardRef.current?.goToMove(moveRowIndex, moveSubIndex);
    }


    return (
        <div className="bg-[#51E7EB] flex-1">
            <div className="flex">
                <div className="w-1/4">

                </div>

                <div className="w-1/2 mt-3">
                    <div className="w-full flex flex-col justify-center items-center">
                        <div className="flex items-center gap-3 w-[60%] my-3">
                            <div className="bg-gray-500 rounded-full w-7 h-7">

                            </div>
                            <div>
                                <p>{opponent}</p>
                                <p>Q, Bd, N</p>
                            </div>
                        </div>

                        <Board ref={boardRef} setMovesPlayed={setMovesPlayed} />

                        <div className="flex items-center gap-3 w-[60%] my-3">
                            <div className="bg-gray-500 rounded-full w-7 h-7">

                            </div>
                            <div>
                                <p>Me</p>
                                <p>Q, Bd, N</p>
                            </div>
                        </div>

                        <div className="flex gap-5">

                            
                        </div>
                    </div>
                </div>

                <div className="w-1/4 flex justify-center items-center">
                    <div className="p-3 bg-black">
                        {movesPlayed.map((move, index) => (
                            <div className="flex gap-1" key={index}>
                                <p className="text-white">
                                    {index + 1}.
                                </p>
                                <div className="flex gap-1">
                                    <p className="bg-green-300 text-white mb-1 w-[7rem] cursor-pointer" onClick={() => goToChessPosition(index, 0)}>
                                        {move[0]}
                                    </p>
                                    {
                                        move.length >= 2 &&
                                        <p className="bg-green-300 text-white mb-1 w-[7rem] cursor-pointer" onClick={() => goToChessPosition(index, 1)}>
                                            {move[1]}
                                        </p>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    );
}
