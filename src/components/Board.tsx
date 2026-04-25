import { DragDropProvider } from '@dnd-kit/react';
// import { Droppable } from './Droppable';
// import { Draggable } from './Draggable';

import { useState } from "react";
import Square from "./Square";
import type { Piece, WhoseTurn } from '@/types';

interface BoardProps {
    setMovesPlayed: React.Dispatch<React.SetStateAction<string[][]>>;
}

export default function Board({ setMovesPlayed }: BoardProps) {
    const INITIAL_GAMESTATE: Piece[][] = [
        ["rook-b", "knight-b", "bishop-b", "queen-b", "king-b", "bishop-b", "knight-b", "rook-b"],
        Array.from({ length: 8 }, () => "pawn-b"),
        Array.from({ length: 8 }, () => null),
        Array.from({ length: 8 }, () => null),
        Array.from({ length: 8 }, () => null),
        Array.from({ length: 8 }, () => null),
        Array.from({ length: 8 }, () => "pawn-w"),
        ["rook-w", "knight-w", "bishop-w", "queen-w", "king-w", "bishop-w", "knight-w", "rook-w"]
    ];

    const [gameState, setGameState] = useState(INITIAL_GAMESTATE);
    const [validMoves, setValidMoves] = useState<Set<string>>(new Set());
    const [whoseTurn, setWhoseTurn] = useState<WhoseTurn>("w");

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
                calculatedValidMoves = calculatePawnMoves(from, color);
                break;
            case "knight":
                calculatedValidMoves = calculateKnightMoves(from, color);
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
                calculatedValidMoves = calculateKingMoves(from, color);
                break;
        }

        setValidMoves(() => new Set(calculatedValidMoves))
    }

    function calculatePawnMoves(from: string, color: string, limit: number = 1) {

        const moveForward = color === "w" ? -1 : 1;

        function leftDiagonal() {
            if (fromRow + moveForward < 0) return;
            if (fromRow + moveForward > 7) return;
            if (fromCol + moveForward < 0) return;
            if (colorOf(gameState[fromRow + moveForward][fromCol - 1]) === color) return;
            if (colorOf(gameState[fromRow + moveForward][fromCol - 1]) === oppositeColor) {
                validPawnMoves.add(`${fromRow + moveForward}-${fromCol - 1}`);
            };

        }

        function rightDiagonal() {
            if (fromRow + moveForward < 0) return;
            if (fromRow + moveForward > 7) return;
            if (fromCol + 1 > 7) return;
            if (colorOf(gameState[fromRow + moveForward][fromCol + 1]) === color) return;
            if (colorOf(gameState[fromRow + moveForward][fromCol + 1]) === oppositeColor) {
                validPawnMoves.add(`${fromRow + moveForward}-${fromCol + 1}`);
            };
        }

        const [fromRow, fromCol] = from.split("-").map(Number);

        const validPawnMoves = new Set<string>();
        const oppositeColor = getOppositeColorOf(color);

        for (let i = 1; i < 8; i++) {
            if (i > limit) break;
            if (fromRow + moveForward < 0) break;
            if (fromRow + moveForward > 7) break;

            if (colorOf(gameState[fromRow + moveForward][fromCol]) === color) break;
            if (colorOf(gameState[fromRow + moveForward][fromCol]) === oppositeColor) break;

            validPawnMoves.add(`${fromRow + moveForward}-${fromCol}`);
        }

        leftDiagonal();
        rightDiagonal();

        return new Set(validPawnMoves);

    }
    function calculateRookMoves(from: string, color: string, limit: number = Infinity) {
        const [fromRow, fromCol] = from.split("-").map(Number);

        const validRookMoves = new Set<string>();
        const oppositeColor = getOppositeColorOf(color);

        for (let i = 1; i < 8; i++) {
            if (i > limit) break;
            if (fromRow - i < 0) break;
            if (colorOf(gameState[fromRow - i][fromCol]) === color) break;
            if (colorOf(gameState[fromRow - i][fromCol]) === oppositeColor) {
                validRookMoves.add(`${fromRow - i}-${fromCol}`);
                break;
            };

            validRookMoves.add(`${fromRow - i}-${fromCol}`);
        }

        for (let i = 1; i < 8; i++) {
            if (i > limit) break;
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
            if (i > limit) break;
            if (fromCol - i < 0) break;
            if (colorOf(gameState[fromRow][fromCol - i]) === color) break;
            if (colorOf(gameState[fromRow][fromCol - i]) === oppositeColor) {
                validRookMoves.add(`${fromRow}-${fromCol - i}`);
                break;
            };

            validRookMoves.add(`${fromRow}-${fromCol - i}`);
        }

        for (let i = 1; i < 8; i++) {
            if (i > limit) break;
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
        const [fromRow, fromCol] = from.split("-").map(Number);

        const validKnightMoves = new Set<string>();
        // no point of getting opposite color for knight.
        // the whole point of getting opposite Color in the first place is to make the place where that piece is staying a
        // valid move but after that piece the remaining sqaures cant be valid moves. this differs from what happens when the piece is the same color and when the piece is null 
        //(at least when the piece is null you the remaining squares might or might not be validmoves as opposed to when it is opposite color you know for sure that they cannot be valid moves).

        // but in the case of a knight whether the square has a piece of opposite color or same color or null. We still do one thing which is not check the remaining squares 
        // (in fact in the case of knight there is nothing like 'remaining squares'. we just check the 'L' and that is it. then we move on to checking another 'L').

        let i = 1;
        let l = 1;

        for (let k = 0; k < 2; k++) {
            for (let j = 0; j < 2; j++) {

                if (fromCol - (2 * l) < 0) break;
                if (fromCol - (2 * l) > 7) break;
                if (fromRow - i < 0) break;
                if (fromRow - i > 7) break;


                if (colorOf(gameState[fromRow - i][fromCol - (2 * l)]) === color) {
                    i = -1;
                    continue;
                };

                validKnightMoves.add(`${fromRow - i}-${fromCol - (2 * l)}`);
                i = -1;
            }
            i = 1;
            l = -1;
        }

        l = 1;

        for (let k = 0; k < 2; k++) {
            for (let j = 0; j < 2; j++) {

                if (fromRow - (2 * l) < 0) break;
                if (fromRow - (2 * l) > 7) break;
                if (fromCol - i < 0) break;
                if (fromCol - i > 7) break;


                if (colorOf(gameState[fromRow - (2 * l)][fromCol - i]) === color) {
                    i = -1;
                    continue;
                };

                validKnightMoves.add(`${fromRow - (2 * l)}-${fromCol - i}`);
                i = -1;
            }
            i = 1;
            l = -1;
        }


        return new Set(validKnightMoves);



    }
    function calculateBishopMoves(from: string, color: string, limit: number = Infinity) {
        const [fromRow, fromCol] = from.split("-").map(Number);

        const validBishopMoves = new Set<string>();
        const oppositeColor = getOppositeColorOf(color);

        for (let i = 1; i < 8; i++) {
            if (i > limit) break;
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
            if (i > limit) break;
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
            if (i > limit) break;
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
            if (i > limit) break;
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
    function calculateQueenMoves(from: string, color: string, limit: number = Infinity) {
        const validBishopMoves = calculateBishopMoves(from, color, limit);
        const validRookMoves = calculateRookMoves(from, color, limit);

        return new Set([...validRookMoves, ...validBishopMoves])
    }
    function calculateKingMoves(from: string, color: string) {
        const limit = 1;
        const validKingMoves = calculateQueenMoves(from, color, limit);


        return new Set(validKingMoves);
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
                return "Opposite color does not exist";
        }
    }

    function handleClick(id: string, piece: Piece) {

    }

    function switchTurns() {
        setWhoseTurn((prev) => {
            return prev === "w" ? "b" : "w";
        });
    }

    function cancelHighlights() {
        setValidMoves(() => new Set())
    }

    function registerMove(pieceFirstLetter: string, from: string, to: string) {
        setMovesPlayed((prev) => {
            let curr = [...prev];

            if (curr.length === 0){
                return [[`${pieceFirstLetter}-${from}-${to}`]]
            }

            if (curr[curr.length - 1].length < 2) {
                curr[curr.length - 1] = [...curr[curr.length - 1], `${pieceFirstLetter}-${from}-${to}`]
            }
            else {
                curr.push([`${pieceFirstLetter}-${from}-${to}`]);
            }

            return curr;
        })
    }

    function getFirstLetterOf(piece: string) {
        return piece.slice(0, 1);
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

                const [fromRow, fromCol] = from.split("-").map(Number);
                const piece = gameState[fromRow][fromCol];
                if (!piece) return;

                cancelHighlights();
                if (!validMoves.has(to)) return;

                handleMove(from, to);
                registerMove(getFirstLetterOf(piece), from, to);
                switchTurns();
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
                                        whoseTurn={whoseTurn}
                                        handleClick={handleClick}
                                        validMoves={validMoves}
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