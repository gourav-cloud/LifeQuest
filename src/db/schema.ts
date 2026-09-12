import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users / Adventurers
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name').default('Hero'),
  characterClass: text('character_class').default('Warrior'),
  avatar: text('avatar').default('warrior'),
  level: integer('level').default(1).notNull(),
  xp: integer('xp').default(0).notNull(),
  gold: integer('gold').default(50).notNull(), // Starting adventurer stipend
  hp: integer('hp').default(100).notNull(),
  maxHp: integer('max_hp').default(100).notNull(),
  mp: integer('mp').default(50).notNull(),
  maxMp: integer('max_mp').default(50).notNull(),
  statIntellect: integer('stat_intellect').default(10).notNull(),
  statStrength: integer('stat_strength').default(10).notNull(),
  statDiscipline: integer('stat_discipline').default(10).notNull(),
  statCreativity: integer('stat_creativity').default(10).notNull(),
  statHealth: integer('stat_health').default(10).notNull(),
  currentStreak: integer('current_streak').default(0).notNull(),
  longestStreak: integer('longest_streak').default(0).notNull(),
  lastActiveDate: text('last_active_date'), // YYYY-MM-DD
  totalQuestsCompleted: integer('total_quests_completed').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Quests
export const quests = pgTable('quests', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  title: text('title').notNull(),
  description: text('description').default(''),
  category: text('category').notNull(), // 'intellect' | 'strength' | 'discipline' | 'creativity' | 'health'
  difficulty: text('difficulty').default('medium').notNull(), // 'easy' | 'medium' | 'hard' | 'epic'
  xpReward: integer('xp_reward').notNull(),
  goldReward: integer('gold_reward').notNull(),
  status: text('status').default('active').notNull(), // 'active' | 'completed' | 'failed'
  dueDate: text('due_date'), // YYYY-MM-DD
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Reward Shop Items
export const rewards = pgTable('rewards', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id), // Nullable for global tavern items
  title: text('title').notNull(),
  description: text('description').default(''),
  cost: integer('cost').notNull(),
  icon: text('icon').default('gift').notNull(),
  category: text('category').default('custom').notNull(), // 'custom' | 'potion' | 'treat' | 'entertainment'
  isCustom: boolean('is_custom').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Reward Redemptions History
export const rewardRedemptions = pgTable('reward_redemptions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  rewardId: integer('reward_id').references(() => rewards.id),
  rewardTitle: text('reward_title').notNull(),
  cost: integer('cost').notNull(),
  redeemedAt: timestamp('redeemed_at').defaultNow(),
});

// Badges & Achievements
export const badges = pgTable('badges', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  badgeKey: text('badge_key').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  icon: text('icon').notNull(),
  unlockedAt: timestamp('unlocked_at').defaultNow(),
});

// Activity / Quest Log
export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  actionType: text('action_type').notNull(), // 'quest_completed' | 'quest_created' | 'reward_purchased' | 'level_up' | 'badge_unlocked'
  description: text('description').notNull(),
  xpGained: integer('xp_gained').default(0).notNull(),
  goldGained: integer('gold_gained').default(0).notNull(),
  metadata: text('metadata'), // JSON string for extra info
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  quests: many(quests),
  rewards: many(rewards),
  rewardRedemptions: many(rewardRedemptions),
  badges: many(badges),
  activityLogs: many(activityLogs),
}));

export const questsRelations = relations(quests, ({ one }) => ({
  user: one(users, {
    fields: [quests.userId],
    references: [users.id],
  }),
}));

export const rewardsRelations = relations(rewards, ({ one }) => ({
  user: one(users, {
    fields: [rewards.userId],
    references: [users.id],
  }),
}));

export const rewardRedemptionsRelations = relations(rewardRedemptions, ({ one }) => ({
  user: one(users, {
    fields: [rewardRedemptions.userId],
    references: [users.id],
  }),
  reward: one(rewards, {
    fields: [rewardRedemptions.rewardId],
    references: [rewards.id],
  }),
}));

export const badgesRelations = relations(badges, ({ one }) => ({
  user: one(users, {
    fields: [badges.userId],
    references: [users.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));
