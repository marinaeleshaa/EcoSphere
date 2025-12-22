"use client";

import React from "react";
import Image from "next/image";
import { BiSolidLeaf } from "react-icons/bi";
import { GiTicTacToe } from "react-icons/gi";
import { MdDoNotDisturbAlt } from "react-icons/md";
import { useTranslations } from 'next-intl';

interface IProps {
  imgUrl?: string;
}

const GameHero = ({ imgUrl = "/re2.png" }: IProps) => {
  const t = useTranslations('Game.hero');

  return (
    <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          fill
          src={imgUrl}
          alt="Game background"
          className="w-full h-full object-cover blur-md"
        />
        {/* Modern gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/60 to-primary"></div>
        <div className="absolute inset-0 bg-primary/20"></div>
      </div>

      {/* Content Container */}
      <div className="relative h-full flex items-center justify-center px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl w-full text-center">
          {/* Decorative accent */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-background"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-background"></div>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-background"></div>
          </div>

          {/* Title with icons */}
          <div className="text-3xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground animate-bounce flex items-center justify-center gap-4 mb-6">
            <GiTicTacToe />
            <h1>{t('title')}</h1>
            <GiTicTacToe />
          </div>

          {/* Player vs AI indicator */}
          <div className="mt-4 md:mt-6">
            <div className="inline-flex items-center gap-3 bg-background backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-primary/20">
              <div className="flex items-center gap-2">
                <BiSolidLeaf
                  className="text-2xl md:text-xl text-primary animate-spin"
                  style={{ animationDuration: "4s" }}
                />
                <span className="text-base md:text-sm font-semibold text-secondary-foreground">
                  {t('you')}
                </span>
              </div>
              <span className="text-primary-foreground/60 font-medium">{t('vs')}</span>
              <div className="flex items-center gap-2">
                <MdDoNotDisturbAlt className="text-2xl md:text-xl text-primary animate-pulse" />
                <span className="text-base md:text-sm font-semibold text-secondary-foreground">
                  {t('ai')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle decorative blur */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-primary/10 rounded-full blur-3xl"></div>
    </div>
  );
};

export default GameHero;