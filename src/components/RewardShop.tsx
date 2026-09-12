import React, { useState, useEffect } from 'react';
import { Reward, RewardRedemption } from '../types.ts';
import { sounds } from '../lib/soundEffects.ts';
import {
  Beer,
  Coins,
  Plus,
  Trash2,
  CheckCircle2,
  History,
  ShoppingBag,
  Sparkles,
  Coffee,
  Gamepad2,
  Moon,
  Gift,
  Cake,
  X,
  Clock,
} from 'lucide-react';
import { motion } from 'motion/react';

interface RewardShopProps {
  gold: number;
  rewards: Reward[];
  redemptions: RewardRedemption[];
  onPurchaseReward: (rewardId: number) => Promise<void>;
  onCreateReward: (rewardData: { title: string; description: string; cost: number; icon: string; category: string }) => Promise<void>;
  onDeleteReward: (rewardId: number) => Promise<void>;
  purchasingId: number | null;
}

export const RewardShop: React.FC<RewardShopProps> = ({
  gold,
  rewards,
  redemptions,
  onPurchaseReward,
  onCreateReward,
  onDeleteReward,
  purchasingId,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('40');
  const [icon, setIcon] = useState('gift');
  const [category, setCategory] = useState('custom');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRewardIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'gamepad-2':
      case 'gamepad':
        return Gamepad2;
      case 'coffee':
        return Coffee;
      case 'moon':
        return Moon;
      case 'cake':
        return Cake;
      default:
        return Gift;
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    const costNum = parseInt(cost, 10);
    if (isNaN(costNum) || costNum <= 0) {
      setError('Cost must be at least 1 Gold.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onCreateReward({
        title: title.trim(),
        description: description.trim(),
        cost: costNum,
        icon,
        category,
      });
      sounds.playClick();
      setShowCreateModal(false);
      setTitle('');
      setDescription('');
      setCost('40');
    } catch (err: any) {
      setError(err.message || 'Failed to create tavern reward.');
    } finally {
      setLoading(false);
    }
  };

  const filteredRewards = rewards.filter((r) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'custom') return r.isCustom;
    return r.category.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {/* Tavern Header Banner */}
      <div className="rpg-panel-gold p-5 sm:p-6 text-[#fffffe]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-14 h-14 rounded bg-[#2a1a0b] border-2 border-[#ffd166] flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(255,209,102,0.3)]">
              <span>🍺</span>
            </div>
            <div>
              <h2 className="font-pixel text-base sm:text-lg text-[#ffd166]">
                THE ADVENTURER'S TAVERN & REWARD SHOP
              </h2>
              <p className="font-retro text-xl text-[#06d6a0] mt-0.5">
                Convert your earned Gold into real-life guilt-free treats and rewards.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-pixel text-sm text-[#ffd166] bg-[#241a0e] px-3.5 py-2 rounded border-2 border-[#a87d2b] shadow">
              <Coins className="w-4 h-4 fill-[#ffd166]/40" />
              <span>{gold} GOLD</span>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                setShowCreateModal(true);
              }}
              className="rpg-btn-gold px-3 py-2 rounded font-pixel text-[10px] font-bold uppercase flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>CUSTOM REWARD</span>
            </button>
          </div>
        </div>

        {/* Filter Chips & History Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-5 pt-4 border-t border-[#a87d2b]/30">
          <div className="flex flex-wrap items-center gap-1.5 font-pixel text-[10px]">
            {['all', 'entertainment', 'treat', 'custom'].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  sounds.playClick();
                  setActiveFilter(filter);
                }}
                className={`px-2.5 py-1 rounded uppercase cursor-pointer transition-all ${
                  activeFilter === filter
                    ? 'bg-[#ffd166] text-[#12101b] font-bold border border-[#ffe89e]'
                    : 'bg-[#121018] text-[#a7a9be] hover:text-white border border-[#3b3355]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              setShowHistory(!showHistory);
            }}
            className="font-pixel text-[10px] text-[#06d6a0] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <History className="w-3.5 h-3.5" />
            <span>{showHistory ? 'HIDE REDEMPTIONS' : `REDEMPTION HISTORY (${redemptions.length})`}</span>
          </button>
        </div>
      </div>

      {/* Redemption History Drawer if toggled */}
      {showHistory && (
        <div className="rpg-panel p-5 text-[#fffffe] space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#3b3355]">
            <Clock className="w-4 h-4 text-[#06d6a0]" />
            <h3 className="font-pixel text-xs text-[#06d6a0]">
              RECENT TAVERN CLAIMS & REDEMPTIONS
            </h3>
          </div>

          {redemptions.length === 0 ? (
            <p className="text-xs font-retro text-lg text-[#a7a9be] py-2">
              No rewards redeemed yet. Slay quests to earn gold and treat yourself!
            </p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {redemptions.map((red) => (
                <div
                  key={red.id}
                  className="flex items-center justify-between p-2.5 rounded bg-[#100c19] border border-[#3b3355] text-xs font-pixel-sans"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#06d6a0]" />
                    <div>
                      <span className="font-pixel text-xs text-white">{red.rewardTitle}</span>
                      <span className="text-[10px] text-[#a7a9be] block font-retro text-base">
                        {new Date(red.redeemedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <span className="font-pixel text-xs text-[#ffd166] bg-[#241a0e] px-2 py-0.5 rounded border border-[#a87d2b]">
                    -{red.cost} G
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRewards.map((reward) => {
          const IconComponent = getRewardIcon(reward.icon);
          const canAfford = gold >= reward.cost;
          const isPurchasing = purchasingId === reward.id;

          return (
            <motion.div
              layout
              key={reward.id}
              className={`rpg-panel p-4 flex flex-col justify-between transition-all ${
                canAfford
                  ? 'hover:border-[#ffd166]/60 hover:shadow-[0_0_12px_rgba(255,209,102,0.15)]'
                  : 'opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-9 h-9 rounded bg-[#20172e] border border-[#ffd166]/40 flex items-center justify-center text-[#ffd166]">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1 font-pixel text-xs text-[#ffd166] bg-[#241a0e] px-2.5 py-1 rounded border border-[#a87d2b]">
                    <Coins className="w-3.5 h-3.5 fill-[#ffd166]/30" />
                    <span>{reward.cost} G</span>
                  </div>
                </div>

                <h3 className="font-pixel text-xs text-[#fffffe] mb-1">
                  {reward.title}
                </h3>

                {reward.description && (
                  <p className="font-pixel-sans text-xs text-[#a7a9be] mb-4">
                    {reward.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-[#2b253b] flex items-center justify-between gap-2 mt-auto">
                {reward.isCustom && (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onDeleteReward(reward.id);
                    }}
                    className="p-1 text-[#a7a9be] hover:text-[#ef476f] cursor-pointer"
                    title="Delete Custom Reward"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  disabled={!canAfford || isPurchasing}
                  onClick={() => {
                    sounds.playPurchase();
                    onPurchaseReward(reward.id);
                  }}
                  className={`ml-auto font-pixel text-[10px] px-3.5 py-2 rounded flex items-center gap-1 font-bold cursor-pointer transition-all ${
                    canAfford
                      ? 'rpg-btn-gold text-[#12101b] hover:scale-102'
                      : 'bg-[#1a1625] text-[#a7a9be] border border-[#3b3355] cursor-not-allowed opacity-60'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>
                    {isPurchasing
                      ? 'PURCHASING...'
                      : canAfford
                      ? 'REDEEM REWARD'
                      : `NEED ${reward.cost - gold} MORE G`}
                  </span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal to Create Custom Reward */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md rpg-panel-gold p-5 text-[#fffffe] relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#a87d2b]/40 mb-4">
              <h3 className="font-pixel text-xs sm:text-sm text-[#ffd166]">
                ADD REAL-LIFE REWARD
              </h3>
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowCreateModal(false);
                }}
                className="text-[#a7a9be] hover:text-[#ef476f]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="mb-3 p-2 rounded bg-[#3a0812] border border-[#ef476f] text-xs font-pixel text-[#ef476f]">
                {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-3 font-pixel-sans text-xs">
              <div>
                <label className="block font-pixel text-[9px] text-[#ffd166] uppercase mb-1">
                  Reward Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1 Episode of Anime, Gourmet Coffee, 30m Piano Play..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 rounded bg-[#100c19] border-2 border-[#3b3355] text-white focus:border-[#ffd166] outline-hidden text-sm"
                />
              </div>

              <div>
                <label className="block font-pixel text-[9px] text-[#a7a9be] uppercase mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="What makes this reward awesome?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 rounded bg-[#100c19] border-2 border-[#3b3355] text-white focus:border-[#ffd166] outline-hidden text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-pixel text-[9px] text-[#ffd166] uppercase mb-1">
                    Gold Cost *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full p-2 rounded bg-[#100c19] border-2 border-[#3b3355] text-[#ffd166] font-pixel text-sm focus:border-[#ffd166] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-pixel text-[9px] text-[#a7a9be] uppercase mb-1">
                    Icon Theme
                  </label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full p-2 rounded bg-[#100c19] border-2 border-[#3b3355] text-white focus:border-[#ffd166] outline-hidden"
                  >
                    <option value="gift">Gift Box 🎁</option>
                    <option value="gamepad">Gaming 🎮</option>
                    <option value="coffee">Coffee ☕</option>
                    <option value="cake">Sweet Snack 🍰</option>
                    <option value="moon">Rest / Nap 🌙</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-2 rpg-panel-dark text-[#a7a9be] font-pixel text-[9px]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rpg-btn-gold px-4 py-2 font-pixel text-xs font-bold uppercase"
                >
                  {loading ? 'CREATING...' : 'ESTABLISH REWARD'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
