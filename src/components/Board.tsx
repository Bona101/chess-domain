import { useState } from "react";
import Square from "./Square";
import type { Piece } from '@/types';


// export default function Board() {

//     return (
//         <div>
//             {
//                 gameState.map((rank, rankIndex) => (
//                     <div key={rankIndex} className="flex">
//                         {
//                             rank.map((square, squareIndex) => <Square key={squareIndex} row={rankIndex} col={squareIndex} piece={square} />)
//                         }
//                     </div>
//                 ))
//             }
//         </div>
//     );
// }


/////////////////////////


import { DragDropProvider } from '@dnd-kit/react';

import { Droppable } from './Droppable';
import { Draggable } from './Draggable';

export default function Board() {
    const INITIAL_GAMESTATE: Piece[][] = [
        ["rook-b", "knight-b", "bishop-b", "queen-b", "king-b", "bishop-b", "knight-b", "rook-b"],
        Array.from({ length: 8 }, () => "pawn-b"),
        Array.from({ length: 8 }, () => null),
        Array.from({ length: 8 }, () => null),
        Array.from({ length: 8 }, () => null),
        Array.from({ length: 8 }, () => null),
        Array.from({ length: 8 }, () => "pawn-w"),
        ["rook-w", "knight-w", "bishop-w", "queen-w", "king-w", "bishop-w", "knight-w", "rook-w"]
    ]
    const [gameState, setGameState] = useState(INITIAL_GAMESTATE);
    // const targets = ['A', 'B', 'C'];
    const [target, setTarget] = useState<any>(undefined);
    // const draggable = (
    //     <Draggable id="draggable">Drag me</Draggable>
    // );

    return (
        <DragDropProvider
            onDragEnd={(event) => {
                if (event.canceled) return;

                setTarget(event.operation.target?.id);
            }}
        >
            {/* {!target ? draggable : null} */}

            {/* {targets.map((id) => (
                <Droppable key={id} id={id}>
                    {target === id ? draggable : `Droppable ${id}`}
                </Droppable>
            ))} */}

            <div>
                {
                    gameState.map((rank, rankIndex) => (
                        <div key={rankIndex} className="flex">
                            {
                                rank.map((square, squareIndex) =>
                                (<Droppable key={squareIndex} id={squareIndex.toString()}>
                                    <Draggable id={`${rankIndex}${squareIndex}`}><Square key={squareIndex} row={rankIndex} col={squareIndex} piece={square} /></Draggable>
                                    {/* target === id  */}
                                </Droppable>))

                            }
                        </div>
                    ))
                }
            </div>
        </DragDropProvider>
    );
};

