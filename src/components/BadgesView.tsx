import React from 'react';
import { Badge } from '../types.ts';
import {
  Trophy,
  Lock,
  CheckCircle2,
  Sparkles,
  Flame,
  Swords,
  BookOpen,
  Target,
  Heart,
  Coins,
  Beer,
  Award,
  Compass,
  Map,
  Shield,
  Crown,
  Zap,
} from 'lucide-react';

interface BadgesViewProps {
  badges: Badge[];
  totalUnlocked: number;
  totalAvailable: number;
}

export const BadgesView: React.FC<BadgesViewProps> = ({
  badges,
  totalUnlocked,
  totalAvailable,
}) => {
  const getBadgeIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'compass':
        return Compass;
      case 'map':
        return Map;
      case 'shield':
        return Shield;
      case 'crown':
        return Crown;
      case 'flame':
        return Flame;
      case 'zap':
        return Zap;
      case 'book-open':
        return BookOpen;
      case 'swords':
        return Swords;
      case 'target':
        return Target;
      case 'sparkles':
        return Sparkles;
      case 'heart':
        return Heart;
      case 'coins':
        return Coins;
      case 'beer':
        return Beer;
      case 'award':
        return Award;
      default:
        return Trophy;
    }
  };

  const progressPercent = Math.round((totalUnlocked / Math.max(1, totalAvailable)) * 100);

  return (
    <div className="space-y-6">
      {/* Hall of Fame Banner */}
      <div className="rpg-panel-gold p-5 sm:p-6 text-[#fffffe]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-14 h-14 rounded bg-[#2a1a0b] border-2 border-[#ffd166] flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(255,209,102,0.3)]">
              <span>🏆</span>
            </div>
            <div>
              <h2 className="font-pixel text-base sm:text-lg text-[#ffd166]">
                HALL OF FAME & ACHIEVEMENTS
              </h2>
              <p className="font-retro text-xl text-[#06d6a0] mt-0.5">
                Proof of your deeds inscribed into the eternal annals of the guild.
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="font-pixel text-sm text-[#ffd166]">
              {totalUnlocked} / {totalAvailable} UNLOCKED
            </div>
            <div className="w-36 h-3 bg-[#100c19] border border-[#a87d2b] rounded-xs overflow-hidden mt-1.5 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#ffd166] to-[#06d6a0] rounded-xs"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {badges.map((badge) => {
          const IconComponent = getBadgeIcon(badge.icon);

          return (
            <div
              key={badge.key}
              className={`p-4 rounded transition-all duration-200 ${
                badge.unlocked
                  ? 'rpg-panel border-[#ffd166]/80 shadow-[0_0_15px_rgba(255,209,102,0.15)] bg-gradient-to-b from-[#1f192b] to-[#120f1c]'
                  : 'rpg-panel-dark opacity-60 border-[#2d2740]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-11 h-11 rounded flex items-center justify-center border-2 ${
                    badge.unlocked
                      ? 'bg-[#2a1d0f] border-[#ffd166] text-[#ffd166] shadow-[0_0_10px_rgba(255,209,102,0.4)]'
                      : 'bg-[#100c19] border-[#3b3355] text-[#a7a9be]'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>

                {badge.unlocked ? (
                  <span className="font-pixel text-[9px] text-[#06d6a0] bg-[#0c2e26] border border-[#06d6a0]/50 px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> UNLOCKED
                  </span>
                ) : (
                  <span className="font-pixel text-[9px] text-[#a7a9be] bg-[#121018] border border-[#3b3355] px-2 py-0.5 rounded flex items-center gap-1">
                    <Lock className="w-3 h-3" /> LOCKED
                  </span>
                )}
              </div>

              <h4
                className={`font-pixel text-xs mb-1 ${
                  badge.unlocked ? 'text-[#ffd166]' : 'text-[#fffffe]'
                }`}
              >
                {badge.title}
              </h4>

              <p className="font-pixel-sans text-xs text-[#a7a9be] leading-relaxed mb-2">
                {badge.description}
              </p>

              {badge.unlocked && badge.unlockedAt && (
                <div className="pt-2 border-t border-[#2b253b] text-[10px] font-retro text-[#06d6a0]">
                  Claimed: {new Date(badge.unlockedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
