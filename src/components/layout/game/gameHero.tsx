import React from "react";
import { BiSolidLeaf } from "react-icons/bi";
import { GiTicTacToe } from "react-icons/gi";
import { MdDoNotDisturbAlt } from "react-icons/md";

const GameHero = () => {
  return (
    <div className="h-40 sm:h-50 bg-primary text-primary-foreground gap-5  w-full flex items-center justify-center flex-col">
      <div className="text-3xl sm:text-5xl font-bold text-foreground animate-bounce flex items-center gap-4">
        <GiTicTacToe />
        <h1>Tic Tac Toe</h1>
        <GiTicTacToe />
      </div>
        <div className="mt-4 md:mt-3 text-center lg:hidden">
            <div className="inline-flex items-center gap-3 bg-background backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
              <div className="flex items-center gap-1.5">
                <BiSolidLeaf
                  className="text-xl md:text-lg text-primary animate-spin"
                  style={{ animationDuration: "4s" }}
                />
                <span className="text-sm md:text-xs font-semibold text-secondary-foreground">
                  You
                </span>
              </div>
              <span className="text-gray-400">vs</span>
              <div className="flex items-center gap-1.5">
                <MdDoNotDisturbAlt className="text-xl md:text-lg text-primary animate-pulse" />
                <span className="text-sm md:text-xs font-semibold text-secondary-foreground">
                  AI
                </span>
              </div>
            </div>
          </div>
    </div>
  );
};

export default GameHero;
