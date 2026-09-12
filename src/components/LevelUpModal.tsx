import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, ArrowUp, Heart, Zap, Shield, Flame } from 'lucide-react';
import { sounds } from '../lib/soundEffects.ts';

interface LevelUpModalProps {
  isOpen: boolean;
  level: number;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ isOpen, level, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      sounds.playLevelUp();
      // Confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ffd166', '#06d6a0', '#118ab2', '#ef476f', '#ffbe0b'],
        });
      } catch (e) {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="w-full max-w-md rpg-panel-gold p-6 text-center text-[#fffffe] relative overflow-hidden"
        >
          {/* Header Banner */}
          <div className="mb-4 flex flex-col items-center">
            <motion.div
              animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              className="w-16 h-16 rounded-full bg-[#ffd166]/20 border-2 border-[#ffd166] flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(255,209,102,0.5)]"
            >
              <Trophy className="w-9 h-9 text-[#ffd166]" />
            </motion.div>
            <h2 className="font-pixel text-xl sm:text-2xl text-[#ffd166] tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              LEVEL UP!
            </h2>
            <p className="font-retro text-2xl text-[#06d6a0] mt-1">
              You reached Level {level}!
            </p>
          </div>

          {/* Stat Boosts Unlocked */}
          <div className="rpg-panel-dark p-4 mb-5 text-left space-y-2 text-sm font-pixel-sans border border-[#a87d2b]/40">
            <div className="text-xs font-pixel text-[#ffbe0b] uppercase tracking-wider mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Character Growth
            </div>
            <div className="flex items-center justify-between text-xs text-[#fffffe]">
              <span className="flex items-center gap-1.5 text-[#ef476f]">
                <Heart className="w-4 h-4" /> Max Health (HP)
              </span>
              <span className="font-pixel text-[#06d6a0] flex items-center gap-1">
                +10 HP <ArrowUp className="w-3 h-3" />
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#fffffe]">
              <span className="flex items-center gap-1.5 text-[#118ab2]">
                <Zap className="w-4 h-4" /> Max Mana (MP)
              </span>
              <span className="font-pixel text-[#06d6a0] flex items-center gap-1">
                +5 MP <ArrowUp className="w-3 h-3" />
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#fffffe]">
              <span className="flex items-center gap-1.5 text-[#ffd166]">
                <Shield className="w-4 h-4" /> Core Attributes
              </span>
              <span className="font-pixel text-[#06d6a0] flex items-center gap-1">
                +1 to All Stats <ArrowUp className="w-3 h-3" />
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#fffffe]">
              <span className="flex items-center gap-1.5 text-[#06d6a0]">
                <Flame className="w-4 h-4" /> Health & Mana
              </span>
              <span className="font-pixel text-[#ffd166]">FULL RESTORE</span>
            </div>
          </div>

          <p className="text-xs text-[#a7a9be] mb-5 font-retro text-lg">
            Your real-world accomplishments forge an unstoppable champion.
          </p>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-full py-3 px-4 rpg-btn-gold font-pixel text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            CLAIM VICTORY & CONTINUE
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
