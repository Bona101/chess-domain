import { DragDropProvider } from '@dnd-kit/react';
// import { Droppable } from './Droppable';
// import { Draggable } from './Draggable';

import { useState } from "react";
import Square from "./Square";
import type { InCheck, Piece, WhoseTurn } from '@/types';

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

    let inCheckNonState: InCheck = null;


    const [whiteKingPosition, setWhiteKingPosition] = useState("7-4");
    const [blackKingPosition, setBlackKingPosition] = useState("0-4");
    const [gameState, setGameState] = useState(INITIAL_GAMESTATE);
    const [validMoves, setValidMoves] = useState<Set<string>>(new Set());
    const [legalMoves, setLegalMoves] = useState<Set<string>>(new Set());
    const [whoseTurn, setWhoseTurn] = useState<WhoseTurn>("w");
    const [inCheck, setInCheck] = useState<InCheck>(null);

    function handleMove(piece: string, from: string, to: string) {
        if (piece === "king-w") {
            setWhiteKingPosition(to);
        } else if (piece === "king-b") {
            setBlackKingPosition(to);
        }

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
        return new Set(calculatedValidMoves);
    }

    function calculatePawnMoves(from: string, color: string, limit: number = 1) {

        const moveForward = color === "w" ? -1 : 1;

        function leftDiagonal() {
            if (fromRow + moveForward < 0) return;
            if (fromRow + moveForward > 7) return;
            if (fromCol - 1 < 0) return; // this line was this before => if (fromCol + moveForward < 0) return; 
            //                           i think this is a mistake but maybe i wasnt noticing it because of it has
            //                           to be an edge pawn trying to capture? or maybe because i was not checking the console for errors.
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
        console.log("why")
        for (let k = 0; k < 2; k++) {
            console.log("why not")

            for (let j = 0; j < 2; j++) {
                console.log("why not why")


                if (fromCol - (2 * l) < 0) {
                    i = -1;
                    continue;
                }
                console.log("survival");
                if (fromCol - (2 * l) > 7) {
                    i = -1;
                    continue;
                }
                console.log("survival");
                if (fromRow - i < 0) {
                    i = -1;
                    continue;
                }
                console.log("survival");
                if (fromRow - i > 7) {
                    i = -1;
                    continue;
                }

                console.log("survival");


                if (colorOf(gameState[fromRow - i][fromCol - (2 * l)]) === color) {
                    console.log("theres no way")
                    i = -1;
                    continue;
                };
                console.log("theres way")

                validKnightMoves.add(`${fromRow - i}-${fromCol - (2 * l)}`);
                i = -1;
            }
            i = 1;
            l = -1;
        }

        l = 1;

        for (let k = 0; k < 2; k++) {
            for (let j = 0; j < 2; j++) {

                if (fromRow - (2 * l) < 0) {
                    i = -1;
                    continue;
                }
                if (fromRow - (2 * l) > 7) {
                    i = -1;
                    continue;
                }
                if (fromCol - i < 0) {
                    i = -1;
                    continue;
                }
                if (fromCol - i > 7) {
                    i = -1;
                    continue;
                }


                if (colorOf(gameState[fromRow - (2 * l)][fromCol - i]) === color) {
                    console.log("beautiful")
                    i = -1;
                    continue;
                };
                console.log("boy")

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
        setLegalMoves(() => new Set())
    }

    function convertToChessNotation(piece: string, from: string, to: string) {
        const [_, fromCol] = from.split("-").map(Number);
        const [toRow, toCol] = to.split("-").map(Number);
        const opponentPieceOnLandingSquare = gameState[toRow][toCol];

        const files: Record<number, string> = {
            0: "a",
            1: "b",
            2: "c",
            3: "d",
            4: "e",
            5: "f",
            6: "g",
            7: "h",
        }

        const pieceSectionOfMoveNotation =
            piece === "pawn" ? "" :
                piece === "knight" ? "N" : piece.slice(0, 1).toUpperCase();

        // const [toRow, toCol] = to.split("-").map(Number);

        const captures = opponentPieceOnLandingSquare ? piece === "pawn" ? `${files[fromCol]}x` : "x" : "";

        const possibleCheck = inCheckNonState ? "+" : ""; // should i make this to chek if inCHeckNonSTate is actually w or b.

        const move = `${pieceSectionOfMoveNotation}${captures}${files[toCol]}${8 - toRow}${possibleCheck}`;

        return move;
    }
    function registerMove(piece: string, from: string, to: string) {
        const move = convertToChessNotation(piece, from, to)
        setMovesPlayed((prev) => {
            let curr = [...prev];

            if (curr.length === 0) {
                return [[move]]
            }

            if (curr[curr.length - 1].length < 2) {
                curr[curr.length - 1] = [...curr[curr.length - 1], move]
            }
            else {
                curr.push([move]);
            }

            return curr;
        })
    }

    function getFirstLetterOf(piece: string) {
        return piece.slice(0, 1);
    }

    function calculateLegalMoves(piece: Piece, calculatedValidMoves: Set<string>, from: string) {
        const clonedGameState = gameState.map((prev) => [...prev]);
        const [fromRow, fromCol] = from.split("-").map(Number);
        const calculatedLegalMoves = new Set<string>();

        console.log("calculatedValidMoves")
        console.log(calculatedValidMoves)
        for (const move of calculatedValidMoves) {
            let clonedGameStateSingleBranch = clonedGameState.map((prev) => [...prev]); // cloning the cloned game state so that when i edit the 
            //                                                  clonedGameStateSingleBrancharray i will not edit the main clonedGameState array so that it does not
            //                                                  carry over the edited thing into the next branch which will be in the next iteration of this for loop
            const [moveRow, moveCol] = move.split("-").map(Number);
            clonedGameStateSingleBranch[moveRow][moveCol] = piece;
            clonedGameStateSingleBranch[fromRow][fromCol] = null;
            let colorOfPiece = colorOf(piece);
            if (!colorOfPiece) continue;
            if (!piece) continue;
            console.log(clonedGameStateSingleBranch)
            let kingInCheck = checkIfKingIsInCheck(clonedGameStateSingleBranch, colorOfPiece, piece, move);
            if (kingInCheck !== undefined) {

                if (!kingInCheck[0]) calculatedLegalMoves.add(move);
            } else {
                calculatedLegalMoves.add(move);
            }
            console.log("apples");
            console.log(kingInCheck);
        }

        console.log(calculatedLegalMoves);
        setLegalMoves(() => new Set(calculatedLegalMoves));

    }

    function checkIfKingIsInCheck(clonedGameState: Piece[][], color: string, pieceInMotion: string, branchStartingSquare: string) {
        let realOrFakeKingPosition = color === "w" ? whiteKingPosition : blackKingPosition;

        if (colorOf(pieceInMotion) !== color) return;
        if (pieceInMotion.slice(0, -2) === "king") {
            realOrFakeKingPosition = branchStartingSquare;
        }
        const [row, col] = realOrFakeKingPosition.split("-").map(Number);

        const oppositeColor = getOppositeColorOf(color);

        // check for rook checks
        for (let i = 1; i < 8; i++) {
            // if (i > limit) break;
            if (row - i < 0) break;
            if (colorOf(clonedGameState[row - i][col]) === color) break;
            if (colorOf(clonedGameState[row - i][col]) === oppositeColor) {
                if (i === 1 && clonedGameState[row - i][col]?.slice(0, -2) === "king") {
                    return [true, "king", clonedGameState[row - i][col], [[row - i], [col]]];
                }
                if (clonedGameState[row - i][col]?.slice(0, -2) === "queen" || clonedGameState[row - i][col]?.slice(0, -2) === "rook") {
                    return [true, "queen or rook", clonedGameState[row - i][col], [[row - i], [col]]];;
                }
                else {
                    break;
                }
                // validRookMoves.add(`${fromRow - i}-${fromCol}`);
            };

            // validRookMoves.add(`${fromRow - i}-${fromCol}`);
        }


        for (let i = 1; i < 8; i++) {
            // if (i > limit) break;
            if (row + i > 7) break;
            if (colorOf(clonedGameState[row + i][col]) === color) break;
            if (colorOf(clonedGameState[row + i][col]) === oppositeColor) {
                if (i === 1 && clonedGameState[row + i][col]?.slice(0, -2) === "king") {
                    return [true, "king", clonedGameState[row + i][col], [[row + i], [col]]];
                }
                if (clonedGameState[row + i][col]?.slice(0, -2) === "queen" || clonedGameState[row + i][col]?.slice(0, -2) === "rook") {
                    return [true, "queen or rook", clonedGameState[row + i][col], [[row + i], [col]]];;
                }
                else {
                    break;
                }
                // validRookMoves.add(`${fromRow + i}-${fromCol}`);

            };

            // validRookMoves.add(`${fromRow + i}-${fromCol}`);
        }


        for (let i = 1; i < 8; i++) {
            // if (i > limit) break;
            if (col - i < 0) break;
            if (colorOf(clonedGameState[row][col - i]) === color) break;
            if (colorOf(clonedGameState[row][col - i]) === oppositeColor) {
                if (i === 1 && clonedGameState[row][col - i]?.slice(0, -2) === "king") {
                    return [true, "king", clonedGameState[row][col - i], [[row], [col - i]]];;
                }
                if (clonedGameState[row][col - i]?.slice(0, -2) === "queen" || clonedGameState[row][col - i]?.slice(0, -2) === "rook") {
                    return [true, "queen or rook", clonedGameState[row][col - i], [[row], [col - i]]];;
                }
                else {
                    break;
                }
                // validRookMoves.add(`${fromRow}-${fromCol - i}`);

            };

            // validRookMoves.add(`${fromRow}-${fromCol - i}`);
        }



        for (let i = 1; i < 8; i++) {
            // if (i > limit) break;
            if (col + i > 7) break;
            if (colorOf(clonedGameState[row][col + i]) === color) break;
            if (colorOf(clonedGameState[row][col + i]) === oppositeColor) {
                if (i === 1 && clonedGameState[row][col + i]?.slice(0, -2) === "king") {
                    return [true, "king", clonedGameState[row][col + i], [[row], [col + i]]];;
                }
                if (clonedGameState[row][col + i]?.slice(0, -2) === "queen" || clonedGameState[row][col + i]?.slice(0, -2) === "rook") {
                    return [true, "queen or rook", clonedGameState[row][col + i], [[row], [col + i]]];;
                }
                else {
                    break;
                }
                // validRookMoves.add(`${fromRow}-${fromCol + i}`);
            };

            // validRookMoves.add(`${fromRow}-${fromCol + i}`);
        }



        // check for bishop checks
        for (let i = 1; i < 8; i++) {
            // if (i > limit) break;
            if (row - i < 0) break;
            if (col - i < 0) break;
            if (colorOf(clonedGameState[row - i][col - i]) === color) break;
            if (colorOf(clonedGameState[row - i][col - i]) === oppositeColor) {
                if (i === 1 && clonedGameState[row - i][col - i]?.slice(0, -2) === "king") {
                    return [true, "king", clonedGameState[row - i][col - i], [[row - i], [col - i]]];
                }
                if (clonedGameState[row - i][col - i]?.slice(0, -2) === "queen" || clonedGameState[row - i][col - i]?.slice(0, -2) === "bishop") {
                    return [true, "queen or bishop", clonedGameState[row - i][col - i], [[row - i], [col - i]]];
                }
                else {
                    break;
                }
                // validBishopMoves.add(`${fromRow - i}-${fromCol - i}`);
            };

            // validBishopMoves.add(`${fromRow - i}-${fromCol - i}`);
        }

        for (let i = 1; i < 8; i++) {
            // if (i > limit) break;
            if (row + i > 7) break;
            if (col + i > 7) break;
            if (colorOf(clonedGameState[row + i][col + i]) === color) break;
            if (colorOf(clonedGameState[row + i][col + i]) === oppositeColor) {
                if (i === 1 && clonedGameState[row + i][col + i]?.slice(0, -2) === "king") {
                    return [true, "king", clonedGameState[row + i][col + i], [[row + i], [col + i]]];
                }
                if (clonedGameState[row + i][col + i]?.slice(0, -2) === "queen" || clonedGameState[row + i][col + i]?.slice(0, -2) === "bishop") {
                    return [true, "queen or bishop", clonedGameState[row + i][col + i], [[row + i], [col + i]]];
                }
                else {
                    break;
                }
                // validBishopMoves.add(`${fromRow + i}-${fromCol + i}`);
            };

            // validBishopMoves.add(`${fromRow + i}-${fromCol + i}`);
        }

        for (let i = 1; i < 8; i++) {
            // if (i > limit) break;
            if (row + i > 7) break;
            if (col - i < 0) break;
            if (colorOf(clonedGameState[row + i][col - i]) === color) break;
            if (colorOf(clonedGameState[row + i][col - i]) === oppositeColor) {
                if (i === 1 && clonedGameState[row + i][col - i]?.slice(0, -2) === "king") {
                    return [true, "king", clonedGameState[row + i][col - i], [[row + i], [col - i]]];
                }
                if (clonedGameState[row + i][col - i]?.slice(0, -2) === "queen" || clonedGameState[row + i][col - i]?.slice(0, -2) === "bishop") {
                    return [true, "queen or bishop", clonedGameState[row + i][col - i], [[row + i], [col - i]]];
                }
                else {
                    break;
                }
                // validBishopMoves.add(`${fromRow + i}-${col - i}`);
            };

            // validBishopMoves.add(`${fromRow + i}-${col - i}`);
        }

        for (let i = 1; i < 8; i++) {
            // if (i > limit) break;
            if (row - i < 0) break;
            if (col + i > 7) break;
            if (colorOf(clonedGameState[row - i][col + i]) === color) break;
            if (colorOf(clonedGameState[row - i][col + i]) === oppositeColor) {
                if (i === 1 && clonedGameState[row - i][col + i]?.slice(0, -2) === "king") {
                    return [true, "king", clonedGameState[row - i][col + i], [[row - i], [col + i]]];
                }
                if (clonedGameState[row - i][col + i]?.slice(0, -2) === "queen" || clonedGameState[row - i][col + i]?.slice(0, -2) === "bishop") {
                    return [true, "queen or bishop", clonedGameState[row - i][col + i], [[row - i], [col + i]]];
                }
                else {
                    break;
                }
                // validBishopMoves.add(`${fromRow - i}-${fromCol + i}`);
            };

            // validBishopMoves.add(`${fromRow - i}-${fromCol + i}`);
        }


        // check for knight checks
        let i = 1;
        let l = 1;

        for (let k = 0; k < 2; k++) {
            for (let j = 0; j < 2; j++) {

                if (col - (2 * l) < 0) break;
                if (col - (2 * l) > 7) break;
                if (row - i < 0) break;
                if (row - i > 7) break;


                if (colorOf(clonedGameState[row - i][col - (2 * l)]) === oppositeColor) {
                    if (clonedGameState[row - i][col - (2 * l)]?.slice(0, -2) === "knight") {
                        return [true, "knight", clonedGameState[row - i][col - (2 * l)], [[row - i], [col - (2 * l)]]];
                        // break;
                    }
                    i = -1;
                    continue;
                };

                // validKnightMoves.add(`${fromRow - i}-${fromCol - (2 * l)}`);
                i = -1;
            }
            i = 1;
            l = -1;
        }

        l = 1;

        for (let k = 0; k < 2; k++) {
            for (let j = 0; j < 2; j++) {

                if (row - (2 * l) < 0) break;
                if (row - (2 * l) > 7) break;
                if (col - i < 0) break;
                if (col - i > 7) break;


                if (colorOf(clonedGameState[row - (2 * l)][col - i]) === oppositeColor) {
                    if (clonedGameState[row - (2 * l)][col - i]?.slice(0, -2) === "knight") {
                        return [true, "knight", clonedGameState[row - (2 * l)][col - i], [[row - (2 * l)], [col - i]]];
                        // break;
                    }
                    i = -1;
                    continue;
                };

                // validKnightMoves.add(`${fromRow - (2 * l)}-${fromCol - i}`);
                i = -1;
            }
            i = 1;
            l = -1;
        }

        // check for pawn checks
        const moveForward = color === "w" ? -1 : 1; // swapped the 1 and -1 because you are checking for the
        //                                              opposite color pawn checks // later edit: actually this gave me an error so swapping again

        {
            if (row + moveForward < 0) return;
            if (row + moveForward > 7) return;
            if (col - 1 < 0) return;
            // if (colorOf(gameState[row + moveForward][col - 1]) === color) return;
            if (colorOf(clonedGameState[row + moveForward][col - 1]) === oppositeColor) {
                if (clonedGameState[row + moveForward][col - 1]?.slice(0, -2) === "pawn") {
                    return [true, "pawn", clonedGameState[row + moveForward][col - 1], [[row + moveForward], [col - 1]]];
                    // break;
                }
                // validPawnMoves.add(`${fromRow + moveForward}-${fromCol - 1}`);
            };

        }

        {
            if (row + moveForward < 0) return;
            if (row + moveForward > 7) return;
            if (col + 1 > 7) return;
            // if (colorOf(gameState[row + moveForward][col + 1]) === color) return;
            if (colorOf(clonedGameState[row + moveForward][col + 1]) === oppositeColor) {
                if (clonedGameState[row + moveForward][col + 1]?.slice(0, -2) === "pawn") {
                    return [true, "pawn", clonedGameState[row + moveForward][col + 1], [[row + moveForward], [col + 1]]];
                    // break;
                }
                // validPawnMoves.add(`${fromRow + moveForward}-${fromCol + 1}`);
            };
        }

        // leftDiagonal();
        // rightDiagonal();





        return [false, "", "", [[99], [99]]];
    }

    function checkIfOpponentIsInCheck(from: string, to: string, opponentColor: string) {
        setInCheck(null);
        inCheckNonState = null;
        
        const [fromRow, fromCol] = from.split("-").map(Number);
        const [toRow, toCol] = to.split("-").map(Number);

        const copy = gameState.map(row => [...row]);

        const piece = copy[fromRow][fromCol];
        if (!piece) return; // for the setgame state should this line not be return prev?

        copy[fromRow][fromCol] = null;
        copy[toRow][toCol] = piece;

        // return copy;
        console.log("copy")
        console.log(copy)

        const kingPosition = opponentColor === "w" ? whiteKingPosition : blackKingPosition;

        const opponentKing = "king-" + opponentColor;

        let kingInCheck = checkIfKingIsInCheck(copy, opponentColor, opponentKing, kingPosition);
console.log(kingInCheck)
        if (kingInCheck && kingInCheck[0]) {
            switch (opponentColor) {
                case "w":
                    setInCheck("w")
                    inCheckNonState = "w";
                    console.log("w in check")
                    break;

                case "b":
                    setInCheck("b")
                    inCheckNonState = "b"
                    console.log("b in check")
                    break;
            
                default:
                    setInCheck(null);
                    inCheckNonState = null;
                    console.log("null in check")
                    break;
            }
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
                const calculatedValidMoves = calculateValidMoves(generalizedPiece, from, color);
                calculateLegalMoves(piece, calculatedValidMoves, from)
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
                if (!legalMoves.has(to)) return;

                handleMove(piece, from, to);
                switchTurns();
                
                const opponentColor = getOppositeColorOf(piece.slice(-1));
                checkIfOpponentIsInCheck(from, to, opponentColor);
                registerMove(piece.slice(0, -2), from, to);
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
                                        highlight={legalMoves.has(`${rankIndex}-${colIndex}`)}
                                        whoseTurn={whoseTurn}
                                        handleClick={handleClick}
                                        inCheck={inCheck}

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