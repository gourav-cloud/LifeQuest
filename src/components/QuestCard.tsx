import React from 'react';
import { Quest, QuestCategory } from '../types.ts';
import { sounds } from '../lib/soundEffects.ts';
import {
  BookOpen,
  Swords,
  Target,
  Sparkles,
  Heart,
  CheckCircle2,
  Trash2,
  Edit2,
  Coins,
  Calendar,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';

interface QuestCardProps {
  quest: Quest;
  onComplete: (questId: number) => void;
  onEdit: (quest: Quest) => void;
  onDelete: (questId: number) => void;
  completing?: boolean;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  onComplete,
  onEdit,
  onDelete,
  completing,
}) => {
  const isCompleted = quest.status === 'completed';

  const getCategoryConfig = (cat: QuestCategory) => {
    switch (cat.toLowerCase()) {
      case 'intellect':
        return {
          icon: BookOpen,
          name: 'Intellect',
          textColor: 'text-[#4cc9f0]',
          borderColor: 'border-[#4cc9f0]/40',
          bgColor: 'bg-[#0b2533]',
          stat: '+2 INT',
        };
      case 'strength':
        return {
          icon: Swords,
          name: 'Strength',
          textColor: 'text-[#ef476f]',
          borderColor: 'border-[#ef476f]/40',
          bgColor: 'bg-[#290a14]',
          stat: '+2 STR',
        };
      case 'discipline':
        return {
          icon: Target,
          name: 'Discipline',
          textColor: 'text-[#ffd166]',
          borderColor: 'border-[#ffd166]/40',
          bgColor: 'bg-[#2c2009]',
          stat: '+2 DIS',
        };
      case 'creativity':
        return {
          icon: Sparkles,
          name: 'Creativity',
          textColor: 'text-[#b5179e]',
          borderColor: 'border-[#b5179e]/40',
          bgColor: 'bg-[#280929]',
          stat: '+2 CRE',
        };
      case 'health':
        return {
          icon: Heart,
          name: 'Health',
          textColor: 'text-[#06d6a0]',
          borderColor: 'border-[#06d6a0]/40',
          bgColor: 'bg-[#082920]',
          stat: '+2 VIT & HP',
        };
      default:
        return {
          icon: Zap,
          name: 'General',
          textColor: 'text-[#fffffe]',
          borderColor: 'border-[#3b3355]',
          bgColor: 'bg-[#1a1625]',
          stat: '+2 XP',
        };
    }
  };

  const catConfig = getCategoryConfig(quest.category);
  const CategoryIcon = catConfig.icon;

  const getDifficultyBadge = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy':
        return { label: 'RANK E (EASY)', color: 'text-[#06d6a0] border-[#06d6a0]/40' };
      case 'medium':
        return { label: 'RANK C (MEDIUM)', color: 'text-[#ffd166] border-[#ffd166]/40' };
      case 'hard':
        return { label: 'RANK A (HARD)', color: 'text-[#ff5400] border-[#ff5400]/40' };
      case 'epic':
        return { label: 'RANK S (EPIC)', color: 'text-[#ef476f] border-[#ef476f]/60 bg-[#ef476f]/10' };
      default:
        return { label: 'STANDARD', color: 'text-[#a7a9be] border-[#3b3355]' };
    }
  };

  const diffConfig = getDifficultyBadge(quest.difficulty);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`relative rpg-panel p-4 transition-all duration-200 ${
        isCompleted
          ? 'opacity-65 bg-[#120f1c] border-[#2d2740]'
          : 'hover:border-[#ffd166]/60 hover:shadow-[0_0_15px_rgba(255,209,102,0.15)]'
      }`}
    >
      {/* Top Tag Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          {/* Category Chip */}
          <span
            className={`font-pixel text-[9px] px-2 py-1 rounded border flex items-center gap-1 uppercase tracking-wider ${catConfig.bgColor} ${catConfig.textColor} ${catConfig.borderColor}`}
          >
            <CategoryIcon className="w-3 h-3" />
            <span>{catConfig.name}</span>
          </span>

          {/* Difficulty Chip */}
          <span
            className={`font-pixel text-[8px] px-1.5 py-0.5 rounded border ${diffConfig.color}`}
          >
            {diffConfig.label}
          </span>
        </div>

        {/* Due Date or Status */}
        {quest.dueDate && !isCompleted && (
          <span className="flex items-center gap-1 font-retro text-sm text-[#ffd166] bg-[#241a0e] px-2 py-0.5 rounded border border-[#a87d2b]/40">
            <Calendar className="w-3 h-3" />
            <span>{quest.dueDate}</span>
          </span>
        )}

        {isCompleted && (
          <span className="font-pixel text-[9px] text-[#06d6a0] bg-[#0c2e26] border border-[#06d6a0]/50 px-2 py-0.5 rounded flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> CONQUERED
          </span>
        )}
      </div>

      {/* Quest Title & Description */}
      <h3
        className={`font-pixel text-xs sm:text-sm tracking-wide mb-1.5 leading-relaxed ${
          isCompleted ? 'line-through text-[#a7a9be]' : 'text-[#fffffe]'
        }`}
      >
        {quest.title}
      </h3>

      {quest.description && (
        <p className="font-pixel-sans text-xs text-[#a7a9be] mb-3 line-clamp-2 leading-relaxed">
          {quest.description}
        </p>
      )}

      {/* Rewards Pill & Stat Affinity */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-[#2b253b]">
        <div className="flex items-center gap-2">
          {/* XP Bounty */}
          <span className="font-pixel text-[10px] text-[#06d6a0] bg-[#07241c] border border-[#06d6a0]/40 px-2 py-1 rounded flex items-center gap-1">
            <Zap className="w-3 h-3" /> +{quest.xpReward} XP
          </span>

          {/* Gold Bounty */}
          <span className="font-pixel text-[10px] text-[#ffd166] bg-[#241a0e] border border-[#a87d2b] px-2 py-1 rounded flex items-center gap-1">
            <Coins className="w-3 h-3 fill-[#ffd166]/30" /> +{quest.goldReward} G
          </span>

          {/* Stat Boost Preview */}
          <span className={`font-pixel text-[9px] px-1.5 py-0.5 rounded ${catConfig.textColor} opacity-80 hidden sm:inline-block`}>
            {catConfig.stat}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {!isCompleted ? (
            <>
              <button
                onClick={() => {
                  sounds.playClick();
                  onEdit(quest);
                }}
                className="p-1.5 text-[#a7a9be] hover:text-[#ffd166] hover:bg-[#201b30] rounded cursor-pointer"
                title="Edit Quest"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onDelete(quest.id);
                }}
                className="p-1.5 text-[#a7a9be] hover:text-[#ef476f] hover:bg-[#201b30] rounded cursor-pointer"
                title="Abandon Quest"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                disabled={completing}
                onClick={() => {
                  sounds.playQuestComplete();
                  onComplete(quest.id);
                }}
                className="rpg-btn-gold font-pixel text-[10px] px-3 py-1.5 rounded flex items-center gap-1 font-bold cursor-pointer hover:scale-103 active:scale-97 transition-transform disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{completing ? 'SLAYING...' : 'COMPLETE'}</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                sounds.playClick();
                onDelete(quest.id);
              }}
              className="p-1 text-[#a7a9be] hover:text-[#ef476f] rounded cursor-pointer"
              title="Remove from Quest Log"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
