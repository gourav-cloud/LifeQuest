import React from 'react';
import { Adventurer } from '../types.ts';
import { getXpRequiredForLevel } from '../lib/gameMath.ts';
import { Flame, Coins, Shield, Swords, Sparkles, BookOpen, Heart, Zap, User } from 'lucide-react';
import { motion } from 'motion/react';

interface CharacterHudProps {
  adventurer: Adventurer;
  onOpenProfile?: () => void;
}

export const CharacterHud: React.FC<CharacterHudProps> = ({ adventurer, onOpenProfile }) => {
  const xpNeeded = getXpRequiredForLevel(adventurer.level);
  const xpPercent = Math.min(100, Math.round((adventurer.xp / Math.max(1, xpNeeded)) * 100));
  const hpPercent = Math.min(100, Math.round((adventurer.hp / Math.max(1, adventurer.maxHp)) * 100));
  const mpPercent = Math.min(100, Math.round((adventurer.mp / Math.max(1, adventurer.maxMp)) * 100));

  // Avatar icon or color
  const getAvatarBadge = (charClass: string) => {
    switch (charClass.toLowerCase()) {
      case 'mage':
        return '🧙‍♂️';
      case 'rogue':
        return '🥷';
      case 'paladin':
        return '🛡️';
      case 'bard':
        return '🪕';
      case 'alchemist':
        return '🧪';
      default:
        return '⚔️';
    }
  };

  return (
    <div className="w-full rpg-panel p-4 sm:p-5 mb-6 text-[#fffffe] relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Left: Avatar & Character Info */}
        <div className="lg:col-span-4 flex items-center gap-3.5">
          <div
            onClick={onOpenProfile}
            className="cursor-pointer group relative flex-shrink-0"
            title="View Character Sheet"
          >
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded bg-[#100d1c] border-3 border-[#ffd166] flex items-center justify-center text-3xl shadow-[0_0_12px_rgba(255,209,102,0.3)] group-hover:scale-105 transition-transform">
              <span>{getAvatarBadge(adventurer.characterClass)}</span>
            </div>
            <div className="absolute -bottom-1.5 -right-1 bg-[#ff5400] text-white font-pixel text-[9px] px-1.5 py-0.5 rounded border border-[#ffd166] shadow">
              Lv.{adventurer.level}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-pixel text-sm sm:text-base text-[#ffd166] truncate">
                {adventurer.displayName}
              </h1>
              <span className="text-[10px] font-pixel text-[#a7a9be] uppercase px-1.5 py-0.5 bg-[#0e0a19] border border-[#3b3355] rounded">
                {adventurer.characterClass}
              </span>
            </div>
            <p className="font-retro text-lg text-[#06d6a0] mt-0.5">
              Rank: {adventurer.level < 5 ? 'Apprentice Hero' : adventurer.level < 10 ? 'Elite Champion' : 'Mythic Vanguard'}
            </p>

            {/* Quick Currency & Streak */}
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1 text-[#ffd166] font-pixel text-xs bg-[#241a0e] px-2 py-1 rounded border border-[#a87d2b]">
                <Coins className="w-3.5 h-3.5 text-[#ffd166] fill-[#ffd166]/30" />
                <span>{adventurer.gold} G</span>
              </div>

              <div
                className={`flex items-center gap-1 font-pixel text-xs px-2 py-1 rounded border ${
                  adventurer.currentStreak > 0
                    ? 'text-[#ff5400] bg-[#2b1008] border-[#ff5400]/60'
                    : 'text-[#a7a9be] bg-[#1a1625] border-[#3b3355]'
                }`}
                title={`Current Streak: ${adventurer.currentStreak} Days (Longest: ${adventurer.longestStreak})`}
              >
                <Flame className={`w-3.5 h-3.5 ${adventurer.currentStreak > 0 ? 'text-[#ff5400] animate-pulse' : ''}`} />
                <span>{adventurer.currentStreak}d Streak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: RPG Status Bars (HP, MP, XP) */}
        <div className="lg:col-span-5 space-y-2">
          {/* Health Bar */}
          <div>
            <div className="flex justify-between items-center text-[10px] font-pixel mb-1 text-[#ef476f]">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3 fill-[#ef476f]" /> HP
              </span>
              <span>
                {adventurer.hp} / {adventurer.maxHp}
              </span>
            </div>
            <div className="w-full h-3 bg-[#12080a] border border-[#ef476f]/50 rounded-xs overflow-hidden p-0.5">
              <motion.div
                className="h-full bg-gradient-to-r from-[#d90429] to-[#ef476f] rounded-xs shadow-[0_0_8px_rgba(239,71,111,0.6)]"
                initial={{ width: 0 }}
                animate={{ width: `${hpPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Mana Bar */}
          <div>
            <div className="flex justify-between items-center text-[10px] font-pixel mb-1 text-[#4cc9f0]">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 fill-[#4cc9f0]" /> MP
              </span>
              <span>
                {adventurer.mp} / {adventurer.maxMp}
              </span>
            </div>
            <div className="w-full h-3 bg-[#061017] border border-[#4cc9f0]/50 rounded-xs overflow-hidden p-0.5">
              <motion.div
                className="h-full bg-gradient-to-r from-[#118ab2] to-[#4cc9f0] rounded-xs shadow-[0_0_8px_rgba(76,201,240,0.6)]"
                initial={{ width: 0 }}
                animate={{ width: `${mpPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* XP Bar */}
          <div>
            <div className="flex justify-between items-center text-[10px] font-pixel mb-1 text-[#06d6a0]">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> XP TO NEXT LEVEL
              </span>
              <span>
                {adventurer.xp} / {xpNeeded} ({xpPercent}%)
              </span>
            </div>
            <div className="w-full h-3.5 bg-[#051711] border border-[#06d6a0]/60 rounded-xs overflow-hidden p-0.5">
              <motion.div
                className="h-full bg-gradient-to-r from-[#007f5f] via-[#06d6a0] to-[#ffd166] rounded-xs shadow-[0_0_10px_rgba(6,214,160,0.8)]"
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>
        </div>

        {/* Right: Attribute Stat Chips */}
        <div className="lg:col-span-3 rpg-panel-dark p-2.5 rounded grid grid-cols-5 lg:grid-cols-2 xl:grid-cols-3 gap-1.5 text-center">
          <div className="bg-[#19152b] p-1 rounded border border-[#3b3355]" title="Intellect (Boosted by learning/reading quests)">
            <div className="text-[9px] font-pixel text-[#4cc9f0] flex items-center justify-center gap-0.5">
              <BookOpen className="w-2.5 h-2.5" /> INT
            </div>
            <div className="font-pixel text-xs text-white mt-0.5">{adventurer.statIntellect}</div>
          </div>

          <div className="bg-[#19152b] p-1 rounded border border-[#3b3355]" title="Strength (Boosted by fitness/exercise quests)">
            <div className="text-[9px] font-pixel text-[#ef476f] flex items-center justify-center gap-0.5">
              <Swords className="w-2.5 h-2.5" /> STR
            </div>
            <div className="font-pixel text-xs text-white mt-0.5">{adventurer.statStrength}</div>
          </div>

          <div className="bg-[#19152b] p-1 rounded border border-[#3b3355]" title="Discipline (Boosted by chore/focus quests)">
            <div className="text-[9px] font-pixel text-[#ffd166] flex items-center justify-center gap-0.5">
              <Shield className="w-2.5 h-2.5" /> DIS
            </div>
            <div className="font-pixel text-xs text-white mt-0.5">{adventurer.statDiscipline}</div>
          </div>

          <div className="bg-[#19152b] p-1 rounded border border-[#3b3355]" title="Creativity (Boosted by art/code/music quests)">
            <div className="text-[9px] font-pixel text-[#b5179e] flex items-center justify-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> CRE
            </div>
            <div className="font-pixel text-xs text-white mt-0.5">{adventurer.statCreativity}</div>
          </div>

          <div className="bg-[#19152b] p-1 rounded border border-[#3b3355]" title="Health/Vitality (Boosted by health/sleep/nutrition quests)">
            <div className="text-[9px] font-pixel text-[#06d6a0] flex items-center justify-center gap-0.5">
              <Heart className="w-2.5 h-2.5" /> VIT
            </div>
            <div className="font-pixel text-xs text-white mt-0.5">{adventurer.statHealth}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
