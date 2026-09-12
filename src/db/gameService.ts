import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from './index.ts';
import {
  users,
  quests,
  rewards,
  rewardRedemptions,
  badges,
  activityLogs,
} from './schema.ts';

// Helper for date formatting YYYY-MM-DD
export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function getYesterdayDateString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

import { getXpRequiredForLevel, calculateLevelProgression } from '../lib/gameMath.ts';
export { getXpRequiredForLevel, calculateLevelProgression };

// Badge definitions catalogue
export const BADGE_DEFINITIONS: Record<string, { title: string; description: string; icon: string }> = {
  first_quest: {
    title: 'Novice Adventurer',
    description: 'Completed your first quest in the realm of life.',
    icon: 'compass',
  },
  quests_5: {
    title: 'Journeyman Explorer',
    description: 'Completed 5 quests and forged your discipline.',
    icon: 'map',
  },
  quests_10: {
    title: 'Veteran Adventurer',
    description: 'Conquered 10 real-world quests.',
    icon: 'shield',
  },
  quests_25: {
    title: 'Legendary Hero',
    description: 'Completed 25 quests across all disciplines.',
    icon: 'crown',
  },
  streak_3: {
    title: 'Flame of Momentum',
    description: 'Maintained a quest streak for 3 consecutive days.',
    icon: 'flame',
  },
  streak_7: {
    title: 'Weekly Crusader',
    description: 'Kept the fire burning for 7 days straight.',
    icon: 'zap',
  },
  intellect_3: {
    title: 'Tome Scholar',
    description: 'Completed 3 Intellect quests to broaden your mind.',
    icon: 'book-open',
  },
  strength_3: {
    title: 'Iron Might',
    description: 'Completed 3 Strength physical training quests.',
    icon: 'swords',
  },
  discipline_3: {
    title: 'Zen Focus',
    description: 'Completed 3 Discipline quests with absolute clarity.',
    icon: 'target',
  },
  creativity_3: {
    title: 'Grand Artisan',
    description: 'Crafted or designed 3 Creativity quests.',
    icon: 'sparkles',
  },
  health_3: {
    title: 'Font of Vitality',
    description: 'Nourished body and mind with 3 Health quests.',
    icon: 'heart',
  },
  gold_100: {
    title: 'Treasure Hoarder',
    description: 'Amassed 100 or more Gold in your adventurer purse.',
    icon: 'coins',
  },
  first_reward: {
    title: 'Tavern Patron',
    description: 'Redeemed your hard-earned gold for a well-deserved reward.',
    icon: 'beer',
  },
  level_5: {
    title: 'Hero of Renown',
    description: 'Attained Character Level 5 through persistent dedication.',
    icon: 'award',
  },
};

// Starter quests for new adventurers
const STARTER_QUESTS = [
  {
    title: 'Study Arcane Lore (Read 15 Pages)',
    description: 'Read 15 pages of an educational book or high-value article.',
    category: 'intellect',
    difficulty: 'easy',
    xpReward: 35,
    goldReward: 15,
  },
  {
    title: 'Warrior Conditioning (30 Min Exercise)',
    description: 'Complete a workout, run, or bodyweight training session.',
    category: 'strength',
    difficulty: 'medium',
    xpReward: 60,
    goldReward: 25,
  },
  {
    title: 'Sanctuary Purification (Clean Room & Desk)',
    description: 'Organize workspace, clean desk surfaces, and empty the trash.',
    category: 'discipline',
    difficulty: 'easy',
    xpReward: 30,
    goldReward: 12,
  },
  {
    title: 'Artisan Blueprint (Brainstorm / Draw / Code)',
    description: 'Spend 20 minutes crafting art, music, creative writing, or personal code.',
    category: 'creativity',
    difficulty: 'medium',
    xpReward: 55,
    goldReward: 22,
  },
  {
    title: 'Elixir of Life (Drink 2L Water & Hydrate)',
    description: 'Keep your hydration meter topped up throughout the day.',
    category: 'health',
    difficulty: 'easy',
    xpReward: 25,
    goldReward: 10,
  },
];

// Starter Tavern Rewards
const STARTER_REWARDS = [
  {
    title: '1-Hour Video Game Session',
    description: 'Play your favorite RPG, roguelike, or arcade title guilt-free.',
    cost: 50,
    icon: 'gamepad-2',
    category: 'entertainment',
    isCustom: false,
  },
  {
    title: 'Specialty Coffee / Tea Break',
    description: 'Enjoy a rich espresso, matcha, or bubble tea treat.',
    cost: 30,
    icon: 'coffee',
    category: 'treat',
    isCustom: false,
  },
  {
    title: 'Afternoon Power Rest (30m)',
    description: 'Step away from all screens and rest your eyes in peace.',
    cost: 35,
    icon: 'moon',
    category: 'treat',
    isCustom: false,
  },
  {
    title: 'Guilt-Free Cheat Snack / Dessert',
    description: 'A delicious pastry, dark chocolate, or artisan snack.',
    cost: 45,
    icon: 'cake',
    category: 'treat',
    isCustom: false,
  },
  {
    title: 'Purchase a New Book or Game',
    description: 'Treat yourself to that digital book or indie game on your wishlist.',
    cost: 150,
    icon: 'gift',
    category: 'entertainment',
    isCustom: false,
  },
];

// Get or create user profile and seed initial data
export async function getOrCreateAdventurer(uid: string, email: string, displayName?: string) {
  try {
    const existing = await db.select().from(users).where(eq(users.uid, uid)).limit(1);

    if (existing.length > 0) {
      return existing[0];
    }

    const defaultName = displayName || (email ? email.split('@')[0] : 'Hero');
    const [newUser] = await db
      .insert(users)
      .values({
        uid,
        email,
        displayName: defaultName,
        characterClass: 'Warrior',
        avatar: 'warrior',
        level: 1,
        xp: 0,
        gold: 50, // Starting gold
        hp: 100,
        maxHp: 100,
        mp: 50,
        maxMp: 50,
        statIntellect: 10,
        statStrength: 10,
        statDiscipline: 10,
        statCreativity: 10,
        statHealth: 10,
        currentStreak: 0,
        longestStreak: 0,
        totalQuestsCompleted: 0,
      })
      .returning();

    // Seed starter quests
    for (const q of STARTER_QUESTS) {
      await db.insert(quests).values({
        userId: newUser.id,
        title: q.title,
        description: q.description,
        category: q.category,
        difficulty: q.difficulty,
        xpReward: q.xpReward,
        goldReward: q.goldReward,
        status: 'active',
      });
    }

    // Seed starter tavern rewards
    for (const r of STARTER_REWARDS) {
      await db.insert(rewards).values({
        userId: newUser.id,
        title: r.title,
        description: r.description,
        cost: r.cost,
        icon: r.icon,
        category: r.category,
        isCustom: r.isCustom,
      });
    }

    // Log arrival
    await db.insert(activityLogs).values({
      userId: newUser.id,
      actionType: 'quest_created',
      description: `${newUser.displayName} stepped into the realm of LifeQuest!`,
      xpGained: 0,
      goldGained: 50,
    });

    return newUser;
  } catch (error) {
    console.error('getOrCreateAdventurer error:', error);
    throw new Error('Failed to retrieve or initialize adventurer profile.', { cause: error });
  }
}

// Complete Quest Server-Side
export async function completeQuest(userId: number, questId: number) {
  try {
    const questList = await db
      .select()
      .from(quests)
      .where(and(eq(quests.id, questId), eq(quests.userId, userId)))
      .limit(1);

    if (questList.length === 0) {
      throw new Error('Quest not found or does not belong to this adventurer.');
    }

    const quest = questList[0];
    if (quest.status === 'completed') {
      throw new Error('Quest has already been conquered!');
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) throw new Error('Adventurer not found.');

    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();

    let newCurrentStreak = user.currentStreak;
    if (user.lastActiveDate === today) {
      // Streak already counted for today
    } else if (user.lastActiveDate === yesterday) {
      newCurrentStreak += 1;
    } else {
      // Streak broken or brand new
      newCurrentStreak = 1;
    }
    const newLongestStreak = Math.max(user.longestStreak, newCurrentStreak);

    // Streak bonuses
    const streakBonusXp = Math.min(newCurrentStreak * 5, 40);
    const streakBonusGold = Math.min(newCurrentStreak * 2, 20);

    const totalXpGained = quest.xpReward + streakBonusXp;
    const totalGoldGained = quest.goldReward + streakBonusGold;

    // Stat boosts based on category
    let newStatIntellect = user.statIntellect;
    let newStatStrength = user.statStrength;
    let newStatDiscipline = user.statDiscipline;
    let newStatCreativity = user.statCreativity;
    let newStatHealth = user.statHealth;
    let newMaxHp = user.maxHp;

    switch (quest.category.toLowerCase()) {
      case 'intellect':
        newStatIntellect += 2;
        break;
      case 'strength':
        newStatStrength += 2;
        break;
      case 'discipline':
        newStatDiscipline += 2;
        break;
      case 'creativity':
        newStatCreativity += 2;
        break;
      case 'health':
        newStatHealth += 2;
        newMaxHp += 2;
        break;
    }

    // Level progression
    const { newLevel, newXp, leveledUp, levelsGained } = calculateLevelProgression(
      user.level,
      user.xp,
      totalXpGained
    );

    let finalMaxHp = newMaxHp;
    let finalMaxMp = user.maxMp;
    let finalHp = user.hp;
    let finalMp = user.mp;

    if (leveledUp) {
      finalMaxHp += levelsGained * 10;
      finalMaxMp += levelsGained * 5;
      finalHp = finalMaxHp; // Full heal upon level up!
      finalMp = finalMaxMp;
      // Bonus stats on level up
      newStatIntellect += levelsGained * 1;
      newStatStrength += levelsGained * 1;
      newStatDiscipline += levelsGained * 1;
      newStatCreativity += levelsGained * 1;
      newStatHealth += levelsGained * 1;
    }

    const newTotalCompleted = user.totalQuestsCompleted + 1;
    const newGold = user.gold + totalGoldGained;

    // Update User
    const [updatedUser] = await db
      .update(users)
      .set({
        level: newLevel,
        xp: newXp,
        gold: newGold,
        hp: finalHp,
        maxHp: finalMaxHp,
        mp: finalMp,
        maxMp: finalMaxMp,
        statIntellect: newStatIntellect,
        statStrength: newStatStrength,
        statDiscipline: newStatDiscipline,
        statCreativity: newStatCreativity,
        statHealth: newStatHealth,
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastActiveDate: today,
        totalQuestsCompleted: newTotalCompleted,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    // Mark Quest Completed
    const [updatedQuest] = await db
      .update(quests)
      .set({
        status: 'completed',
        completedAt: new Date(),
      })
      .where(eq(quests.id, questId))
      .returning();

    // Activity Log
    await db.insert(activityLogs).values({
      userId,
      actionType: 'quest_completed',
      description: `Victory! Completed quest "${quest.title}" (+${totalXpGained} XP, +${totalGoldGained} Gold)`,
      xpGained: totalXpGained,
      goldGained: totalGoldGained,
      metadata: JSON.stringify({ category: quest.category, difficulty: quest.difficulty }),
    });

    if (leveledUp) {
      await db.insert(activityLogs).values({
        userId,
        actionType: 'level_up',
        description: `LEVEL UP! ${user.displayName} attained Level ${newLevel}! Max HP and attributes expanded!`,
        xpGained: 0,
        goldGained: 0,
        metadata: JSON.stringify({ level: newLevel }),
      });
    }

    // Check Badges
    const unlockedBadges = await evaluateAndAwardBadges(userId, updatedUser, quest.category);

    return {
      quest: updatedQuest,
      user: updatedUser,
      rewardsGained: {
        xp: totalXpGained,
        gold: totalGoldGained,
        streakBonusXp,
        streakBonusGold,
      },
      leveledUp,
      levelsGained,
      newLevel,
      unlockedBadges,
    };
  } catch (error) {
    console.error('completeQuest error:', error);
    throw new Error('Failed to complete quest.', { cause: error });
  }
}

// Check and award achievements/badges
export async function evaluateAndAwardBadges(userId: number, user: typeof users.$inferSelect, lastCategory?: string) {
  const existingBadges = await db.select().from(badges).where(eq(badges.userId, userId));
  const existingKeys = new Set(existingBadges.map((b) => b.badgeKey));

  const badgesToAward: string[] = [];

  if (!existingKeys.has('first_quest') && user.totalQuestsCompleted >= 1) {
    badgesToAward.push('first_quest');
  }
  if (!existingKeys.has('quests_5') && user.totalQuestsCompleted >= 5) {
    badgesToAward.push('quests_5');
  }
  if (!existingKeys.has('quests_10') && user.totalQuestsCompleted >= 10) {
    badgesToAward.push('quests_10');
  }
  if (!existingKeys.has('quests_25') && user.totalQuestsCompleted >= 25) {
    badgesToAward.push('quests_25');
  }
  if (!existingKeys.has('streak_3') && user.currentStreak >= 3) {
    badgesToAward.push('streak_3');
  }
  if (!existingKeys.has('streak_7') && user.currentStreak >= 7) {
    badgesToAward.push('streak_7');
  }
  if (!existingKeys.has('gold_100') && user.gold >= 100) {
    badgesToAward.push('gold_100');
  }
  if (!existingKeys.has('level_5') && user.level >= 5) {
    badgesToAward.push('level_5');
  }

  // Category specific checks
  if (lastCategory) {
    const categoryQuests = await db
      .select({ count: sql<number>`count(*)` })
      .from(quests)
      .where(
        and(
          eq(quests.userId, userId),
          eq(quests.category, lastCategory),
          eq(quests.status, 'completed')
        )
      );

    const count = Number(categoryQuests[0]?.count || 0);
    const catKey = `${lastCategory.toLowerCase()}_3`;
    if (!existingKeys.has(catKey) && count >= 3 && BADGE_DEFINITIONS[catKey]) {
      badgesToAward.push(catKey);
    }
  }

  const newlyUnlocked = [];
  for (const key of badgesToAward) {
    const def = BADGE_DEFINITIONS[key];
    if (def) {
      const [b] = await db
        .insert(badges)
        .values({
          userId,
          badgeKey: key,
          title: def.title,
          description: def.description,
          icon: def.icon,
        })
        .returning();

      await db.insert(activityLogs).values({
        userId,
        actionType: 'badge_unlocked',
        description: `Unlocked Achievement: [${def.title}] - ${def.description}`,
        metadata: JSON.stringify({ badgeKey: key }),
      });

      newlyUnlocked.push(b);
    }
  }

  return newlyUnlocked;
}

// Purchase / Redeem Tavern Reward
export async function purchaseReward(userId: number, rewardId: number) {
  try {
    const rewardList = await db.select().from(rewards).where(eq(rewards.id, rewardId)).limit(1);
    if (rewardList.length === 0) {
      throw new Error('Reward item not found in the tavern.');
    }
    const reward = rewardList[0];

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) throw new Error('Adventurer not found.');

    if (user.gold < reward.cost) {
      throw new Error(`Insufficient gold! You need ${reward.cost} Gold, but only have ${user.gold} Gold.`);
    }

    // Deduct Gold server-side
    const newGold = user.gold - reward.cost;
    const [updatedUser] = await db
      .update(users)
      .set({
        gold: newGold,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    // Record Redemption
    const [redemption] = await db
      .insert(rewardRedemptions)
      .values({
        userId,
        rewardId: reward.id,
        rewardTitle: reward.title,
        cost: reward.cost,
      })
      .returning();

    // Log Activity
    await db.insert(activityLogs).values({
      userId,
      actionType: 'reward_purchased',
      description: `Tavern transaction: Redeemed "${reward.title}" for ${reward.cost} Gold!`,
      goldGained: -reward.cost,
      metadata: JSON.stringify({ rewardId: reward.id, title: reward.title }),
    });

    // Award first_reward badge if not present
    const existingFirstReward = await db
      .select()
      .from(badges)
      .where(and(eq(badges.userId, userId), eq(badges.badgeKey, 'first_reward')))
      .limit(1);

    const newlyUnlocked = [];
    if (existingFirstReward.length === 0) {
      const def = BADGE_DEFINITIONS['first_reward'];
      const [b] = await db
        .insert(badges)
        .values({
          userId,
          badgeKey: 'first_reward',
          title: def.title,
          description: def.description,
          icon: def.icon,
        })
        .returning();
      newlyUnlocked.push(b);
    }

    return {
      redemption,
      user: updatedUser,
      reward,
      unlockedBadges: newlyUnlocked,
    };
  } catch (error) {
    console.error('purchaseReward error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to redeem tavern reward.');
  }
}
