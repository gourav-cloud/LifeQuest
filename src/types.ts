export type QuestCategory = 'intellect' | 'strength' | 'discipline' | 'creativity' | 'health';
export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'epic';
export type QuestStatus = 'active' | 'completed' | 'failed';

export interface Adventurer {
  id: number;
  uid: string;
  email: string;
  displayName: string;
  characterClass: string;
  avatar: string;
  level: number;
  xp: number;
  gold: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  statIntellect: number;
  statStrength: number;
  statDiscipline: number;
  statCreativity: number;
  statHealth: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  totalQuestsCompleted: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Quest {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  xpReward: number;
  goldReward: number;
  status: QuestStatus;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface Reward {
  id: number;
  userId: number | null;
  title: string;
  description: string;
  cost: number;
  icon: string;
  category: string;
  isCustom: boolean;
  createdAt: string;
}

export interface RewardRedemption {
  id: number;
  userId: number;
  rewardId: number;
  rewardTitle: string;
  cost: number;
  redeemedAt: string;
}

export interface Badge {
  key: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt: string | null;
}

export interface ActivityLog {
  id: number;
  userId: number;
  actionType: 'quest_completed' | 'quest_created' | 'reward_purchased' | 'level_up' | 'badge_unlocked';
  description: string;
  xpGained: number;
  goldGained: number;
  metadata: string | null;
  createdAt: string;
}

export interface QuestCompleteResult {
  quest: Quest;
  user: Adventurer;
  rewardsGained: {
    xp: number;
    gold: number;
    streakBonusXp: number;
    streakBonusGold: number;
  };
  leveledUp: boolean;
  levelsGained: number;
  newLevel: number;
  unlockedBadges: Array<{
    id: number;
    badgeKey: string;
    title: string;
    description: string;
    icon: string;
  }>;
}
