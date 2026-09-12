import React, { useState, useEffect } from 'react';
import { Quest, QuestCategory, QuestDifficulty } from '../types.ts';
import { sounds } from '../lib/soundEffects.ts';
import {
  X,
  Swords,
  BookOpen,
  Target,
  Sparkles,
  Heart,
  Coins,
  Zap,
  Calendar,
  ShieldAlert,
} from 'lucide-react';

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (questData: Partial<Quest>) => Promise<void>;
  editQuest?: Quest | null;
}

export const QuestModal: React.FC<QuestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editQuest,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<QuestCategory>('discipline');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('medium');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editQuest) {
      setTitle(editQuest.title);
      setDescription(editQuest.description || '');
      setCategory(editQuest.category);
      setDifficulty(editQuest.difficulty);
      setDueDate(editQuest.dueDate || '');
    } else {
      setTitle('');
      setDescription('');
      setCategory('discipline');
      setDifficulty('medium');
      setDueDate('');
    }
    setError(null);
  }, [editQuest, isOpen]);

  if (!isOpen) return null;

  // Reward calculations
  const getRewardPreview = (diff: QuestDifficulty) => {
    switch (diff) {
      case 'easy':
        return { xp: 30, gold: 12 };
      case 'medium':
        return { xp: 55, gold: 22 };
      case 'hard':
        return { xp: 95, gold: 45 };
      case 'epic':
        return { xp: 180, gold: 85 };
    }
  };

  const preview = getRewardPreview(difficulty);

  const categories: Array<{ id: QuestCategory; label: string; icon: any; color: string; stat: string }> = [
    { id: 'intellect', label: 'Intellect', icon: BookOpen, color: 'text-[#4cc9f0] border-[#4cc9f0]', stat: '+2 INT' },
    { id: 'strength', label: 'Strength', icon: Swords, color: 'text-[#ef476f] border-[#ef476f]', stat: '+2 STR' },
    { id: 'discipline', label: 'Discipline', icon: Target, color: 'text-[#ffd166] border-[#ffd166]', stat: '+2 DIS' },
    { id: 'creativity', label: 'Creativity', icon: Sparkles, color: 'text-[#b5179e] border-[#b5179e]', stat: '+2 CRE' },
    { id: 'health', label: 'Health', icon: Heart, color: 'text-[#06d6a0] border-[#06d6a0]', stat: '+2 VIT' },
  ];

  const difficulties: Array<{ id: QuestDifficulty; label: string; desc: string }> = [
    { id: 'easy', label: 'E - Minor Task', desc: '10-20 min quick task' },
    { id: 'medium', label: 'C - Standard Quest', desc: '30-60 min focused effort' },
    { id: 'hard', label: 'A - Major Trial', desc: '1-3 hours deep focus' },
    { id: 'epic', label: 'S - Epic Boss Task', desc: 'Massive milestone' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Quest title cannot be empty!');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        category,
        difficulty,
        dueDate: dueDate || null,
      });
      sounds.playClick();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to record quest.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="w-full max-w-lg rpg-panel-gold p-5 sm:p-6 text-[#fffffe] relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#a87d2b]/40 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <h2 className="font-pixel text-sm sm:text-base text-[#ffd166]">
              {editQuest ? 'EDIT QUEST CONTRACT' : 'COMMISSION NEW QUEST'}
            </h2>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1 rounded text-[#a7a9be] hover:text-[#ef476f] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded bg-[#3a0812] border border-[#ef476f] text-xs font-pixel text-[#ef476f] flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-pixel-sans">
          {/* Title */}
          <div>
            <label className="block font-pixel text-[10px] text-[#ffd166] uppercase mb-1">
              Quest Name / Objective *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Slay the Chapter 4 Tome, 50 Pushups, Fix Production Bug..."
              className="w-full p-2.5 rounded bg-[#100c19] border-2 border-[#3b3355] text-[#fffffe] focus:border-[#ffd166] outline-hidden font-pixel-sans text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-pixel text-[10px] text-[#a7a9be] uppercase mb-1">
              Quest Briefing / Details (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key notes, steps, or lore for this undertaking..."
              className="w-full p-2.5 rounded bg-[#100c19] border-2 border-[#3b3355] text-[#fffffe] focus:border-[#ffd166] outline-hidden font-pixel-sans text-sm"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block font-pixel text-[10px] text-[#ffd166] uppercase mb-1.5">
              Discipline / Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setCategory(cat.id);
                    }}
                    className={`p-2 rounded border text-left flex items-center gap-2 cursor-pointer transition-all ${
                      isSelected
                        ? `bg-[#241d33] ${cat.color} font-bold shadow-[0_0_8px_rgba(255,209,102,0.3)]`
                        : 'bg-[#100c19] border-[#3b3355] text-[#a7a9be] hover:bg-[#1a1529]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <div>
                      <div className="font-pixel text-[9px]">{cat.label}</div>
                      <div className="font-pixel text-[8px] opacity-70">{cat.stat}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div>
            <label className="block font-pixel text-[10px] text-[#ffd166] uppercase mb-1.5">
              Difficulty Rank
            </label>
            <div className="grid grid-cols-2 gap-2">
              {difficulties.map((diff) => {
                const isSelected = difficulty === diff.id;
                return (
                  <button
                    key={diff.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setDifficulty(diff.id);
                    }}
                    className={`p-2 rounded border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#2a1d0f] border-[#ffd166] text-[#ffd166] shadow-[0_0_8px_rgba(255,209,102,0.2)]'
                        : 'bg-[#100c19] border-[#3b3355] text-[#a7a9be] hover:bg-[#1a1529]'
                    }`}
                  >
                    <div className="font-pixel text-[10px] font-bold">{diff.label}</div>
                    <div className="text-[11px] font-retro text-[#a7a9be] mt-0.5">{diff.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block font-pixel text-[10px] text-[#a7a9be] uppercase mb-1">
              Due Date (Optional)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 rounded bg-[#100c19] border-2 border-[#3b3355] text-[#fffffe] focus:border-[#ffd166] outline-hidden font-retro text-lg"
              />
              {dueDate && (
                <button
                  type="button"
                  onClick={() => setDueDate('')}
                  className="px-2 py-1 text-xs text-[#ef476f] hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Bounty Preview */}
          <div className="rpg-panel-dark p-3 rounded flex items-center justify-between border border-[#a87d2b]/40">
            <span className="font-pixel text-[10px] text-[#a7a9be] uppercase">
              Bounty on Completion:
            </span>
            <div className="flex items-center gap-3">
              <span className="font-pixel text-xs text-[#06d6a0] flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> +{preview.xp} XP
              </span>
              <span className="font-pixel text-xs text-[#ffd166] flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 fill-[#ffd166]/30" /> +{preview.gold} Gold
              </span>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="w-1/3 py-2.5 px-3 rpg-panel-dark text-[#a7a9be] font-pixel text-[10px] uppercase cursor-pointer hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 py-2.5 px-3 rpg-btn-gold font-pixel text-xs uppercase font-bold cursor-pointer disabled:opacity-50"
            >
              {loading ? 'SCRIBING...' : editQuest ? 'UPDATE QUEST' : 'INSCRIBE QUEST'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
