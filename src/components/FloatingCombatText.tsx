import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface FloatingTextItem {
  id: string;
  text: string;
  type: 'xp' | 'gold' | 'streak' | 'levelup' | 'info';
}

interface FloatingCombatTextProps {
  items: FloatingTextItem[];
}

export const FloatingCombatText: React.FC<FloatingCombatTextProps> = ({ items }) => {
  return (
    <div className="fixed top-24 right-6 pointer-events-none z-50 flex flex-col gap-2">
      <AnimatePresence>
        {items.map((item) => {
          let colorClass = 'text-[#ffd166] border-[#ffd166]';
          let prefix = '';

          if (item.type === 'xp') {
            colorClass = 'text-[#06d6a0] border-[#06d6a0] bg-[#0c2e26]/90';
            prefix = '⚡ ';
          } else if (item.type === 'gold') {
            colorClass = 'text-[#ffb703] border-[#ffb703] bg-[#3a2807]/90';
            prefix = '🪙 ';
          } else if (item.type === 'streak') {
            colorClass = 'text-[#ff5400] border-[#ff5400] bg-[#3a1505]/90';
            prefix = '🔥 ';
          } else if (item.type === 'levelup') {
            colorClass = 'text-[#f72585] border-[#f72585] bg-[#36081e]/90';
            prefix = '👑 ';
          } else {
            colorClass = 'text-[#4cc9f0] border-[#4cc9f0] bg-[#082836]/90';
          }

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -25, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className={`font-pixel text-xs px-3 py-2 border-2 rounded shadow-lg flex items-center gap-1 tracking-wider ${colorClass}`}
            >
              <span>{prefix}</span>
              <span>{item.text}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
