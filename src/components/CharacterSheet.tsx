import React, { useState } from 'react';
import { Adventurer } from '../types.ts';
import { sounds } from '../lib/soundEffects.ts';
import {
  User,
  Shield,
  Swords,
  BookOpen,
  Sparkles,
  Heart,
  Target,
  Trophy,
  Flame,
  Coins,
  CheckCircle2,
  Save,
  Check,
} from 'lucide-react';

interface CharacterSheetProps {
  adventurer: Adventurer;
  onUpdateAdventurer: (data: { displayName?: string; characterClass?: string; avatar?: string }) => Promise<void>;
}

export const CharacterSheet: React.FC<CharacterSheetProps> = ({
  adventurer,
  onUpdateAdventurer,
}) => {
  const [displayName, setDisplayName] = useState(adventurer.displayName);
  const [characterClass, setCharacterClass] = useState(adventurer.characterClass);
  const [avatar, setAvatar] = useState(adventurer.avatar);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const classes = [
    { name: 'Warrior', role: 'Frontline physical combatant, thrives on intense strength training and relentless discipline.', icon: '⚔️' },
    { name: 'Mage', role: 'Arcane researcher of ancient lore, fueled by heavy intellectual reading and deep study.', icon: '🧙‍♂️' },
    { name: 'Rogue', role: 'Agile operative of stealth and swift execution, focused on productivity and high output.', icon: '🥷' },
    { name: 'Paladin', role: 'Righteous guardian of vitality and order, balancing health habits with rock-solid discipline.', icon: '🛡️' },
    { name: 'Bard', role: 'Inspiring artisan of words, music, and art, powered by creative design and expression.', icon: '🪕' },
    { name: 'Alchemist', role: 'Master of experimental formulas, nutrition, potions, and transformative workflows.', icon: '🧪' },
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onUpdateAdventurer({ displayName, characterClass, avatar });
      sounds.playClick();
      setIsEditing(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const maxStatValue = Math.max(
    adventurer.statIntellect,
    adventurer.statStrength,
    adventurer.statDiscipline,
    adventurer.statCreativity,
    adventurer.statHealth,
    30
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="rpg-panel-gold p-5 sm:p-6 text-[#fffffe] relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-20 h-20 rounded bg-[#100d1c] border-3 border-[#ffd166] flex items-center justify-center text-4xl shadow-[0_0_15px_rgba(255,209,102,0.4)]">
              <span>{classes.find((c) => c.name.toLowerCase() === adventurer.characterClass.toLowerCase())?.icon || '⚔️'}</span>
            </div>
            <div>
              <h2 className="font-pixel text-lg sm:text-xl text-[#ffd166]">
                {adventurer.displayName}
              </h2>
              <p className="font-retro text-2xl text-[#06d6a0] mt-0.5">
                Level {adventurer.level} {adventurer.characterClass}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="font-pixel text-[9px] px-2 py-0.5 rounded bg-[#241a0e] text-[#ffd166] border border-[#a87d2b]">
                  {adventurer.gold} Gold In Purse
                </span>
                <span className="font-pixel text-[9px] px-2 py-0.5 rounded bg-[#2b1008] text-[#ff5400] border border-[#ff5400]/40">
                  {adventurer.currentStreak} Day Streak
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              setIsEditing(!isEditing);
            }}
            className="rpg-btn px-3 py-2 rounded font-pixel text-[10px] text-[#ffd166] border border-[#ffd166]/60 cursor-pointer hover:bg-[#282138]"
          >
            {isEditing ? 'CANCEL EDIT' : 'RENAME / RECLASS'}
          </button>
        </div>

        {savedSuccess && (
          <div className="mt-4 p-2 bg-[#0c2e26] border border-[#06d6a0] rounded text-xs font-pixel text-[#06d6a0] flex items-center gap-2">
            <Check className="w-4 h-4" /> Character details updated successfully!
          </div>
        )}

        {/* Edit Form Drawer */}
        {isEditing && (
          <form onSubmit={handleSave} className="mt-5 pt-4 border-t-2 border-[#a87d2b]/40 space-y-4 font-pixel-sans">
            <div>
              <label className="block font-pixel text-[10px] text-[#ffd166] uppercase mb-1">
                Hero Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full p-2 rounded bg-[#100c19] border-2 border-[#3b3355] text-white focus:border-[#ffd166] outline-hidden text-sm"
              />
            </div>

            <div>
              <label className="block font-pixel text-[10px] text-[#ffd166] uppercase mb-1">
                Select Class & Affinity
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {classes.map((c) => {
                  const isSelected = characterClass.toLowerCase() === c.name.toLowerCase();
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setCharacterClass(c.name);
                      }}
                      className={`p-2.5 rounded border text-left flex items-start gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-[#2b1f3d] border-[#ffd166] text-[#ffd166] shadow'
                          : 'bg-[#100c19] border-[#3b3355] text-[#a7a9be] hover:bg-[#1a1529]'
                      }`}
                    >
                      <span className="text-xl">{c.icon}</span>
                      <div>
                        <div className="font-pixel text-[10px] font-bold">{c.name}</div>
                        <div className="text-[10px] text-[#a7a9be] line-clamp-2 mt-0.5">{c.role}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rpg-btn-gold px-4 py-2 rounded font-pixel text-xs font-bold uppercase cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'SAVING...' : 'SAVE RECORD'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Two Column Layout: RPG Attributes & Lifetime Accomplishments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Core Attributes */}
        <div className="lg:col-span-7 rpg-panel p-5 text-[#fffffe] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#3b3355]">
            <span className="text-xl">📊</span>
            <div>
              <h3 className="font-pixel text-xs sm:text-sm text-[#ffd166]">
                ATTRIBUTE RATINGS & MASTERY
              </h3>
              <p className="font-retro text-base text-[#a7a9be]">
                Attributes grow permanently as you conquer corresponding real-life quests.
              </p>
            </div>
          </div>

          <div className="space-y-3.5 pt-1">
            {/* Intellect */}
            <div>
              <div className="flex justify-between items-center text-xs font-pixel mb-1">
                <span className="text-[#4cc9f0] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Intellect (INT)
                </span>
                <span className="text-white">{adventurer.statIntellect} PTS</span>
              </div>
              <div className="w-full h-3 bg-[#081720] border border-[#4cc9f0]/40 rounded-xs overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#118ab2] to-[#4cc9f0] rounded-xs"
                  style={{ width: `${Math.min(100, (adventurer.statIntellect / maxStatValue) * 100)}%` }}
                />
              </div>
            </div>

            {/* Strength */}
            <div>
              <div className="flex justify-between items-center text-xs font-pixel mb-1">
                <span className="text-[#ef476f] flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5" /> Strength (STR)
                </span>
                <span className="text-white">{adventurer.statStrength} PTS</span>
              </div>
              <div className="w-full h-3 bg-[#1c080d] border border-[#ef476f]/40 rounded-xs overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#d90429] to-[#ef476f] rounded-xs"
                  style={{ width: `${Math.min(100, (adventurer.statStrength / maxStatValue) * 100)}%` }}
                />
              </div>
            </div>

            {/* Discipline */}
            <div>
              <div className="flex justify-between items-center text-xs font-pixel mb-1">
                <span className="text-[#ffd166] flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" /> Discipline (DIS)
                </span>
                <span className="text-white">{adventurer.statDiscipline} PTS</span>
              </div>
              <div className="w-full h-3 bg-[#1f1708] border border-[#ffd166]/40 rounded-xs overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#e09f3e] to-[#ffd166] rounded-xs"
                  style={{ width: `${Math.min(100, (adventurer.statDiscipline / maxStatValue) * 100)}%` }}
                />
              </div>
            </div>

            {/* Creativity */}
            <div>
              <div className="flex justify-between items-center text-xs font-pixel mb-1">
                <span className="text-[#b5179e] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Creativity (CRE)
                </span>
                <span className="text-white">{adventurer.statCreativity} PTS</span>
              </div>
              <div className="w-full h-3 bg-[#1d071d] border border-[#b5179e]/40 rounded-xs overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#7209b7] to-[#b5179e] rounded-xs"
                  style={{ width: `${Math.min(100, (adventurer.statCreativity / maxStatValue) * 100)}%` }}
                />
              </div>
            </div>

            {/* Health / Vitality */}
            <div>
              <div className="flex justify-between items-center text-xs font-pixel mb-1">
                <span className="text-[#06d6a0] flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" /> Health / Vitality (VIT)
                </span>
                <span className="text-white">{adventurer.statHealth} PTS</span>
              </div>
              <div className="w-full h-3 bg-[#061c16] border border-[#06d6a0]/40 rounded-xs overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#007f5f] to-[#06d6a0] rounded-xs"
                  style={{ width: `${Math.min(100, (adventurer.statHealth / maxStatValue) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Lifetime Adventurer Metrics */}
        <div className="lg:col-span-5 rpg-panel p-5 text-[#fffffe] space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#3b3355]">
            <span className="text-xl">🏆</span>
            <div>
              <h3 className="font-pixel text-xs sm:text-sm text-[#ffd166]">
                GUILD EXPEDITION RECORDS
              </h3>
              <p className="font-retro text-base text-[#a7a9be]">
                Verified database telemetry of your journey.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="rpg-panel-dark p-3 rounded">
              <div className="text-[10px] font-pixel text-[#a7a9be] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#06d6a0]" /> CONQUERED
              </div>
              <div className="font-pixel text-lg text-white mt-1">
                {adventurer.totalQuestsCompleted}
              </div>
              <div className="text-[11px] font-retro text-[#a7a9be]">Quests Completed</div>
            </div>

            <div className="rpg-panel-dark p-3 rounded">
              <div className="text-[10px] font-pixel text-[#a7a9be] flex items-center gap-1">
                <Flame className="w-3 h-3 text-[#ff5400]" /> CURRENT STREAK
              </div>
              <div className="font-pixel text-lg text-[#ff5400] mt-1">
                {adventurer.currentStreak} Days
              </div>
              <div className="text-[11px] font-retro text-[#a7a9be]">Consecutive Days</div>
            </div>

            <div className="rpg-panel-dark p-3 rounded">
              <div className="text-[10px] font-pixel text-[#a7a9be] flex items-center gap-1">
                <Trophy className="w-3 h-3 text-[#ffd166]" /> LONGEST STREAK
              </div>
              <div className="font-pixel text-lg text-[#ffd166] mt-1">
                {adventurer.longestStreak} Days
              </div>
              <div className="text-[11px] font-retro text-[#a7a9be]">All-Time High</div>
            </div>

            <div className="rpg-panel-dark p-3 rounded">
              <div className="text-[10px] font-pixel text-[#a7a9be] flex items-center gap-1">
                <Coins className="w-3 h-3 text-[#ffd166]" /> CURRENT GOLD
              </div>
              <div className="font-pixel text-lg text-[#ffd166] mt-1">
                {adventurer.gold} G
              </div>
              <div className="text-[11px] font-retro text-[#a7a9be]">Ready to Spend</div>
            </div>
          </div>

          <div className="p-3 bg-[#19152b] border border-[#3b3355] rounded text-xs font-retro text-lg text-[#a7a9be] leading-relaxed mt-2">
            Tip: Consistency triggers streak multipliers that award extra XP and Gold upon every conquered task.
          </div>
        </div>
      </div>
    </div>
  );
};
