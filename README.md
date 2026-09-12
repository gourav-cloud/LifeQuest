# ⚔️ LifeQuest — 16-Bit RPG Gamified Task Manager

> **Hackathon Track**: Productivity & Gamification / Web Apps  
> **Live Demo**: [Click here to open LifeQuest](https://ais-dev-uvvao46ngei3ohczhcuzs3-456807731743.asia-east1.run.app)  

---

## 💡 The Problem & The Solution
- **The Problem**: Traditional todo apps feel like chores, causing users to abandon tasks and procrastinate.
- **The Solution**: LifeQuest turns real-life tasks into RPG quests. You gain XP, level up your character, grow attributes (Intelligence, Strength, Discipline), and earn gold you can spend on real-life rewards (like taking a break or buying a coffee).

---

## 🧪 Quick Test Guide for Judges (Try it in 60 Seconds!)

You can test the entire app instantly without registering:

### 1. Instant Login
1. Open the **[Live Demo](https://ais-dev-uvvao46ngei3ohczhcuzs3-456807731743.asia-east1.run.app)**.
2. Click **"⚔️ Demo Hero Quick Start"** (bypasses Google login and loads a pre-seeded hero profile).

### 2. Test Quest Completion & Level Up
1. In the **Quests** tab, click the **Checkmark (✔)** on any quest (e.g., *"Morning Meditation"* or *"Review Pull Requests"*).
2. **Observe**:
   - 8-bit sound chimes play in real-time.
   - Floating combat text (`+30 XP`, `+15 Gold`) pops up.
   - The XP bar fills up, and your character levels up with a celebratory screen!

### 3. Test the Reward Shop (The Tavern)
1. Switch to the **Tavern** tab.
2. Click **"Redeem for Gold"** on any reward (e.g., *"Coffee Break"* or *"1 Hr Video Games"*).
3. **Observe**: Your gold pouch updates dynamically, and the claim is recorded in your history.

### 4. Check the Badges & Activity Chronicles
- Visit the **Hall of Fame** tab to see achievement badges automatically unlocked by completing tasks.
- Check the **Chronicles** tab to see your persistent history log.

---

## 🛠️ How It Works (Tech Stack)

- **Frontend**: React + TypeScript + Tailwind CSS (retro 16-bit pixel theme with Web Audio API sound synthesis).
- **Backend**: Node.js & Express API with full request validation.
- **Database**: Cloud SQL (PostgreSQL) using Drizzle ORM for persistent data storage.
- **Game Engine**: Server-authoritative XP scaling formula ($\text{XP} = \lfloor 80 \times \text{Level}^{1.55} \rfloor$) so levels cannot be manipulated on the client.

---

## 💻 Run It Locally (In 3 Steps)

```bash
# 1. Clone the repository
git clone https://github.com/your-username/lifequest.git
cd lifequest

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
