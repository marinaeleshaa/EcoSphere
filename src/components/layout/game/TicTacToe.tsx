"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MdDoNotDisturbAlt } from "react-icons/md";
import { BiSolidLeaf } from "react-icons/bi";
import { RiRobot3Line } from "react-icons/ri";
import { FaHandshakeSimple, FaPlay } from "react-icons/fa6";
import { FaRegSmileWink } from "react-icons/fa";
import { GiTrophy } from "react-icons/gi";

export default function TicTacToe() {
  type Player = "X" | "O" | null;
  type Difficulty = "easy" | "medium" | "hard";
  // -------------------------
  // 🧩 STATES
  // -------------------------
  const [board, setBoard] = useState<Player[]>(new Array(9).fill(null));
  const [winner, setWinner] = useState<Player | "Draw">(null);
  const [isAiTurn, setIsAiTurn] = useState(false);
  const [scores, setScores] = useState({ player: 0, ai: 0, draws: 0 });
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const mainAudioRef = useRef<HTMLAudioElement>(null);
  // -------------------------
  // 💾 LOAD SCORES FROM STORAGE
  // -------------------------
  useEffect(() => {
    mainAudioRef.current!.volume = 0.5;
    const savedScores = localStorage.getItem("tictactoe_scores");
    if (savedScores) {
      setTimeout(() => {
        setScores(JSON.parse(savedScores));
      }, 500);
    }
  }, []);

  // -------------------------
  // 💾 SAVE SCORES TO STORAGE
  // -------------------------
  const updateScores = useCallback((result: Player | "Draw") => {
    setScores((prev) => {
      const newScores = {
        player: result === "X" ? prev.player + 1 : prev.player,
        ai: result === "O" ? prev.ai + 1 : prev.ai,
        draws: result === "Draw" ? prev.draws + 1 : prev.draws,
      };
      localStorage.setItem("tictactoe_scores", JSON.stringify(newScores));
      return newScores;
    });
  }, []);

  // -------------------------
  // 🧩 HELPERS
  // -------------------------
  const checkWinnerReturn = useCallback((b: Player[]): Player => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const [x, y, z] of lines) {
      if (b[x] && b[x] === b[y] && b[y] === b[z]) return b[x];
    }
    return null;
  }, []);

  const getAvailableMoves = useCallback((b: Player[]) => {
    const moves: number[] = [];
    b.forEach((cell, i) => {
      if (cell === null) moves.push(i);
    });
    return moves;
  }, []);

  // -------------------------
  // 🧠 MINIMAX (recursive, دالة عادية)
  // -------------------------
  const minimax = (
    b: Player[],
    depth: number,
    isMaximizing: boolean
  ): number => {
    const winnerNow = checkWinnerReturn(b);

    if (winnerNow === "X") return -10 + depth;
    if (winnerNow === "O") return 10 - depth;
    if (getAvailableMoves(b).length === 0) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (const move of getAvailableMoves(b)) {
        const boardCopy = [...b];
        boardCopy[move] = "O";
        const score = minimax(boardCopy, depth + 1, false);
        bestScore = Math.max(score, bestScore);
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (const move of getAvailableMoves(b)) {
        const boardCopy = [...b];
        boardCopy[move] = "X";
        const score = minimax(boardCopy, depth + 1, true);
        bestScore = Math.min(score, bestScore);
      }
      return bestScore;
    }
  };

  // -------------------------
  // 🏆 CHECK WINNER (SET STATE)
  // -------------------------
  const checkWinner = useCallback(
    (b: Player[]) => {
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];

      for (const [x, y, z] of lines) {
        if (b[x] && b[x] === b[y] && b[y] === b[z]) {
          setWinner(b[x]);
          updateScores(b[x]);
          return;
        }
      }

      // كشف التعادل
      if (b.every((cell) => cell !== null)) {
        setWinner("Draw");
        updateScores("Draw");
      }
    },
    [updateScores]
  );

  // -------------------------
  // 🤖 AI MOVE
  // -------------------------
  const aiMove = useCallback(() => {
    // Determine random move chance based on difficulty
    let randomMoveChance = 0;
    if (difficulty === "easy") randomMoveChance = 0.7; // 70% random moves
    else if (difficulty === "medium") randomMoveChance = 0.5; // 50% random moves

    const makeRandomMove = Math.random() < randomMoveChance;

    if (makeRandomMove) {
      const availableMoves = getAvailableMoves(board);
      if (availableMoves.length > 0) {
        const randomMove =
          availableMoves[Math.floor(Math.random() * availableMoves.length)];
        const newBoard = [...board];
        newBoard[randomMove] = "O";
        setBoard(newBoard);
        checkWinner(newBoard);
        setIsAiTurn(false);
        return;
      }
    }

    // Otherwise use minimax (smart move)
    let bestScore = -Infinity;
    let bestMove = -1;

    for (const move of getAvailableMoves(board)) {
      const boardCopy = [...board];
      boardCopy[move] = "O";

      const score = minimax(boardCopy, 0, false);

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    if (bestMove !== -1) {
      const newBoard = [...board];
      newBoard[bestMove] = "O";
      setBoard(newBoard);
      checkWinner(newBoard);
    }

    setIsAiTurn(false);
  }, [board, checkWinner, getAvailableMoves, difficulty]);

  // -------------------------
  // 🎮 PLAYER MOVE
  // -------------------------
  const handleClick = (index: number) => {
    if (board[index] || winner || isAiTurn) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    checkWinner(newBoard);

    setIsAiTurn(true);
  };

  // -------------------------
  // ⏳ WHEN AI SHOULD PLAY
  // -------------------------
  useEffect(() => {
    if (isAiTurn && !winner) {
      const timer = setTimeout(() => aiMove(), 1000);
      return () => clearTimeout(timer);
    }
  }, [isAiTurn, winner, aiMove]);

  // -------------------------
  // 🎨 ICON RENDER
  // -------------------------
  const renderIcon = (value: Player) => {
    if (value === "X")
      return (
        <BiSolidLeaf
          className="text-primary-foreground text-4xl sm:text-5xl md:text-6xl lg:text-7xl animate-spin"
          style={{ animationDuration: "3s" }}
        />
      );
    if (value === "O")
      return (
        <MdDoNotDisturbAlt className="text-primary-foreground text-4xl sm:text-5xl md:text-6xl lg:text-7xl animate-pulse" />
      );
    return null;
  };

  // -------------------------
  // 🔄 restart game
  // -------------------------
  const restartGame = () => {
    setBoard(new Array(9).fill(null));
    setWinner(null);
    setIsAiTurn(false);
  };

  // -------------------------
  // 🗑️ reset scores
  // -------------------------
  const resetScores = () => {
    const newScores = { player: 0, ai: 0, draws: 0 };
    setScores(newScores);
    localStorage.setItem("tictactoe_scores", JSON.stringify(newScores));
  };

  // -------------------------
  // change difficulty
  // -------------------------
  const handleDifficultyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDifficulty(e.target.value as Difficulty);
  };

  // -------------------------
  // 🖥️ UI
  // -------------------------
  const getGameStatus = () => {
    if (winner) {
      if (winner === "Draw")
        return (
          <div className="flex items-center gap-2 justify-center">
            Draw <FaHandshakeSimple className="mt-1" />
          </div>
        );
      return (
        <span className="flex items-center gap-2 justify-center">
          {winner === "X" ? (
            <div className="flex items-center gap-3 justify-center">
              <FaRegSmileWink />
              You Win
            </div>
          ) : (
            <div className="flex items-center gap-3 justify-center">
              <RiRobot3Line />
              AI Win
            </div>
          )}
        </span>
      );
    }
    if (isAiTurn)
      return (
        <div className="flex items-center gap-3 justify-center">
          <RiRobot3Line />
          AI think...
        </div>
      );
    return (
      <div className="flex items-center justify-center">
        Your turn <BiSolidLeaf className="text-primary ml-3" />
      </div>
    );
  };

  return (
    <div className="min-h-screen  relative overflow-hidden">
      <audio src="/Audio/game.mp3" loop autoPlay hidden ref={mainAudioRef}>
        <track
          kind="captions"
          label="English"
          src="/Audio/game.captions.vtt"
          default
        ></track>
      </audio>

      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-20 right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 p-6 lg:p-12 relative z-10">
        {/* Right Section - Game Board */}
        <div className="w-fit lg:w-auto shrink-0">
          {/* Mobile Title */}
          {/* <div className="lg:hidden text-center mb-6">
            <h1 className="text-4xl font-black bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
              TIC TAC TOE
            </h1>
          </div> */}

          {/* Status Card */}
          <div className="bg-primary/10 backdrop-blur-md rounded-3xl py-4 px-6 shadow-2xl mb-6 text-center">
            <p className="text-2xl lg:text-3xl font-black dark:text-secondary-foreground">
              {getGameStatus()}
            </p>
          </div>

          {/* Game Board */}
          <div className="bg-primary/10 backdrop-blur-md rounded-3xl p-8 lg:p-10 shadow-2xl">
            <div className="grid grid-cols-3 gap-2 lg:gap-6 mb-8">
              {board.map((value, index) => (
                <button
                  key={index}
                  onClick={() => handleClick(index)}
                  disabled={isAiTurn || winner !== null}
                  className={`
                    w-20 h-20 sm:w-28 sm:h-28 lg:w-30 lg:h-30
                    bg-linear-to-br from-primary via-primary to-primary/80 
                    rounded-3xl flex items-center justify-center shadow-xl
                    transition-all duration-300 ease-out
                    ${
                      !value && !winner && !isAiTurn
                        ? "hover:scale-110 hover:shadow-2xl hover:rotate-3 active:scale-95"
                        : ""
                    }
                    ${value ? "scale-100" : "scale-95"}
                    ${
                      isAiTurn || winner
                        ? "cursor-not-allowed opacity-60"
                        : "cursor-pointer"
                    }
                  `}
                >
                  {renderIcon(value)}
                </button>
              ))}
            </div>

            {/* Action Button */}
            {winner && (
              <button
                onClick={restartGame}
                className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-4 rounded-2xl font-black text-xl
                  hover:from-primary/90 hover:to-primary/70 flex items-center justify-center gap-3 cursor-pointer 
                  active:scale-95 transition-all duration-200 shadow-xl hover:shadow-2xl"
              >
                <FaPlay />
                Play Again
              </button>
            )}
          </div>
        </div>

        {/* Left Section - Score Board */}
        <div className="w-full  sm:w-[60%] md:w-[50%] lg:w-80 space-y-6">
          {/* Title Card - Only on large screens */}
          <div className="hidden  bg-primary/10 lg:flex justify-evenly backdrop-blur-md rounded-3xl p-8 shadow-2xl text-center transform hover:scale-105 transition-transform">
            <div className="flex items-center gap-1.5">
              <BiSolidLeaf
                className="text-xl md:text-4xl text-primary animate-spin"
                style={{ animationDuration: "4s" }}
              />
              <span className="text-sm md:text-3xl font-semibold text-secondary-foreground">
                You
              </span>
            </div>
            <span className="text-gray-400 md:text-2xl">vs</span>
            <div className="flex items-center gap-1.5">
              <MdDoNotDisturbAlt className="text-xl md:text-4xl text-primary animate-pulse" />
              <span className="text-sm md:text-3xl font-semibold text-secondary-foreground">
                AI
              </span>
            </div>
          </div>
          <div className="text-primary/10 space-y-4">
            <div className="flex justify-evenly gap-4 bg-primary/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl">
              <label className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform">
                <input
                  type="radio"
                  name="difficulty"
                  value="easy"
                  onChange={handleDifficultyChange}
                  className="accent-primary scale-125"
                />
                <span className="text-primary">Easy</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform">
                <input
                  type="radio"
                  name="difficulty"
                  value="medium"
                  onChange={handleDifficultyChange}
                  defaultChecked
                  className="accent-primary scale-125"
                />
                <span className="text-primary">Medium</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform">
                <input
                  type="radio"
                  name="difficulty"
                  value="hard"
                  onChange={handleDifficultyChange}
                  className="accent-primary scale-125"
                />
                <span className="text-primary">Hard</span>
              </label>
            </div>
          </div>

          {/* Score Board */}
          <div className="bg-primary/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-center gap-3 mb-6">
              <GiTrophy className="text-3xl text-primary animate-bounce" />
              <h2 className="text-2xl font-black dark:text-secondary-foreground">
                SCORE BOARD
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-linear-to-r from-green-100 to-green-50 rounded-2xl p-4 shadow-lg transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center">
                      <FaRegSmileWink className="text-xl" />
                    </div>
                    <span className="font-bold text-lg text-primary">You</span>
                  </div>
                  <span className="text-3xl font-black text-primary">
                    {scores.player}
                  </span>
                </div>
              </div>

              <div className="bg-linear-to-r from-yellow-100 to-yellow-50 rounded-2xl p-4 shadow-lg transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                      <FaHandshakeSimple className="text-xl" />
                    </div>
                    <span className="font-bold text-lg text-yellow-600">
                      Draws
                    </span>
                  </div>
                  <span className="text-3xl font-black text-yellow-600">
                    {scores.draws}
                  </span>
                </div>
              </div>

              <div className="bg-linear-to-r from-red-100 to-red-50 rounded-2xl p-4 shadow-lg transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                      <RiRobot3Line className="text-xl" />
                    </div>
                    <span className="font-bold text-lg text-red-600">AI</span>
                  </div>
                  <span className="text-3xl font-black text-red-600">
                    {scores.ai}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={resetScores}
              className="mt-6 w-full py-3 rounded-xl bg-linear-to-r from-primary to-primary/80 text-primary-foreground font-bold
                hover:from-primary/90 hover:to-primary/70 hover:scale-105 transition-all shadow-lg"
            >
              Reset Scores
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
