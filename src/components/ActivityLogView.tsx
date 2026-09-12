import React, { useState } from 'react';
import { ActivityLog } from '../types.ts';
import {
  History,
  CheckCircle2,
  Trophy,
  Beer,
  Sparkles,
  PlusCircle,
  Coins,
  Zap,
  Clock,
  Filter,
} from 'lucide-react';

interface ActivityLogViewProps {
  logs: ActivityLog[];
}

export const ActivityLogView: React.FC<ActivityLogViewProps> = ({ logs }) => {
  const [filter, setFilter] = useState('all');

  const getActionConfig = (actionType: string) => {
    switch (actionType) {
      case 'quest_completed':
        return {
          icon: CheckCircle2,
          color: 'text-[#06d6a0]',
          borderColor: 'border-[#06d6a0]/40',
          bg: 'bg-[#0a261f]',
          label: 'VICTORY',
        };
      case 'level_up':
        return {
          icon: Sparkles,
          color: 'text-[#ffd166]',
          borderColor: 'border-[#ffd166]/60',
          bg: 'bg-[#2b1f0d]',
          label: 'LEVEL UP',
        };
      case 'badge_unlocked':
        return {
          icon: Trophy,
          color: 'text-[#b5179e]',
          borderColor: 'border-[#b5179e]/50',
          bg: 'bg-[#2b0c2b]',
          label: 'ACHIEVEMENT',
        };
      case 'reward_purchased':
        return {
          icon: Beer,
          color: 'text-[#ffb703]',
          borderColor: 'border-[#ffb703]/50',
          bg: 'bg-[#261706]',
          label: 'TAVERN CLAIM',
        };
      default:
        return {
          icon: PlusCircle,
          color: 'text-[#4cc9f0]',
          borderColor: 'border-[#4cc9f0]/40',
          bg: 'bg-[#091f2b]',
          label: 'COMMISSION',
        };
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.actionType === filter;
  });

  return (
    <div className="space-y-6">
      {/* Chronicles Header */}
      <div className="rpg-panel-gold p-5 sm:p-6 text-[#fffffe]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-14 h-14 rounded bg-[#2a1a0b] border-2 border-[#ffd166] flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(255,209,102,0.3)]">
              <span>📖</span>
            </div>
            <div>
              <h2 className="font-pixel text-base sm:text-lg text-[#ffd166]">
                THE CHRONICLES OF LIFEQUEST
              </h2>
              <p className="font-retro text-xl text-[#06d6a0] mt-0.5">
                Every battle fought, reward claimed, and milestone achieved.
              </p>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap items-center gap-1.5 font-pixel text-[10px]">
            {[
              { id: 'all', label: 'All' },
              { id: 'quest_completed', label: 'Victories' },
              { id: 'level_up', label: 'Level Ups' },
              { id: 'reward_purchased', label: 'Tavern' },
              { id: 'badge_unlocked', label: 'Medals' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-2.5 py-1 rounded uppercase cursor-pointer transition-all ${
                  filter === f.id
                    ? 'bg-[#ffd166] text-[#12101b] font-bold border border-[#ffe89e]'
                    : 'bg-[#121018] text-[#a7a9be] hover:text-white border border-[#3b3355]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline list */}
      <div className="rpg-panel p-5 space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-10 text-[#a7a9be]">
            <History className="w-8 h-8 mx-auto mb-2 opacity-50 text-[#ffd166]" />
            <p className="font-pixel text-xs">NO CHRONICLES INSCRIBED YET</p>
            <p className="font-retro text-lg mt-1">Conquer tasks from the Quest Board to make history.</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-[#3b3355] ml-4 sm:ml-6 pl-4 sm:pl-6 space-y-4">
            {filteredLogs.map((log) => {
              const conf = getActionConfig(log.actionType);
              const Icon = conf.icon;

              return (
                <div key={log.id} className="relative group">
                  {/* Timeline node icon */}
                  <div
                    className={`absolute -left-[27px] sm:-left-[35px] top-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center ${conf.bg} ${conf.color} ${conf.borderColor} shadow`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>

                  {/* Card */}
                  <div className="rpg-panel-dark p-3 sm:p-4 rounded border border-[#2b253b] hover:border-[#ffd166]/40 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <span
                        className={`font-pixel text-[9px] px-2 py-0.5 rounded border uppercase ${conf.bg} ${conf.color} ${conf.borderColor}`}
                      >
                        {conf.label}
                      </span>

                      <span className="font-retro text-sm text-[#a7a9be] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className="font-pixel-sans text-xs text-[#fffffe] leading-relaxed">
                      {log.description}
                    </p>

                    {/* Reward chips */}
                    {(log.xpGained > 0 || log.goldGained !== 0) && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#231e33]">
                        {log.xpGained > 0 && (
                          <span className="font-pixel text-[9px] text-[#06d6a0] flex items-center gap-1">
                            <Zap className="w-3 h-3" /> +{log.xpGained} XP
                          </span>
                        )}
                        {log.goldGained > 0 && (
                          <span className="font-pixel text-[9px] text-[#ffd166] flex items-center gap-1">
                            <Coins className="w-3 h-3" /> +{log.goldGained} Gold
                          </span>
                        )}
                        {log.goldGained < 0 && (
                          <span className="font-pixel text-[9px] text-[#ef476f] flex items-center gap-1">
                            <Coins className="w-3 h-3" /> {log.goldGained} Gold
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
