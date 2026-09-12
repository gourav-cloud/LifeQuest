# ⚔️ LifeQuest — 16-Bit Retro RPG Task Manager

> **Live Public URL**: [https://ais-pre-uvvao46ngei3ohczhcuzs3-456807731743.asia-east1.run.app](https://ais-pre-uvvao46ngei3ohczhcuzs3-456807731743.asia-east1.run.app)  
> **Development Preview**: [https://ais-dev-uvvao46ngei3ohczhcuzs3-456807731743.asia-east1.run.app](https://ais-dev-uvvao46ngei3ohczhcuzs3-456807731743.asia-east1.run.app)

LifeQuest transforms real-life tasks into an engaging retro 16-bit role-playing adventure. Real-world tasks become quests that award XP, level up your character attributes (Intellect, Strength, Discipline, Creativity, Health), and yield gold to redeem custom real-life bounties in the Adventurer's Tavern.

---

## 🌐 Public Access & Evaluation Guide

Anyone can access and test the app immediately without registration or API keys:

1. Open the **[Public Application URL](https://ais-pre-uvvao46ngei3ohczhcuzs3-456807731743.asia-east1.run.app)**.
2. Click **"⚔️ Demo Hero Quick Start"** to instantly enter with a pre-seeded hero profile (`Arthur the Brave`).
3. **Try completing a quest**: Click the **Checkmark (✔)** on any quest to trigger real-time 8-bit sound effects, combat text (`+30 XP`, `+15 Gold`), and level progression.
4. **Visit the Tavern**: Spend accumulated gold on real-world rewards (e.g., *Coffee Break*, *Gaming Session*).
5. **Inspect Badges & Chronicles**: Check the **Hall of Fame** and **Chronicles** tabs to view unlocked achievement badges and persistent activity logs.

---

## 🌟 Features

- **Quest Board**: Organize and filter tasks by category (*Intellect*, *Strength*, *Discipline*, *Creativity*, *Health*) and difficulty (*Easy*, *Medium*, *Hard*, *Epic*).
- **Server-Authoritative Progression**: Level progression and XP curves are validated and calculated securely on the server ($80 \times \text{Level}^{1.55}$) to prevent client tampering.
- **Adventurer HUD**: Real-time animated retro gauges for Health (HP), Mana (MP), and Experience (XP), along with primary stats.
- **The Tavern (Reward Shop)**: Spend hard-earned gold coins on real-world rewards.
- **Expedition Chronicles & Hall of Fame**: 14 distinct achievement badges unlocked upon hitting quest, streak, and level milestones.
- **Retro 8-Bit Audio Synthesis**: Real-time sound effects synthesized in the browser via Web Audio API without external audio assets.
- **Dual Authentication**: Public instant Demo Hero access or Google Sign-In via Firebase Authentication.

---

## 🏗️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Motion, Lucide Icons
- **Backend**: Node.js, Express, tsx, esbuild
- **Database**: PostgreSQL (Cloud SQL) with Drizzle ORM
- **Authentication**: Firebase Authentication & Firebase Admin SDK

---

## 🚀 Local Development

```bash
# 1. Clone the repository
git clone https://github.com/your-username/lifequest.git
cd lifequest

# 2. Install dependencies
npm install

# 3. Run in development mode
npm run dev

# 4. Build for production deployment
npm run build

# 5. Start production server
npm run start
