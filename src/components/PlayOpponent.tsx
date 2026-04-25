import { useState } from "react";
import Board from "./Board";

export default function PlayOpponent({
    opponent
}: {
    opponent: string;
}) {
    const [movesPlayed, setMovesPlayed] = useState<string[][]>([]);


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

                        <Board setMovesPlayed={setMovesPlayed} />

                        <div className="flex items-center gap-3 w-[60%] my-3">
                            <div className="bg-gray-500 rounded-full w-7 h-7">

                            </div>
                            <div>
                                <p>Me</p>
                                <p>Q, Bd, N</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-1/4 flex justify-center items-center">
                    <div className="p-3 bg-black">
                        {movesPlayed.map((move, index) => (
                            <div className="flex gap-1">
                                <p className="text-white">
                                    {index + 1}.
                                </p>
                            <div className="flex gap-1">
                                <p className="bg-green-300 text-white mb-1 w-[7rem]">
                                    {move[0]}
                                </p>
                                {
                                    move.length >= 2 &&
                                    <p className="bg-green-300 text-white mb-1 w-[7rem]">
                                        {move[1]}
                                    </p>
                                }
                            </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
