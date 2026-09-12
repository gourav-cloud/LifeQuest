import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import {
  getOrCreateAdventurer,
  completeQuest,
  purchaseReward,
  BADGE_DEFINITIONS,
} from './src/db/gameService.ts';
import { db } from './src/db/index.ts';
import {
  users,
  quests,
  rewards,
  rewardRedemptions,
  badges,
  activityLogs,
} from './src/db/schema.ts';
import { eq, and, desc } from 'drizzle-orm';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', realm: 'LifeQuest', timestamp: new Date().toISOString() });
  });

  // 1. Get or Initialize Adventurer Profile
  app.get('/api/adventurer', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user!;
      const adventurer = await getOrCreateAdventurer(user.uid, user.email, user.name);

      // Get user's active quest count
      const activeQuests = await db
        .select()
        .from(quests)
        .where(and(eq(quests.userId, adventurer.id), eq(quests.status, 'active')));

      // Get user's unlocked badges
      const userBadges = await db
        .select()
        .from(badges)
        .where(eq(badges.userId, adventurer.id));

      res.json({
        adventurer,
        activeQuestCount: activeQuests.length,
        badgeCount: userBadges.length,
      });
    } catch (error: any) {
      console.error('Failed to get adventurer:', error);
      res.status(500).json({ error: error.message || 'Failed to load adventurer' });
    }
  });

  // 2. Update Adventurer Profile (Name, Class, Avatar)
  app.put('/api/adventurer', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user!;
      const adventurer = await getOrCreateAdventurer(user.uid, user.email, user.name);
      const { displayName, characterClass, avatar } = req.body;

      const [updated] = await db
        .update(users)
        .set({
          ...(displayName ? { displayName } : {}),
          ...(characterClass ? { characterClass } : {}),
          ...(avatar ? { avatar } : {}),
          updatedAt: new Date(),
        })
        .where(eq(users.id, adventurer.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      console.error('Failed to update adventurer:', error);
      res.status(500).json({ error: error.message || 'Failed to update adventurer profile' });
    }
  });

  // 3. Get Quests
  app.get('/api/quests', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user!;
      const adventurer = await getOrCreateAdventurer(user.uid, user.email, user.name);
      const { status, category } = req.query;

      const userQuests = await db
        .select()
        .from(quests)
        .where(eq(quests.userId, adventurer.id))
        .orderBy(desc(quests.createdAt));

      let filtered = userQuests;
      if (status && typeof status === 'string') {
        filtered = filtered.filter((q) => q.status === status);
      }
      if (category && typeof category === 'string' && category !== 'all') {
        filtered = filtered.filter((q) => q.category.toLowerCase() === category.toLowerCase());
      }

      res.json(filtered);
    } catch (error: any) {
      console.error('Failed to fetch quests:', error);
      res.status(500).json({ error: error.message || 'Failed to load quests' });
    }
  });

  // 4. Create Quest (Server calculates rewards based on difficulty)
  app.post('/api/quests', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user!;
      const adventurer = await getOrCreateAdventurer(user.uid, user.email, user.name);
      const { title, description, category, difficulty, dueDate } = req.body;

      if (!title || !category) {
        return res.status(400).json({ error: 'Quest title and category are required.' });
      }

      // Calculate server-side base XP and Gold rewards
      let xpReward = 40;
      let goldReward = 15;
      const diff = (difficulty || 'medium').toLowerCase();

      if (diff === 'easy') {
        xpReward = 30;
        goldReward = 12;
      } else if (diff === 'medium') {
        xpReward = 55;
        goldReward = 22;
      } else if (diff === 'hard') {
        xpReward = 95;
        goldReward = 45;
      } else if (diff === 'epic') {
        xpReward = 180;
        goldReward = 85;
      }

      const [newQuest] = await db
        .insert(quests)
        .values({
          userId: adventurer.id,
          title: title.trim(),
          description: description?.trim() || '',
          category: category.toLowerCase(),
          difficulty: diff,
          xpReward,
          goldReward,
          dueDate: dueDate || null,
          status: 'active',
        })
        .returning();

      // Log creation
      await db.insert(activityLogs).values({
        userId: adventurer.id,
        actionType: 'quest_created',
        description: `New Quest Accepted: "${newQuest.title}" [${category.toUpperCase()} - ${diff.toUpperCase()}]`,
        xpGained: 0,
        goldGained: 0,
        metadata: JSON.stringify({ category, difficulty: diff }),
      });

      res.status(201).json(newQuest);
    } catch (error: any) {
      console.error('Failed to create quest:', error);
      res.status(500).json({ error: error.message || 'Failed to create quest' });
    }
  });

  // 5. Update Quest
  app.put('/api/quests/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user!;
      const adventurer = await getOrCreateAdventurer(user.uid, user.email, user.name);
      const questId = parseInt(req.params.id, 10);
      const { title, description, category, difficulty, dueDate } = req.body;

      let xpReward: number | undefined;
      let goldReward: number | undefined;

      if (difficulty) {
        const diff = difficulty.toLowerCase();
        if (diff === 'easy') {
          xpReward = 30;
          goldReward = 12;
        } else if (diff === 'medium') {
          xpReward = 55;
          goldReward = 22;
        } else if (diff === 'hard') {
          xpReward = 95;
          goldReward = 45;
        } else if (diff === 'epic') {
          xpReward = 180;
          goldReward = 85;
        }
      }

      const [updated] = await db
        .update(quests)
        .set({
          ...(title ? { title: title.trim() } : {}),
          ...(description !== undefined ? { description: description.trim() } : {}),
          ...(category ? { category: category.toLowerCase() } : {}),
          ...(difficulty ? { difficulty: difficulty.toLowerCase(), xpReward, goldReward } : {}),
          ...(dueDate !== undefined ? { dueDate: dueDate || null } : {}),
        })
        .where(and(eq(quests.id, questId), eq(quests.userId, adventurer.id)))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: 'Quest not found.' });
      }

      res.json(updated);
    } catch (error: any) {
      console.error('Failed to edit quest:', error);
      res.status(500).json({ error: error.message || 'Failed to edit quest' });
    }
  });

  // 6. Delete Quest
  app.delete('/api/quests/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user!;
      const adventurer = await getOrCreateAdventurer(user.uid, user.email, user.name);
      const questId = parseInt(req.params.id, 10);

      const deleted = await db
        .delete(quests)
        .where(and(eq(quests.id, questId), eq(quests.userId, adventurer.id)))
        .returning();

      if (deleted.length === 0) {
        return res.status(404).json({ error: 'Quest not found.' });
      }

      res.json({ success: true, deletedQuest: deleted[0] });
    } catch (error: any) {
      console.error('Failed to delete quest:', error);
      res.status(500).json({ error: error.message || 'Failed to delete quest' });
    }
  });

  // 7. Complete Quest (Server-side calculation for XP, Gold, Level, Stats, Badges)
  app.post('/api/quests/:id/complete', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user!;
      const adventurer = await getOrCreateAdventurer(user.uid, user.email, user.name);
      const questId = parseInt(req.params.id, 10);

      const result = await completeQuest(adventurer.id, questId);
      res.json(result);
    } catch (error: any) {
      console.error('Failed to complete quest:', error);
      res.status(400).json({ error: error.message || 'Failed to complete quest' });
    }
  });

  // 8. Get Tavern Rewards
  app.get('/api/rewards', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user!;
      const adventurer = await getOrCreateAdventurer(user.uid, user.email, user.name);

      const userRewards = await db
        .select()
        .from(rewards)
        .where(eq(rewards.userId, adventurer.id))
        .orderBy(desc(rewards.createdAt));

      res.json(userRewards);
    } catch (error: any) {
      console.error('Failed to fetch rewards:', error);
      res.status(500).json({ error: error.message || 'Failed to load tavern rewards' });
    }
  });

  // 9. Create Custom Tavern Reward
  app.post('/api/rewards', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user!;
      const adventurer = await getOrCreateAdventurer(user.uid, user.email, user.name);
      const { title, description, cost, icon, category } = req.body;

      if (!title || !cost) {
        return res.status(400).json({ error: 'Title and Gold cost are required for reward.' });
      }

      const costNum = Math.max(1, parseInt(cost, 10));

      const [newReward] = await db
        .insert(rewards)
        .values({
          userId: adventurer.id,
          title: title.trim(),
          description: description?.trim() || '',
          cost: costNum,
          icon: icon || 'gift',
          category: category || 'custom',
          isCustom: true,
        })
        .returning();

      res.status(201).json(newReward);
    } catch (error: any) {
      console.error('Failed to create reward:', error);
      res.status(500).json({ error: error.message || 'Failed to create reward' });
    }
  });

  // 10. Delete Custom Tavern Reward
  app.delete('/api/rewards/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user!;
      const adventurer = await getOrCreateAdventurer(user.uid, user.email, user.name);
      const rewardId = parseInt(req.params.id, 10);

      const deleted = await db
        .delete(rewards)
        .where(and(eq(rewards.id, rewardId), eq(rewards.userId, adventurer.id)))
        .returning();

      if (deleted.length === 0) {
        return res.status(404).json({ error: 'Reward not found.' });
      }

      res.json({ success: true, deleted: deleted[0] });
    } catch (error: any) {
      console.error('Failed to delete reward:', error);
      res.status(500).json({ error: error.message || 'Failed to delete reward' });
    }
  });

  // 11. Purchase / Redeem Reward (Validated server-side)
  app.post('/api/rewards/:id/purchase', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user!;
      const adventurer = await getOrCreateAdventurer(user.uid, user.email, user.name);
      const rewardId = parseInt(req.params.id, 10);

      const result = await purchaseReward(adventurer.id, rewardId);
      res.json(result);
    } catch (error: any) {
      console.error('Failed to purchase reward:', error);
      res.status(400).json({ error: error.message || 'Failed to redeem reward' });
    }
  });

  // 12. Get Reward Redemptions History
  app.get('/api/redemptions', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user!;
      const adventurer = await getOrCreateAdventurer(user.uid, user.email, user.name);

      const redemptions = await db
        .select()
        .from(rewardRedemptions)
        .where(eq(rewardRedemptions.userId, adventurer.id))
        .orderBy(desc(rewardRedemptions.redeemedAt))
        .limit(50);

      res.json(redemptions);
    } catch (error: any) {
      console.error('Failed to fetch redemptions:', error);
      res.status(500).json({ error: error.message || 'Failed to load redemption history' });
    }
  });

  // 13. Get Badges & Achievements Catalogue
  app.get('/api/badges', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user!;
      const adventurer = await getOrCreateAdventurer(user.uid, user.email, user.name);

      const userBadges = await db
        .select()
        .from(badges)
        .where(eq(badges.userId, adventurer.id));

      const unlockedKeys = new Map(userBadges.map((b) => [b.badgeKey, b.unlockedAt]));

      const catalog = Object.entries(BADGE_DEFINITIONS).map(([key, def]) => {
        const isUnlocked = unlockedKeys.has(key);
        return {
          key,
          title: def.title,
          description: def.description,
          icon: def.icon,
          unlocked: isUnlocked,
          unlockedAt: isUnlocked ? unlockedKeys.get(key) : null,
        };
      });

      res.json({
        totalUnlocked: userBadges.length,
        totalAvailable: Object.keys(BADGE_DEFINITIONS).length,
        badges: catalog,
      });
    } catch (error: any) {
      console.error('Failed to fetch badges:', error);
      res.status(500).json({ error: error.message || 'Failed to load achievements' });
    }
  });

  // 14. Get Activity / Quest Logs History
  app.get('/api/activity', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user!;
      const adventurer = await getOrCreateAdventurer(user.uid, user.email, user.name);

      const logs = await db
        .select()
        .from(activityLogs)
        .where(eq(activityLogs.userId, adventurer.id))
        .orderBy(desc(activityLogs.createdAt))
        .limit(100);

      res.json(logs);
    } catch (error: any) {
      console.error('Failed to fetch activity logs:', error);
      res.status(500).json({ error: error.message || 'Failed to load activity logs' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[LifeQuest] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[LifeQuest] Fatal server startup error:', err);
});
