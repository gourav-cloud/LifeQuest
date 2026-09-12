import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import {
  Adventurer,
  Quest,
  Reward,
  RewardRedemption,
  Badge,
  ActivityLog,
  QuestCompleteResult,
  QuestCategory,
} from './types.ts';
import { sounds } from './lib/soundEffects.ts';
import { Header, NavTab } from './components/Header.tsx';
import { CharacterHud } from './components/CharacterHud.tsx';
import { QuestCard } from './components/QuestCard.tsx';
import { QuestModal } from './components/QuestModal.tsx';
import { CharacterSheet } from './components/CharacterSheet.tsx';
import { RewardShop } from './components/RewardShop.tsx';
import { BadgesView } from './components/BadgesView.tsx';
import { ActivityLogView } from './components/ActivityLogView.tsx';
import { LevelUpModal } from './components/LevelUpModal.tsx';
import { FloatingCombatText, FloatingTextItem } from './components/FloatingCombatText.tsx';
import { AuthScreen } from './components/AuthScreen.tsx';
import {
  Swords,
  Plus,
  Filter,
  CheckCircle2,
  Calendar,
  Sparkles,
  Search,
  BookOpen,
  Target,
  Heart,
  RefreshCw,
} from 'lucide-react';

function LifeQuestContent() {
  const { user, demoUser, token, loading: authLoading, authFetch } = useAuth();

  const [currentTab, setCurrentTab] = useState<NavTab>('quests');
  const [adventurer, setAdventurer] = useState<Adventurer | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [totalUnlockedBadges, setTotalUnlockedBadges] = useState(0);
  const [totalBadges, setTotalBadges] = useState(14);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // UI state
  const [loadingData, setLoadingData] = useState(true);
  const [questModalOpen, setQuestModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [completingQuestId, setCompletingQuestId] = useState<number | null>(null);
  const [purchasingRewardId, setPurchasingRewardId] = useState<number | null>(null);
  const [levelUpModalOpen, setLevelUpModalOpen] = useState(false);
  const [leveledUpTo, setLeveledUpTo] = useState<number>(2);
  const [floatingTexts, setFloatingTexts] = useState<FloatingTextItem[]>([]);

  // Quest filters
  const [questStatusFilter, setQuestStatusFilter] = useState<'active' | 'completed' | 'all'>('active');
  const [questCategoryFilter, setQuestCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add floating combat text notification
  const addFloatingText = (text: string, type: FloatingTextItem['type'] = 'xp') => {
    const id = Math.random().toString(36).substring(2, 9);
    setFloatingTexts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 2800);
  };

  // Load all user data
  const loadAllData = useCallback(async () => {
    if (!token) return;
    try {
      setLoadingData(true);
      const [advRes, questRes, rewardRes, redRes, badgeRes, actRes] = await Promise.all([
        authFetch('/api/adventurer'),
        authFetch('/api/quests'),
        authFetch('/api/rewards'),
        authFetch('/api/redemptions'),
        authFetch('/api/badges'),
        authFetch('/api/activity'),
      ]);

      if (advRes.ok) {
        const advData = await advRes.json();
        setAdventurer(advData.adventurer || advData);
      }

      if (questRes.ok) {
        const qData = await questRes.json();
        setQuests(Array.isArray(qData) ? qData : qData.quests || []);
      }

      if (rewardRes.ok) {
        const rData = await rewardRes.json();
        setRewards(Array.isArray(rData) ? rData : rData.rewards || []);
      }

      if (redRes.ok) {
        const redData = await redRes.json();
        setRedemptions(Array.isArray(redData) ? redData : redData.redemptions || []);
      }

      if (badgeRes.ok) {
        const bData = await badgeRes.json();
        setBadges(bData.badges || []);
        setTotalUnlockedBadges(bData.totalUnlocked || 0);
        setTotalBadges(bData.totalAvailable || 14);
      }

      if (actRes.ok) {
        const aData = await actRes.json();
        setActivityLogs(Array.isArray(aData) ? aData : aData.activityLogs || []);
      }
    } catch (error) {
      console.error('Failed to load LifeQuest data:', error);
    } finally {
      setLoadingData(false);
    }
  }, [token, authFetch]);

  useEffect(() => {
    if (token) {
      loadAllData();
    }
  }, [token, loadAllData]);

  // Create or Update Quest
  const handleSaveQuest = async (questData: Partial<Quest>) => {
    if (editingQuest) {
      const res = await authFetch(`/api/quests/${editingQuest.id}`, {
        method: 'PUT',
        body: JSON.stringify(questData),
      });
      if (!res.ok) throw new Error('Failed to update quest.');
      const data = await res.json();
      const updated = data.quest || data;
      setQuests((prev) => prev.map((q) => (q.id === editingQuest.id ? updated : q)));
    } else {
      const res = await authFetch('/api/quests', {
        method: 'POST',
        body: JSON.stringify(questData),
      });
      if (!res.ok) throw new Error('Failed to create quest.');
      const data = await res.json();
      const created = data.quest || data;
      setQuests((prev) => [created, ...prev]);
      addFloatingText('New Quest Scribed!', 'info');
    }
  };

  // Complete Quest
  const handleCompleteQuest = async (questId: number) => {
    try {
      setCompletingQuestId(questId);
      const res = await authFetch(`/api/quests/${questId}/complete`, {
        method: 'POST',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to complete quest.');
      }

      const result: QuestCompleteResult = await res.json();

      // Update quests list
      setQuests((prev) => prev.map((q) => (q.id === questId ? result.quest : q)));

      // Update adventurer
      setAdventurer(result.user);

      // Trigger floating combat texts
      addFloatingText(`+${result.rewardsGained.xp} XP Earned!`, 'xp');
      addFloatingText(`+${result.rewardsGained.gold} Gold Added!`, 'gold');

      if (result.rewardsGained.streakBonusXp > 0) {
        addFloatingText(`Streak Bonus: +${result.rewardsGained.streakBonusXp} XP!`, 'streak');
      }

      // Check level up
      if (result.leveledUp) {
        setLeveledUpTo(result.newLevel);
        setLevelUpModalOpen(true);
      }

      // Check new badges
      if (result.unlockedBadges && result.unlockedBadges.length > 0) {
        result.unlockedBadges.forEach((b) => {
          addFloatingText(`🏆 Badge Unlocked: ${b.title}!`, 'levelup');
        });
        // Reload badges list
        const badgeRes = await authFetch('/api/badges');
        if (badgeRes.ok) {
          const bData = await badgeRes.json();
          setBadges(bData.badges || []);
          setTotalUnlockedBadges(bData.totalUnlocked || 0);
        }
      }

      // Refresh activity log
      const actRes = await authFetch('/api/activity');
      if (actRes.ok) {
        const aData = await actRes.json();
        setActivityLogs(aData.activityLogs || []);
      }
    } catch (err: any) {
      console.error('Error completing quest:', err);
      alert(err.message || 'Could not complete quest.');
    } finally {
      setCompletingQuestId(null);
    }
  };

  // Delete Quest
  const handleDeleteQuest = async (questId: number) => {
    try {
      const res = await authFetch(`/api/quests/${questId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete quest.');
      setQuests((prev) => prev.filter((q) => q.id !== questId));
      addFloatingText('Quest Removed from Ledger', 'info');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Purchase Tavern Reward
  const handlePurchaseReward = async (rewardId: number) => {
    try {
      setPurchasingRewardId(rewardId);
      const res = await authFetch(`/api/rewards/${rewardId}/purchase`, {
        method: 'POST',
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to redeem reward.');
      }
      const data = await res.json();

      setAdventurer((prev) => (prev ? { ...prev, gold: data.remainingGold } : prev));
      setRedemptions((prev) => [data.redemption, ...prev]);

      addFloatingText(`Redeemed: ${data.rewardTitle}!`, 'info');
      addFloatingText(`-${data.cost} Gold`, 'gold');

      // Refresh activity log
      const actRes = await authFetch('/api/activity');
      if (actRes.ok) {
        const aData = await actRes.json();
        setActivityLogs(aData.activityLogs || []);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setPurchasingRewardId(null);
    }
  };

  // Create Custom Reward
  const handleCreateReward = async (rewardData: {
    title: string;
    description: string;
    cost: number;
    icon: string;
    category: string;
  }) => {
    const res = await authFetch('/api/rewards', {
      method: 'POST',
      body: JSON.stringify(rewardData),
    });
    if (!res.ok) throw new Error('Failed to create tavern reward.');
    const data = await res.json();
    const created = data.reward || data;
    setRewards((prev) => [created, ...prev]);
    addFloatingText('Tavern Bounty Inscribed!', 'info');
  };

  // Delete Reward
  const handleDeleteReward = async (rewardId: number) => {
    const res = await authFetch(`/api/rewards/${rewardId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete reward.');
    setRewards((prev) => prev.filter((r) => r.id !== rewardId));
  };

  // Update Adventurer details
  const handleUpdateAdventurer = async (data: {
    displayName?: string;
    characterClass?: string;
    avatar?: string;
  }) => {
    const res = await authFetch('/api/adventurer', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update character.');
    const resData = await res.json();
    setAdventurer(resData.adventurer);
    addFloatingText('Character Record Updated', 'info');
  };

  // Auth gate
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0f0d17] text-[#ffd166] flex flex-col items-center justify-center font-pixel text-sm p-4">
        <div className="w-12 h-12 border-4 border-[#ffd166] border-t-transparent rounded-full animate-spin mb-4" />
        <p>AWAKENING LIFEQUEST REALM...</p>
      </div>
    );
  }

  if (!user && !demoUser) {
    return <AuthScreen />;
  }

  // Filtered Quests
  const filteredQuests = quests.filter((q) => {
    if (questStatusFilter === 'active' && q.status !== 'active') return false;
    if (questStatusFilter === 'completed' && q.status !== 'completed') return false;
    if (questCategoryFilter !== 'all' && q.category !== questCategoryFilter) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        q.title.toLowerCase().includes(query) ||
        (q.description && q.description.toLowerCase().includes(query))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0e0c15] text-[#fffffe] flex flex-col selection:bg-[#ffd166] selection:text-[#12101b] relative">
      {/* Floating Combat Text Queue */}
      <FloatingCombatText items={floatingTexts} />

      {/* Level Up Fanfare Modal */}
      <LevelUpModal
        isOpen={levelUpModalOpen}
        level={leveledUpTo}
        onClose={() => setLevelUpModalOpen(false)}
      />

      {/* Quest Commission / Edit Modal */}
      <QuestModal
        isOpen={questModalOpen}
        onClose={() => {
          setQuestModalOpen(false);
          setEditingQuest(null);
        }}
        onSubmit={handleSaveQuest}
        editQuest={editingQuest}
      />

      {/* Main Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        gold={adventurer?.gold || 0}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Top Character Status HUD */}
        {adventurer && (
          <CharacterHud
            adventurer={adventurer}
            onOpenProfile={() => setCurrentTab('character')}
          />
        )}

        {/* Loading Spinner */}
        {loadingData && !adventurer ? (
          <div className="text-center py-16 text-[#ffd166] font-pixel text-xs">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3" />
            LOADING GUILD CONTRACTS & DATA...
          </div>
        ) : (
          <>
            {/* VIEW 1: QUEST BOARD (DASHBOARD) */}
            {currentTab === 'quests' && (
              <div className="space-y-5">
                {/* Action Bar & Controls */}
                <div className="rpg-panel p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  {/* Left: Filter Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 font-pixel text-[10px]">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setQuestStatusFilter('active');
                      }}
                      className={`px-3 py-1.5 rounded uppercase cursor-pointer transition-all ${
                        questStatusFilter === 'active'
                          ? 'bg-[#ffd166] text-[#12101b] font-bold border-2 border-[#ffe89e]'
                          : 'bg-[#121018] text-[#a7a9be] hover:text-white border border-[#3b3355]'
                      }`}
                    >
                      Active Quests ({quests.filter((q) => q.status === 'active').length})
                    </button>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        setQuestStatusFilter('completed');
                      }}
                      className={`px-3 py-1.5 rounded uppercase cursor-pointer transition-all ${
                        questStatusFilter === 'completed'
                          ? 'bg-[#06d6a0] text-[#12101b] font-bold border-2 border-[#8ef3e9]'
                          : 'bg-[#121018] text-[#a7a9be] hover:text-white border border-[#3b3355]'
                      }`}
                    >
                      Conquered ({quests.filter((q) => q.status === 'completed').length})
                    </button>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        setQuestStatusFilter('all');
                      }}
                      className={`px-3 py-1.5 rounded uppercase cursor-pointer transition-all ${
                        questStatusFilter === 'all'
                          ? 'bg-[#4cc9f0] text-[#12101b] font-bold border-2 border-[#a0e4f8]'
                          : 'bg-[#121018] text-[#a7a9be] hover:text-white border border-[#3b3355]'
                      }`}
                    >
                      All ({quests.length})
                    </button>
                  </div>

                  {/* Center/Right: Category Filter & Search & New Quest */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Category Selector */}
                    <div className="flex items-center gap-1.5 bg-[#121018] border border-[#3b3355] rounded px-2 py-1">
                      <Filter className="w-3.5 h-3.5 text-[#ffd166]" />
                      <select
                        value={questCategoryFilter}
                        onChange={(e) => setQuestCategoryFilter(e.target.value)}
                        className="bg-transparent text-[#fffffe] font-pixel text-[9px] uppercase outline-hidden cursor-pointer"
                      >
                        <option value="all" className="bg-[#121018]">All Disciplines</option>
                        <option value="intellect" className="bg-[#121018]">Intellect (INT)</option>
                        <option value="strength" className="bg-[#121018]">Strength (STR)</option>
                        <option value="discipline" className="bg-[#121018]">Discipline (DIS)</option>
                        <option value="creativity" className="bg-[#121018]">Creativity (CRE)</option>
                        <option value="health" className="bg-[#121018]">Health (VIT)</option>
                      </select>
                    </div>

                    {/* Search Field */}
                    <div className="relative flex-1 sm:w-44">
                      <Search className="w-3.5 h-3.5 text-[#a7a9be] absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search quests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#121018] border border-[#3b3355] rounded pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-[#686377] outline-hidden font-pixel-sans"
                      />
                    </div>

                    {/* New Quest Button */}
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setEditingQuest(null);
                        setQuestModalOpen(true);
                      }}
                      className="rpg-btn-gold px-3.5 py-1.5 rounded font-pixel text-xs uppercase font-bold flex items-center gap-1.5 cursor-pointer shadow hover:scale-102 transition-transform"
                    >
                      <Plus className="w-4 h-4" />
                      <span>NEW QUEST</span>
                    </button>
                  </div>
                </div>

                {/* Quests Grid */}
                {filteredQuests.length === 0 ? (
                  <div className="rpg-panel p-10 text-center text-[#a7a9be] space-y-3">
                    <Swords className="w-10 h-10 mx-auto text-[#ffd166]/60" />
                    <h3 className="font-pixel text-sm text-[#ffd166]">
                      NO ACTIVE QUESTS IN THIS DISCIPLINE
                    </h3>
                    <p className="font-retro text-xl max-w-md mx-auto">
                      Commission your first task contract to begin forging your hero's destiny.
                    </p>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setEditingQuest(null);
                        setQuestModalOpen(true);
                      }}
                      className="rpg-btn-gold px-4 py-2 rounded font-pixel text-xs uppercase font-bold cursor-pointer inline-flex items-center gap-1.5 mt-2"
                    >
                      <Plus className="w-4 h-4" /> COMMISSION FIRST QUEST
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredQuests.map((quest) => (
                      <QuestCard
                        key={quest.id}
                        quest={quest}
                        onComplete={handleCompleteQuest}
                        onEdit={(q) => {
                          setEditingQuest(q);
                          setQuestModalOpen(true);
                        }}
                        onDelete={handleDeleteQuest}
                        completing={completingQuestId === quest.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* VIEW 2: CHARACTER SHEET */}
            {currentTab === 'character' && adventurer && (
              <CharacterSheet
                adventurer={adventurer}
                onUpdateAdventurer={handleUpdateAdventurer}
              />
            )}

            {/* VIEW 3: REWARD TAVERN */}
            {currentTab === 'tavern' && adventurer && (
              <RewardShop
                gold={adventurer.gold}
                rewards={rewards}
                redemptions={redemptions}
                onPurchaseReward={handlePurchaseReward}
                onCreateReward={handleCreateReward}
                onDeleteReward={handleDeleteReward}
                purchasingId={purchasingRewardId}
              />
            )}

            {/* VIEW 4: HALL OF FAME / BADGES */}
            {currentTab === 'badges' && (
              <BadgesView
                badges={badges}
                totalUnlocked={totalUnlockedBadges}
                totalAvailable={totalBadges}
              />
            )}

            {/* VIEW 5: CHRONICLES / ACTIVITY */}
            {currentTab === 'activity' && (
              <ActivityLogView logs={activityLogs} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#282138] bg-[#0c0a12] py-4 text-center font-retro text-base text-[#6b6582]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>⚔️ LifeQuest — 16-Bit Productivity Realm. Verified Server-Side Progression.</span>
          <span className="font-pixel text-[9px] text-[#ffd166]">CLOUD SQL & POSTGRESQL AUTHORIZED</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LifeQuestContent />
    </AuthProvider>
  );
}
