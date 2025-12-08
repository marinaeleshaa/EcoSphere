"use client";

import React from "react";
import { BiSolidLeaf } from "react-icons/bi";
import { GiTicTacToe } from "react-icons/gi";
import { MdDoNotDisturbAlt } from "react-icons/md";
import { useTranslations } from 'next-intl';

const GameHero = () => {
  const t = useTranslations('Game.hero');

  return (
    <div className="h-40 sm:h-50 bg-primary text-primary-foreground gap-5  w-full flex items-center justify-center flex-col">
      <div className="text-3xl sm:text-5xl font-bold text-foreground animate-bounce flex items-center gap-4">
        <GiTicTacToe />
        <h1>{t('title')}</h1>
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
              {t('you')}
            </span>
          </div>
          <span className="text-gray-400">{t('vs')}</span>
          <div className="flex items-center gap-1.5">
            <MdDoNotDisturbAlt className="text-xl md:text-lg text-primary animate-pulse" />
            <span className="text-sm md:text-xs font-semibold text-secondary-foreground">
              {t('ai')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHero;
