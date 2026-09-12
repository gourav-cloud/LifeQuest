// Pure client/server shared game formulas and progression mechanics

/**
 * Non-linear XP curve: returns total cumulative XP needed to reach next level
 */
export function getXpRequiredForLevel(level: number): number {
  if (level <= 1) return 100;
  return Math.floor(80 * Math.pow(level, 1.55));
}

/**
 * Calculate level from current XP and newly gained XP
 */
export function calculateLevelProgression(currentLevel: number, currentXp: number, addedXp: number) {
  let newXp = currentXp + addedXp;
  let newLevel = currentLevel;
  let leveledUp = false;
  let levelsGained = 0;

  while (true) {
    const requiredXp = getXpRequiredForLevel(newLevel);
    if (newXp >= requiredXp) {
      newXp -= requiredXp;
      newLevel += 1;
      leveledUp = true;
      levelsGained += 1;
    } else {
      break;
    }
  }

  return { newLevel, newXp, leveledUp, levelsGained };
}
