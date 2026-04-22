import { DragDropProvider } from '@dnd-kit/react';
// import { Droppable } from './Droppable';
// import { Draggable } from './Draggable';

import { useState } from "react";
import Square from "./Square";
import type { Piece } from '@/types';


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
    const [validMoves, setValidMoves] = useState<Set<string>>(new Set());

    function handleMove(from: string, to: string) {
        const [fromRow, fromCol] = from.split("-").map(Number);
        const [toRow, toCol] = to.split("-").map(Number);

        setGameState((prev) => {
            const copy = prev.map(row => [...row]);

            const piece = copy[fromRow][fromCol];
            if (!piece) return prev;

            copy[fromRow][fromCol] = null;
            copy[toRow][toCol] = piece;

            return copy;
        });
    }

    function calculateValidMoves(generalizedPiece: string, from: string, color: string) {
        let calculatedValidMoves = new Set<string>();
        switch (generalizedPiece) {
            case "pawn":
                calculatePawnMoves(from, color);
                break;
            case "knight":
                calculateKnightMoves(from, color);
                break;
            case "bishop":
                calculatedValidMoves = calculateBishopMoves(from, color);
                break;
            case "rook":
                calculatedValidMoves = calculateRookMoves(from, color);
                break;
            case "queen":
                calculatedValidMoves = calculateQueenMoves(from, color);
                break;
            case "king":
                calculateKingMoves(from, color);
                break;
        }

        setValidMoves(() => new Set(calculatedValidMoves))
    }

    function calculatePawnMoves(from: string, color: string) {
        const [fromRow, fromCol] = from.split("-").map(Number);


    }
    function calculateRookMoves(from: string, color: string) {
        const [fromRow, fromCol] = from.split("-").map(Number);

        const validRookMoves = new Set<string>();
        const oppositeColor = getOppositeColorOf(color);

        for (let i = 1; i < 8; i++) {
            if (fromRow - i < 0) break;
            if (colorOf(gameState[fromRow - i][fromCol]) === color) break;
            if (colorOf(gameState[fromRow - i][fromCol]) === oppositeColor) {
                validRookMoves.add(`${fromRow - i}-${fromCol}`);
                break;
            };

            validRookMoves.add(`${fromRow - i}-${fromCol}`);
        }

        for (let i = 1; i < 8; i++) {
            if (fromRow + i > 7) break;
            if (colorOf(gameState[fromRow + i][fromCol]) === color) break;
            if (colorOf(gameState[fromRow + i][fromCol]) === oppositeColor) {
                validRookMoves.add(`${fromRow + i}-${fromCol}`);
                break;
            };

            validRookMoves.add(`${fromRow + i}-${fromCol}`);
            console.log("french")
        }

        for (let i = 1; i < 8; i++) {
            if (fromCol - i < 0) break;
            if (colorOf(gameState[fromRow][fromCol - i]) === color) break;
            if (colorOf(gameState[fromRow][fromCol - i]) === oppositeColor) {
                validRookMoves.add(`${fromRow}-${fromCol - i}`);
                break;
            };

            validRookMoves.add(`${fromRow}-${fromCol - i}`);
        }

        for (let i = 1; i < 8; i++) {
            if (fromCol + i > 7) break;
            if (colorOf(gameState[fromRow][fromCol + i]) === color) break;
            if (colorOf(gameState[fromRow][fromCol + i]) === oppositeColor) {
                validRookMoves.add(`${fromRow}-${fromCol + i}`);
                break;
            };

            validRookMoves.add(`${fromRow}-${fromCol + i}`);
        }
        return new Set(validRookMoves);




    }

    function calculateKnightMoves(from: string, color: string) {

    }
    function calculateBishopMoves(from: string, color: string) {
        const [fromRow, fromCol] = from.split("-").map(Number);

        const validBishopMoves = new Set<string>();
        const oppositeColor = getOppositeColorOf(color);

        for (let i = 1; i < 8; i++) {
            if (fromRow - i < 0) break;
            if (fromCol - i < 0) break;
            if (colorOf(gameState[fromRow - i][fromCol - i]) === color) break;
            if (colorOf(gameState[fromRow - i][fromCol - i]) === oppositeColor) {
                validBishopMoves.add(`${fromRow - i}-${fromCol - i}`);
                break;
            };

            validBishopMoves.add(`${fromRow - i}-${fromCol - i}`);
        }

        for (let i = 1; i < 8; i++) {
            if (fromRow + i > 7) break;
            if (fromCol + i > 7) break;
            if (colorOf(gameState[fromRow + i][fromCol + i]) === color) break;
            if (colorOf(gameState[fromRow + i][fromCol + i]) === oppositeColor) {
                validBishopMoves.add(`${fromRow + i}-${fromCol + i}`);
                break;
            };

            validBishopMoves.add(`${fromRow + i}-${fromCol + i}`);
        }

        for (let i = 1; i < 8; i++) {
            if (fromRow + i > 7) break;
            if (fromCol - i < 0) break;
            if (colorOf(gameState[fromRow + i][fromCol - i]) === color) break;
            if (colorOf(gameState[fromRow + i][fromCol - i]) === oppositeColor) {
                validBishopMoves.add(`${fromRow + i}-${fromCol - i}`);
                break;
            };

            validBishopMoves.add(`${fromRow + i}-${fromCol - i}`);
        }

        for (let i = 1; i < 8; i++) {
            if (fromRow - i < 0) break;
            if (fromCol + i > 7) break;
            if (colorOf(gameState[fromRow - i][fromCol + i]) === color) break;
            if (colorOf(gameState[fromRow - i][fromCol + i]) === oppositeColor) {
                validBishopMoves.add(`${fromRow - i}-${fromCol + i}`);
                break;
            };

            validBishopMoves.add(`${fromRow - i}-${fromCol + i}`);
        }

        return new Set(validBishopMoves);




    }
    function calculateQueenMoves(from: string, color: string) {
        const validBishopMoves = calculateBishopMoves(from, color);
        const validRookMoves = calculateRookMoves(from, color);

        return new Set([...validRookMoves, ...validBishopMoves])
    }
    function calculateKingMoves(from: string, color: string) {

    }

    function colorOf(piece: string | null) {
        if (piece === null) return null;
        return piece.slice(-1);
    }

    function getOppositeColorOf(color: string) {
        switch (color) {
            case "w":
                return "b";

            case "b":
                return "w";

            default:
                return "Opposite color deos not exist";
        }
    }

    return (
        <DragDropProvider
            onDragStart={(event) => {
                const from = event.operation.source?.id;
                if (typeof from !== "string") return;

                const [fromRow, fromCol] = from.split("-").map(Number);
                const piece = gameState[fromRow][fromCol];
                if (typeof piece !== "string") return;

                const generalizedPiece = piece.slice(0, -2);
                const color = piece.slice(-1)
                calculateValidMoves(generalizedPiece, from, color)
            }}
            onDragEnd={(event) => {
                if (event.canceled) return;

                const from = event.operation.source?.id;
                const to = event.operation.target?.id;

                if (!from || !to) return;
                if (typeof from !== "string" || typeof to !== "string") return;
                handleMove(from, to);
            }}
        >
            <div>
                {
                    gameState.map((rank, rankIndex) => (
                        <div key={rankIndex} className="flex">
                            {rank.map((piece, colIndex) => {
                                const id = `${rankIndex}-${colIndex}`;

                                return (
                                    <Square
                                        key={id}
                                        id={id}
                                        shade={(rankIndex + colIndex) % 2 === 0 ? "light" : "dark"}
                                        piece={piece}
                                        highlight={validMoves.has(`${rankIndex}-${colIndex}`)}
                                    />
                                );
                            })}
                        </div>
                    ))
                }
            </div>
        </DragDropProvider>
    );
}


/////////////////////////



// export default function Board() {
//     const INITIAL_GAMESTATE: Piece[][] = [
//         ["rook-b", "knight-b", "bishop-b", "queen-b", "king-b", "bishop-b", "knight-b", "rook-b"],
//         Array.from({ length: 8 }, () => "pawn-b"),
//         Array.from({ length: 8 }, () => null),
//         Array.from({ length: 8 }, () => null),
//         Array.from({ length: 8 }, () => null),
//         Array.from({ length: 8 }, () => null),
//         Array.from({ length: 8 }, () => "pawn-w"),
//         ["rook-w", "knight-w", "bishop-w", "queen-w", "king-w", "bishop-w", "knight-w", "rook-w"]
//     ]
//     const [gameState, setGameState] = useState(INITIAL_GAMESTATE);
//     // const targets = ['A', 'B', 'C'];
//     const [target, setTarget] = useState<any>(undefined);
//     const [idOfMovingPiece, setIdOfMovingPiece] = useState<string | undefined>(undefined);
//     // const draggable = (
//     //     <Draggable id="draggable">Drag me</Draggable>
//     // );

//     return (
//         <DragDropProvider
//             onDragEnd={(event) => {
//                 if (event.canceled) return;

//                 setTarget(event.operation.target?.id);
//             }}
//         >
//             {/* {!target ? draggable : null} */}

//             {/* {targets.map((id) => (
//                 <Droppable key={id} id={id}>
//                     {target === id ? draggable : `Droppable ${id}`}
//                 </Droppable>
//             ))} */}

//             <div>
//                 {
//                     gameState.map((rank, rankIndex) => (
//                         <div key={rankIndex} className="flex">
//                             {
//                                 rank.map((square, squareIndex) =>
//                                 (<Droppable key={squareIndex} id={squareIndex.toString()}>
//                                     <Draggable id={`${rankIndex}${squareIndex}`} setIdOfMovingPiece={setIdOfMovingPiece}><Square key={squareIndex} row={rankIndex} col={squareIndex} piece={square} /></Draggable>
//                                     {target === squareIndex.toString() ? <Draggable id={`${idOfMovingPiece}`} setIdOfMovingPiece={setIdOfMovingPiece}><Square key={squareIndex} row={rankIndex} col={squareIndex} piece={square} /></Draggable>}
//                                 </Droppable>))

//                             }
//                         </div>
//                     ))
//                 }
//             </div>
//         </DragDropProvider>
//     );
// };

