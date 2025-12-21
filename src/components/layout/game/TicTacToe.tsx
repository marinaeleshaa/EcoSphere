"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MdDoNotDisturbAlt } from "react-icons/md";
import { BiSolidLeaf } from "react-icons/bi";
import { RiRobot3Line } from "react-icons/ri";
import { FaHandshakeSimple, FaPlay } from "react-icons/fa6";
import { FaRegSmileWink } from "react-icons/fa";
import { GiTrophy } from "react-icons/gi";
import { useTranslations } from "next-intl";
import { updateUserPoints } from "@/frontend/api/Users";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function TicTacToe() {
  const t = useTranslations("Game");
  // -------------------------
  // 🧩 STATES
  // -------------------------
  const { status } = useSession();
  const [board, setBoard] = useState<Player[]>(new Array(9).fill(null));
  const [winner, setWinner] = useState<Player | "Draw">(null);
  const [isAiTurn, setIsAiTurn] = useState(false);
  const [scores, setScores] = useState({ player: 0, ai: 0, draws: 0 });
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [canPlay, setCanPlay] = useState(true);
  const [remainingPlays, setRemainingPlays] = useState(2);
  const [gameStarted, setGameStarted] = useState(false);
  const mainAudioRef = useRef<HTMLAudioElement>(null);

  // -------------------------
  // ⏱️ GAME LIMIT LOGIC (LOCAL)
  // -------------------------
  const checkGameLimit = useCallback(() => {
    const playData = localStorage.getItem("tictactoe_play_data");
    const today = new Date().toDateString();

    if (playData) {
      const { date, count } = JSON.parse(playData);
      if (date === today) {
        setRemainingPlays(Math.max(0, 2 - count));
        setCanPlay(count < 2);
        return;
      }
    }

    setRemainingPlays(2);
    setCanPlay(true);
  }, []);

  const recordPlayLocally = () => {
    const today = new Date().toDateString();
    const playData = localStorage.getItem("tictactoe_play_data");
    let count = 1;

    if (playData) {
      const parsed = JSON.parse(playData);
      if (parsed.date === today) {
        count = parsed.count + 1;
      }
    }

    localStorage.setItem(
      "tictactoe_play_data",
      JSON.stringify({ date: today, count })
    );
    setRemainingPlays(Math.max(0, 2 - count));
    if (count >= 2) setCanPlay(false);
  };
  // -------------------------
  // 💾 LOAD SCORES FROM STORAGE
  // -------------------------
  useEffect(() => {
    if (mainAudioRef.current) {
      mainAudioRef.current.volume = 0.1;
    }
    checkGameLimit();
    const savedScores = localStorage.getItem("tictactoe_scores");
    if (savedScores) {
      setTimeout(() => {
        setScores(JSON.parse(savedScores));
      }, 500);
    }
  }, [checkGameLimit]);

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
  // 🎯 UPDATE USER POINTS
  // -------------------------
  const updateUser = async () => {
    const pointsToAdd =
      difficulty === "easy" ? 100 : difficulty === "medium" ? 250 : 500;
    try {
      await updateUserPoints(pointsToAdd);
      toast.success(t("status.pointsAdded", { points: pointsToAdd }));
    } catch (error) {
      console.error("Error updating user points:", error);
      toast.error(t("status.updatePoints"));
    }
  };

  // -------------------------
  // 🏆 CHECK WINNER (SET STATE)
  // -------------------------
  const checkWinner = useCallback(
    async (b: Player[]) => {
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
          //Update user points based on the diffculty
          if (b[x] === "X" && status === "authenticated") {
            await updateUser();
          } else if (b[x] === "X" && status === "unauthenticated") {
            toast.info(t("status.loginForPoints"));
          }
          return;
        }
      }

      // كشف التعادل
      if (b.every((cell) => cell !== null)) {
        setWinner("Draw");
        updateScores("Draw");
      }
    },
    [updateScores, status, updateUser, t]
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
  }, [difficulty, board, checkWinner]);

  // -------------------------
  // 🎮 PLAYER MOVE
  // -------------------------
  const handleClick = (index: number) => {
    if (board[index] || winner || isAiTurn || (!canPlay && !gameStarted))
      return;

    if (!gameStarted) {
      recordPlayLocally();
      setGameStarted(true);
    }

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
  const renderIcon = useCallback((value: Player) => {
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
  }, []);

  // -------------------------
  // 🔄 restart game
  // -------------------------
  const restartGame = () => {
    setBoard(new Array(9).fill(null));
    setWinner(null);
    setIsAiTurn(false);
    setGameStarted(false);
    checkGameLimit();
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
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          {winner === "Draw" ? (
            <div className="flex items-center gap-2">
              {t("status.draw")} <FaHandshakeSimple className="mt-1" />
            </div>
          ) : winner === "X" ? (
            <div className="flex items-center gap-3">
              <FaRegSmileWink />
              {t("status.youWin")}
            </div>
          ) : winner === "O" ? (
            <div className="flex items-center gap-3">
              <RiRobot3Line />
              {t("status.aiWin")}
            </div>
          ) : isAiTurn ? (
            <div className="flex items-center gap-3">
              <RiRobot3Line />
              {t("status.aiThinking")}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {t("status.yourTurn")}{" "}
              <BiSolidLeaf className="text-primary ml-3" />
            </div>
          )}
        </div>

        <div className="text-sm font-medium text-muted-foreground bg-secondary/20 px-4 py-1 rounded-full">
          {t("status.remainingPlays", { count: remainingPlays })}
        </div>
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
        {/* left Section - Game Board */}
        <div className="w-fit lg:w-auto shrink-0">
          {/* Status Card */}
          <div className="bg-primary/10 backdrop-blur-md rounded-3xl py-4 px-6 shadow-2xl mb-6 text-center">
            <div className="text-2xl lg:text-3xl font-black dark:text-secondary-foreground">
              {getGameStatus()}
            </div>
          </div>

          {/* Game Board Section */}
          <div className="relative w-full flex justify-center">
            {/* Limit Overlay */}
            {!canPlay && !gameStarted && (
              <div className="absolute inset-0 z-20 flex items-center justify-center p-6 text-center">
                <div className="bg-background/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-primary/20 animate-in fade-in zoom-in duration-500 max-w-[280px]">
                  <MdDoNotDisturbAlt className="text-5xl text-red-500 mx-auto mb-4 animate-pulse" />
                  <h2 className="text-2xl font-bold text-red-500 leading-tight">
                    {t("status.limitReached")}
                  </h2>
                  <p className="text-sm text-secondary-foreground/70 mt-3">
                    {t("status.limitReachedDesc")}
                  </p>
                </div>
              </div>
            )}

            <div
              className={`
                bg-primary/10 backdrop-blur-md rounded-3xl p-8 lg:p-10 shadow-2xl transition-all duration-500
                ${
                  !canPlay && !gameStarted
                    ? "opacity-20 grayscale pointer-events-none scale-95 blur-[2px]"
                    : "opacity-100"
                }
              `}
            >
              <div className="grid grid-cols-3 gap-2 lg:gap-6">
                {board.map((value, index) => (
                  <button
                    key={index}
                    onClick={() => handleClick(index)}
                    disabled={
                      isAiTurn || winner !== null || (!canPlay && !gameStarted)
                    }
                    className={`
                      w-20 h-20 sm:w-28 sm:h-28 lg:w-30 lg:h-30
                      bg-linear-to-br from-primary via-primary to-primary/80 
                      rounded-3xl flex items-center justify-center shadow-xl
                      transition-all duration-300 ease-out
                      ${
                        !value &&
                        !winner &&
                        !isAiTurn &&
                        (canPlay || gameStarted)
                          ? "hover:scale-110 hover:shadow-2xl hover:rotate-3 active:scale-95"
                          : ""
                      }
                      ${value ? "scale-100" : "scale-95"}
                      ${
                        isAiTurn || winner || (!canPlay && !gameStarted)
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
                  className="mt-6 w-full bg-linear-to-r from-primary to-primary/80 text-primary-foreground py-4 rounded-2xl font-black text-xl
                    hover:from-primary/90 hover:to-primary/70 flex items-center justify-center gap-3 cursor-pointer 
                    active:scale-95 transition-all duration-200 shadow-xl hover:shadow-2xl"
                >
                  <FaPlay />
                  {t("actions.playAgain")}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* right Section - Score Board */}
        <div className="w-full  sm:w-[60%] md:w-[50%] lg:w-80 space-y-6">
          {/* Title Card - Only on large screens */}
          <div className="hidden bg-primary/10 lg:flex justify-between items-center backdrop-blur-md rounded-3xl p-6 shadow-2xl text-center transform hover:scale-105 transition-transform gap-2">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <BiSolidLeaf
                className="text-xl md:text-4xl text-primary animate-spin"
                style={{ animationDuration: "4s" }}
              />
              <span className="text-sm md:text-xl font-semibold text-secondary-foreground whitespace-nowrap">
                {t("hero.you")}
              </span>
            </div>
            <span className="text-gray-400 md:text-xl px-2">
              {t("hero.vs")}
            </span>
            <div className="flex flex-col items-center gap-1 shrink-0">
              <MdDoNotDisturbAlt className="text-xl md:text-4xl text-primary animate-pulse" />
              <span className="text-sm md:text-xl font-semibold text-secondary-foreground whitespace-nowrap">
                {t("hero.ai")}
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
                  disabled={!canPlay && !gameStarted}
                  onChange={handleDifficultyChange}
                  className="accent-primary scale-125"
                />
                <span className="text-primary">{t("difficulty.easy")}</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform">
                <input
                  type="radio"
                  name="difficulty"
                  value="medium"
                  disabled={!canPlay && !gameStarted}
                  onChange={handleDifficultyChange}
                  defaultChecked
                  className="accent-primary scale-125"
                />
                <span className="text-primary">{t("difficulty.medium")}</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform">
                <input
                  type="radio"
                  name="difficulty"
                  value="hard"
                  disabled={!canPlay && !gameStarted}
                  onChange={handleDifficultyChange}
                  className="accent-primary scale-125"
                />
                <span className="text-primary">{t("difficulty.hard")}</span>
              </label>
            </div>
          </div>

          {/* Score Board */}
          <div className="bg-primary/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-center gap-3 mb-6">
              <GiTrophy className="text-3xl text-primary animate-bounce" />
              <h2 className="text-2xl font-black dark:text-secondary-foreground">
                {t("scoreBoard.title")}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-linear-to-r from-green-100 to-green-50 rounded-2xl p-4 shadow-lg transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center">
                      <FaRegSmileWink className="text-xl" />
                    </div>
                    <span className="font-bold text-lg text-primary">
                      {t("scoreBoard.you")}
                    </span>
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
                      {t("scoreBoard.draws")}
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
                    <span className="font-bold text-lg text-red-600">
                      {t("scoreBoard.ai")}
                    </span>
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
              {t("actions.resetScores")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------
// 🧩 TYPES
// -------------------------
type Player = "X" | "O" | null;
type Difficulty = "easy" | "medium" | "hard";

// -------------------------
// 🧩 HELPERS
// -------------------------
const checkWinnerReturn = (b: Player[]): Player => {
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
};

const getAvailableMoves = (b: Player[]) => {
  const moves: number[] = [];
  b.forEach((cell, i) => {
    if (cell === null) moves.push(i);
  });
  return moves;
};

// -------------------------
// 🧠 MINIMAX (recursive, دالة عادية)
// -------------------------
const minimax = (b: Player[], depth: number, isMaximizing: boolean): number => {
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
