import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { DragDropProvider } from '@dnd-kit/react';
import { type Mode } from "@/types";
// import { Droppable } from './Droppable';
// import { Draggable } from './Draggable';

import Square from "./Square";
import type { InCheck, Piece, WhoseTurn } from '@/types';

interface BoardProps {
    setMovesPlayed: React.Dispatch<React.SetStateAction<string[][]>>;
    mode: Mode;
}

export interface BoardHandle {
    goToMove: (moveRowIndex: number, moveSubIndex: number) => void;
}

// export default function Board({ setMovesPlayed }: BoardProps) {
const Board = forwardRef<BoardHandle, BoardProps>(({ setMovesPlayed, mode }, ref) => {
    let posEvaluations: Record<string, number> = {};
    let calcGameState: Piece[][] = [];

    const [indexOfCurrentGameState, setIndexOfCurrentGameState] = useState(0);

    const [myColor, setMyColor] = useState<string>(Math.random() < 0.5 ? "w" : "b");
    const [computerTurn, setComputerTurn] = useState<boolean>(false);


    // const [calcGameState, setCalcGameState] = useState<Piece[][]>([]);
    const [allCalcGameStates, setAllCalcGameStates] = useState<Piece[][][]>([]);
    const [allGameStates, setAllGameStates] = useState<Piece[][][]>(myColor === "w" ? [
        [
            ["rook-b", "knight-b", "bishop-b", "queen-b", "king-b", "bishop-b", "knight-b", "rook-b"],
            Array.from({ length: 8 }, () => "pawn-b"),
            Array.from({ length: 8 }, () => null),
            Array.from({ length: 8 }, () => null),
            Array.from({ length: 8 }, () => null),
            Array.from({ length: 8 }, () => null),
            Array.from({ length: 8 }, () => "pawn-w"),
            ["rook-w", "knight-w", "bishop-w", "queen-w", "king-w", "bishop-w", "knight-w", "rook-w"]
        ]
    ]
        :
        [
            [
                ["rook-w", "knight-w", "bishop-w", "king-w", "queen-w", "bishop-w", "knight-w", "rook-w"],
                Array.from({ length: 8 }, () => "pawn-w"),
                Array.from({ length: 8 }, () => null),
                Array.from({ length: 8 }, () => null),
                Array.from({ length: 8 }, () => null),
                Array.from({ length: 8 }, () => null),
                Array.from({ length: 8 }, () => "pawn-b"),
                ["rook-b", "knight-b", "bishop-b", "king-b", "queen-b", "bishop-b", "knight-b", "rook-b"]
            ]
        ]);

    let inCheckNonState: InCheck = null;


    const [whiteKingPosition, setWhiteKingPosition] = useState("7-4");
    const [blackKingPosition, setBlackKingPosition] = useState("0-4");
    const [gameState, setGameState] = useState(allGameStates[0]);
    // const [validMoves, setValidMoves] = useState<Set<string>>(new Set());
    const [legalMoves, setLegalMoves] = useState<Set<string>>(new Set());
    const [whoseTurn, setWhoseTurn] = useState<WhoseTurn>("w");
    const [inCheck, setInCheck] = useState<InCheck>(null);
    const [promoting, setPromoting] = useState<boolean>(false);
    const [promotionSquare, setPromotionSquare] = useState<string | null>("");
    const [promotingFrom, setPromotingFrom] = useState<string>("");

    function handleMove(piece: string, from: string, to: string) {
        if (piece === "king-w") {
            setWhiteKingPosition(to);
        } else if (piece === "king-b") {
            setBlackKingPosition(to);
        }

        const [fromRow, fromCol] = from.split("-").map(Number);
        const [toRow, toCol] = to.split("-").map(Number);

        // let newGameState: Piece[][] = [];

        // indexOfCurrentGameState = allGameStates.length + 1;
        setIndexOfCurrentGameState(() => allGameStates.length);

        const newGameState = gameState.map(row => [...row]);

        const piec = newGameState[fromRow][fromCol];


        newGameState[fromRow][fromCol] = null;
        newGameState[toRow][toCol] = piec;

        // newGameState = copy.map(row => [...row]);

        setGameState((prev) => {
            // const copy = prev.map(row => [...row]);

            // const piece = copy[fromRow][fromCol];
            // if (!piece) return prev;

            // copy[fromRow][fromCol] = null;
            // copy[toRow][toCol] = piece;

            // newGameState = copy.map(row => [...row]);
            // 
            // GAMESTATES.push(copy);


            if (!piec) return prev;
            return newGameState.map(row => [...row]);
        });

        setAllGameStates((prev) => {
            const copy = prev.map(gameState => gameState.map(row => [...row]));
            return [...copy, newGameState.map(i => [...i])]
        })

    }

    function handleCalcMove(piece: string, from: string, to: string) {
        let calcWhiteKingPosition = null;
        let calcBlackKingPosition = null;
        if (piece === "king-w") {
            setWhiteKingPosition(to);
            calcWhiteKingPosition = to;
        } else if (piece === "king-b") {
            // setBlackKingPosition(to);
            calcBlackKingPosition = to;
        }

        const [fromRow, fromCol] = from.split("-").map(Number);
        const [toRow, toCol] = to.split("-").map(Number);

        // let newGameState: Piece[][] = [];

        // indexOfCurrentGameState = allGameStates.length + 1;
        // setIndexOfCurrentGameState(() => allGameStates.length);

        const newGameState = gameState.map(row => [...row]);

        const piec = newGameState[fromRow][fromCol];


        newGameState[fromRow][fromCol] = null;
        newGameState[toRow][toCol] = piec;

        // newGameState = copy.map(row => [...row]);

        // setCalcGameState((prev) => {
        //     // const copy = prev.map(row => [...row]);

        //     // const piece = copy[fromRow][fromCol];
        //     // if (!piece) return prev;

        //     // copy[fromRow][fromCol] = null;
        //     // copy[toRow][toCol] = piece;

        //     // newGameState = copy.map(row => [...row]);
        //     // 
        //     // GAMESTATES.push(copy);


        //     if (!piec) return prev;
        //     return newGameState.map(row => [...row]);
        // });

        calcGameState = newGameState.map(row => [...row]);

        setAllCalcGameStates((prev) => {
            const copy = prev.map(gameState => gameState.map(row => [...row]));
            return [...copy, newGameState.map(i => [...i])]
        })



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
        setLegalMoves(() => new Set())
    }

    function convertToChessNotation(piece: string, from: string, to: string, isPromoting: boolean) {
        const [_, fromCol] = from.split("-").map(Number);
        const [toRow, toCol] = to.split("-").map(Number);
        const opponentPieceOnLandingSquare = gameState[toRow][toCol];
        console.log(gameState)
        console.log("opponentPieceOnLandingSquare")
        console.log(opponentPieceOnLandingSquare)

        const files: Record<number, string> = myColor === "w" ?
            {
                0: "a",
                1: "b",
                2: "c",
                3: "d",
                4: "e",
                5: "f",
                6: "g",
                7: "h",
            } :
            {
                0: "h",
                1: "g",
                2: "f",
                3: "e",
                4: "d",
                5: "c",
                6: "b",
                7: "a",
            } // added the second possibe content for files in the case that the player is black

        const pieceSectionOfMoveNotation =
            piece === "pawn" ? "" :
                piece === "knight" ? "N" : piece.slice(0, 1).toUpperCase();

        // const [toRow, toCol] = to.split("-").map(Number);

        const captures = opponentPieceOnLandingSquare ? piece === "pawn" ? `${files[fromCol]}x` : "x" : "";

        const possibleCheck = inCheckNonState ? "+" : ""; // should i make this to chek if inCHeckNonSTate is actually w or b.

        let move = `${pieceSectionOfMoveNotation}${captures}${files[toCol]}${myColor === "w" ? 8 - toRow : toRow + 1}${possibleCheck}`; //added torow + 1 to correctly annotate chess moves when playing black

        if (isPromoting) {
            if (move.slice(-1) === "+" && move.includes("x")) {
                // example: Qxd8+
                move = `${files[fromCol]}${move.slice(1, -1)}=${move.slice(0, 1)}+`
            } else if (move.slice(-1) === "+") {
                // example: Qd8+
                move = `${move.slice(1, -1)}=${move.slice(0, 1)}+`
            } else if (move.includes("x")) {
                // example: Qxd8
                move = `${files[fromCol]}${move.slice(1)}=${move.slice(0, 1)}`
            } else {
                // example: Qd8
                move = `${move.slice(1)}=${move.slice(0, 1)}`
            }

        }

        return move;
    }
    function registerMove(piece: string, from: string, to: string, isPromoting: boolean = false) {
        const move = convertToChessNotation(piece, from, to, isPromoting)
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

    function calculateLegalMoves(piece: Piece, calculatedValidMoves: Set<string>, from: string) {
        const clonedGameState = gameState.map((prev) => [...prev]);
        const [fromRow, fromCol] = from.split("-").map(Number);
        const calculatedLegalMoves = new Set<string>();


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
            console.log("clonedGameStateSingleBranch")
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
        return new Set(calculatedLegalMoves);

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
                    }
                    i = -1;
                    continue;
                };


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

                }
            };
        }

        return [false, "", "", [[99], [99]]];
    }

    function checkIfOpponentIsInCheck(from: string, to: string, opponentColor: string, piece: Piece | undefined = undefined) { // the piece here when provided is when a pawn promotes
        setInCheck(null);
        inCheckNonState = null;

        const [fromRow, fromCol] = from.split("-").map(Number);
        const [toRow, toCol] = to.split("-").map(Number);

        const copy = gameState.map(row => [...row]);

        if (!piece) {
            const piece = copy[fromRow][fromCol];
            if (!piece) return; // for the setgame state should this line not be return prev?

            copy[fromRow][fromCol] = null;
            copy[toRow][toCol] = piece;
        } else {
            copy[fromRow][fromCol] = null;
            copy[toRow][toCol] = piece;
        }


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

    function setPromotedTo(piece: Piece, squareId: string) {
        console.log("promotingFrom here")
        console.log(promotingFrom)
        const [fromRow, fromCol] = promotingFrom.split("-").map(Number);
        const [squareRow, squareCol] = squareId.split("-").map(Number);


        setIndexOfCurrentGameState(() => allGameStates.length);

        const newGameState = gameState.map(row => [...row]);

        const piec = newGameState[fromRow][fromCol];


        newGameState[fromRow][fromCol] = null;
        newGameState[squareRow][squareCol] = piec;



        setGameState((prev) => {



            if (!piec) return prev;
            return newGameState.map(row => [...row]);
        });


        setAllGameStates((prev) => {
            const copy = prev.map(gameState => gameState.map(row => [...row]));
            return [...copy, newGameState.map(i => [...i])]
        })

        if (!piece) return;
        // line 873(line number might have changed due to some editing) and below. youre essentailly trying to make it such that the move notation of promoting is correct
        // handleMove(piece, promotingFrom, squareId);
        switchTurns();

        const opponentColor = getOppositeColorOf(piece.slice(-1));

        checkIfOpponentIsInCheck(promotingFrom, squareId, opponentColor, piece)

        registerMove(piece.slice(0, -2), promotingFrom, squareId, true);

        setPromotingFrom("");

    }

    function countMaterial() {
        let posEvaluation = 0
        calcGameState.forEach((row, rowIndex) =>
            row.forEach((square, squareIndex) => {
                switch (square) {
                    case "queen-b":
                        posEvaluation -= 9;
                        break;
                    case "rook-b":
                        posEvaluation -= 5;
                        break;
                    case "bishop-b":
                        posEvaluation -= 3;
                        break;
                    case "knight-b":
                        posEvaluation -= 3;
                        break;
                    case "pawn-b":
                        posEvaluation -= 1;
                        break;
                    case "queen-w":
                        posEvaluation += 9;
                        break;
                    case "rook-w":
                        posEvaluation += 5;
                        break;
                    case "bishop-w":
                        posEvaluation += 3;
                        break;
                    case "knight-w":
                        posEvaluation += 3;
                        break;
                    case "pawn-w":
                        posEvaluation += 1;
                        break;

                    default:
                        posEvaluation += 0;
                }
            }))

        return posEvaluation;
    }

    function callMakeInvisibleMove() {
        makeInvisibleMove(getOppositeColorOf(myColor), 4, null)
        const computerColor = getOppositeColorOf(myColor);
        const bestMove = computerColor === "b" ?
            Object.keys(posEvaluations).reduce((minK, k) => posEvaluations[k] < posEvaluations[minK] ? k : minK)
            : Object.keys(posEvaluations).reduce((maxK, k) => posEvaluations[k] > posEvaluations[maxK] ? k : maxK);
        makeComputerMove2(bestMove)
    }

    function makeInvisibleMove(color: string, movesDeep: number, firstMoveInBranch: string | null) {
        
        if (movesDeep <= 0) return;  // so we dont get an infinte recursion


        // get a possible move, calculate x moves ahead, count the material onboard, store the move and the evaluation in some variable
        // do this for all possible moves and the choose the move with the highest evaluation





        // const computerColor = getOppositeColorOf(myColor);
        for (let i = 0; i < 1; i++) {

            gameState.forEach((row, rowIndex) =>
                row.forEach((square, squareIndex) => {

                    if (square?.slice(-1) === color) {
                        const piece = square;
                        const from = `${rowIndex}-${squareIndex}`;
                        const calculatedValidMoves = calculateValidMoves(piece.slice(0, -2), from, color);
                        const returnedLegalMoves = calculateLegalMoves(piece, calculatedValidMoves, from);

                        // if (returnedLegalMoves.size <= 0) return; // return here works like 'continue' (yes 'continue' not break) in a normal loop. you can't use continue in forEach so instead you use return which works like continue.

                        for (let i = 0; i < returnedLegalMoves.size; i++) {

                            // const to = [...returnedLegalMoves][Math.floor(Math.random() * returnedLegalMoves.size)];
                            const to = [...returnedLegalMoves][i];

                            let firstMoveInBranch_ = firstMoveInBranch;
                            if (!firstMoveInBranch_) {
                                firstMoveInBranch_ = `${from}-${to}`;
                            }

                            cancelHighlights();


                            if (!((piece === "pawn-w" && rowIndex === 1) || (piece === "pawn-b" && rowIndex === 6))) {
                                // handleMove(piece, from, to);


                                // here to
                                let calcWhiteKingPosition = null;
                                let calcBlackKingPosition = null;
                                if (piece === "king-w") {
                                    // setWhiteKingPosition(to);
                                    calcWhiteKingPosition = to;
                                } else if (piece === "king-b") {
                                    // setBlackKingPosition(to);
                                    calcBlackKingPosition = to;
                                }

                                const [fromRow, fromCol] = from.split("-").map(Number);
                                const [toRow, toCol] = to.split("-").map(Number);

                                // let newGameState: Piece[][] = [];

                                // indexOfCurrentGameState = allGameStates.length + 1;
                                // setIndexOfCurrentGameState(() => allGameStates.length);

                                const newGameState = gameState.map(row => [...row]);

                                const piec = newGameState[fromRow][fromCol];


                                newGameState[fromRow][fromCol] = null;
                                newGameState[toRow][toCol] = piec;

                            
                                calcGameState = newGameState.map(row => [...row]);

                                setAllCalcGameStates((prev) => {
                                    const copy = prev.map(gameState => gameState.map(row => [...row]));
                                    return [...copy, newGameState.map(i => [...i])]
                                })
                                if (movesDeep === 1) {
                                    // posEvaluations.push(countMaterial());

                                    posEvaluations[firstMoveInBranch_] = countMaterial();

                                }



                                makeInvisibleMove(getOppositeColorOf(color), movesDeep - 1, firstMoveInBranch)
                                // here 



                                // switchTurns();

                                // const opponentColor = getOppositeColorOf(piece.slice(-1));
                                // checkIfOpponentIsInCheck(from, to, opponentColor);
                                // registerMove(piece.slice(0, -2), from, to);


                            } else {
                                setPromoting(true);
                                setPromotionSquare(to);
                                // promotingFrom = from; // why does this not work for if it is a state variable.
                                //                       it was not working like this so i changed teh variable to a state variable
                                setPromotingFrom(from);
                            }
                        }

                    }
                }));




            // const randomRowNumber = Math.floor(Math.random() * 8);
            // const randomColNumber = Math.floor(Math.random() * 8);
            // const piece = gameState[randomRowNumber][randomColNumber];
            // const from = `${randomRowNumber}-${randomColNumber}`;



            // if (piece?.slice(-1) === computerColor) {
            //     const calculatedValidMoves = calculateValidMoves(piece.slice(0, -2), from, computerColor);
            //     const returnedLegalMoves = calculateLegalMoves(piece, calculatedValidMoves, from);

            //     if (returnedLegalMoves.size <= 0) continue;

            //     const to = [...returnedLegalMoves][Math.floor(Math.random() * returnedLegalMoves.size)];

            //     cancelHighlights();


            //     if (!((piece === "pawn-w" && randomRowNumber === 1) || (piece === "pawn-b" && randomRowNumber === 6))) {
            //         handleMove(piece, from, to);
            //         switchTurns();

            //         const opponentColor = getOppositeColorOf(piece.slice(-1));
            //         checkIfOpponentIsInCheck(from, to, opponentColor);
            //         registerMove(piece.slice(0, -2), from, to);


            //     } else {
            //         setPromoting(true);
            //         setPromotionSquare(to);
            //         // promotingFrom = from; // why does this not work for if it is a state variable.
            //         //                       it was not working like this so i changed teh variable to a state variable
            //         setPromotingFrom(from);
            //     }
            //     break;
            // }
        }

        setComputerTurn(false);

    }

    function makeComputerMove2(bestMove: string) {


        // get a possible move, calculate x moves ahead, count the material onboard, store the move and the evaluation in some variable
        // do this for all possible moves and the choose the move with the highest evaluation

        const computerColor = getOppositeColorOf(myColor);

        const [fromRowNumber, fromColNumber, toRowNumber, toColNumber] = bestMove.split("-").map(Number);
        const piece = gameState[fromRowNumber][fromColNumber];
        const from = `${fromRowNumber}-${fromColNumber}`;
        const to = `${toRowNumber}-${toColNumber}`;


        if (piece?.slice(-1) === computerColor) {
            cancelHighlights();

            if (!((piece === "pawn-w" && fromRowNumber === 1) || (piece === "pawn-b" && fromRowNumber === 6))) {
                handleMove(piece, from, to);
                switchTurns();

                const opponentColor = getOppositeColorOf(piece.slice(-1));
                checkIfOpponentIsInCheck(from, to, opponentColor);
                registerMove(piece.slice(0, -2), from, to);
            } else {
                setPromoting(true);
                setPromotionSquare(to);
                // promotingFrom = from; // why does this not work for if it is a state variable.
                //                       it was not working like this so i changed teh variable to a state variable
                setPromotingFrom(from);
            }
        }

        setComputerTurn(false);
        posEvaluations = {}
        calcGameState = []

    }
    function makeComputerMove() {


        // get a possible move, calculate x moves ahead, count the material onboard, store the move and the evaluation in some variable
        // do this for all possible moves and the choose the move with the highest evaluation





        const computerColor = getOppositeColorOf(myColor);
        for (let i = 0; i < 256; i++) {

            // gameState.forEach((row, rowIndex) =>
            //     row.forEach((square, squareIndex) => {

            //         if (square?.slice(-1) === computerColor) {
            //             const piece = square;
            //             const from = `${rowIndex}-${squareIndex}`;
            //             const calculatedValidMoves = calculateValidMoves(piece.slice(0, -2), from, computerColor);
            //             const returnedLegalMoves = calculateLegalMoves(piece, calculatedValidMoves, from);

            //             // if (returnedLegalMoves.size <= 0) return; // return here works like 'continue' (yes 'continue' not break) in a normal loop. you can't use continue in forEach so instead you use return which works like continue.

            //             for (let i = 0; i < returnedLegalMoves.size; i++) {


            //                 // const to = [...returnedLegalMoves][Math.floor(Math.random() * returnedLegalMoves.size)];
            //                 const to = [...returnedLegalMoves][i];


            //                 cancelHighlights();


            //                 if (!((piece === "pawn-w" && randomRowNumber === 1) || (piece === "pawn-b" && randomRowNumber === 6))) {
            //                     handleMove(piece, from, to);
            //                     switchTurns();

            //                     const opponentColor = getOppositeColorOf(piece.slice(-1));
            //                     checkIfOpponentIsInCheck(from, to, opponentColor);
            //                     registerMove(piece.slice(0, -2), from, to);


            //                 } else {
            //                     setPromoting(true);
            //                     setPromotionSquare(to);
            //                     // promotingFrom = from; // why does this not work for if it is a state variable.
            //                     //                       it was not working like this so i changed teh variable to a state variable
            //                     setPromotingFrom(from);
            //                 }
            //             }

            //         }
            //     }));




            const randomRowNumber = Math.floor(Math.random() * 8);
            const randomColNumber = Math.floor(Math.random() * 8);
            const piece = gameState[randomRowNumber][randomColNumber];
            const from = `${randomRowNumber}-${randomColNumber}`;



            if (piece?.slice(-1) === computerColor) {
                const calculatedValidMoves = calculateValidMoves(piece.slice(0, -2), from, computerColor);
                const returnedLegalMoves = calculateLegalMoves(piece, calculatedValidMoves, from);

                if (returnedLegalMoves.size <= 0) continue;

                const to = [...returnedLegalMoves][Math.floor(Math.random() * returnedLegalMoves.size)];

                cancelHighlights();


                if (!((piece === "pawn-w" && randomRowNumber === 1) || (piece === "pawn-b" && randomRowNumber === 6))) {
                    handleMove(piece, from, to);
                    switchTurns();

                    const opponentColor = getOppositeColorOf(piece.slice(-1));
                    checkIfOpponentIsInCheck(from, to, opponentColor);
                    registerMove(piece.slice(0, -2), from, to);


                } else {
                    setPromoting(true);
                    setPromotionSquare(to);
                    // promotingFrom = from; // why does this not work for if it is a state variable.
                    //                       it was not working like this so i changed teh variable to a state variable
                    setPromotingFrom(from);
                }
                break;
            }
        }

        setComputerTurn(false);

    }

    function setCurrentGameState(num: number) {
        if (num < 0 || num >= allGameStates.length) return;
        setIndexOfCurrentGameState(() => num);
        setGameState(() => allGameStates[num].map(i => [...i]))
    }

    useImperativeHandle(ref, () => ({
        goToMove: (moveRowIndex: number, moveSubIndex: number) => {
            // allGameStates[0] is the initial position, so every move played
            // pushes exactly one new state onto allGameStates.
            const stateIndex = moveRowIndex * 2 + moveSubIndex + 1;
            setCurrentGameState(stateIndex);
        }
    }));

    useEffect(() => {

        if (mode === "Computer" && computerTurn) {
            callMakeInvisibleMove();
        }
        return () => {

        };
    }, [gameState]);

    return (
        <DragDropProvider
            onDragStart={(event) => {

                if (indexOfCurrentGameState !== allGameStates.length - 1) return;

                const from = event.operation.source?.id;
                if (typeof from !== "string") return;

                const [fromRow, fromCol] = from.split("-").map(Number);
                const piece = gameState[fromRow][fromCol];
                if (typeof piece !== "string") return;

                const generalizedPiece = piece.slice(0, -2);
                const color = piece.slice(-1)
                if (mode === "Computer" && color !== myColor) return;
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

                if (!((piece === "pawn-w" && fromRow === 1) || (piece === "pawn-b" && fromRow === 6))) {
                    handleMove(piece, from, to);
                    switchTurns();

                    const opponentColor = getOppositeColorOf(piece.slice(-1));
                    checkIfOpponentIsInCheck(from, to, opponentColor);
                    registerMove(piece.slice(0, -2), from, to);

                    // if (mode === "Computer") {
                    //     makeComputerMove();
                    // }

                    setComputerTurn(true)
                } else {
                    setPromoting(true);
                    setPromotionSquare(to);
                    // promotingFrom = from; // why does this not work for if it is a state variable.
                    //                       it was not working like this so i changed teh variable to a state variable
                    setPromotingFrom(from);
                }
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
                                        promoting={promoting}
                                        setPromoting={setPromoting}
                                        promotionSquare={promotionSquare}
                                        setPromotionSquare={setPromotionSquare}
                                        setPromotedTo={setPromotedTo}
                                    />
                                );
                            })}
                        </div>
                    ))
                }
                <div className='flex justify-between mt-3'>
                    <button className="bg-[#5196EB] p-2 rounded-sm w-[8rem] cursor-pointer" onClick={() => setCurrentGameState(indexOfCurrentGameState - 1)}>Prev</button>
                    <button className="bg-[#5196EB] p-2 rounded-sm w-[8rem] cursor-pointer" onClick={() => setCurrentGameState(indexOfCurrentGameState + 1)}>Next</button>
                </div>
            </div>
        </DragDropProvider>
    );
});

export default Board;

