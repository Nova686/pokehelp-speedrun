export function calculateIV(level: number, stat: number, base: number, ev: number, nature: number): number {
  const iv = ((stat / nature - 5) * 100) / level - 2 * base - ev / 4;
  return Math.round(iv);
}

export function calculateEV(currentStat: number, targetStat: number, level: number, base: number, iv: number): number {
  const ev = ((targetStat - currentStat) * 4 * level) / 100;
  return Math.max(0, Math.round(ev));
}

export function calculateDamage(level: number, power: number, attack: number, defense: number, modifier: number): number {
  return Math.floor((((2 * level / 5 + 2) * power * attack / defense) / 50 + 2) * modifier);
}

export function calculateCatchRate(hpMax: number, hpCurrent: number, ballRate: number, statusMultiplier: number, baseRate: number): number {
  const rate = ((3 * hpMax - 2 * hpCurrent) * baseRate * ballRate) / (3 * hpMax) * statusMultiplier;
  return Math.min(100, rate);
}

export function calculateHappiness(currentHappiness: number, action: string): number {
  const actions: Record<string, number> = {
    walk: 1,
    battle: 5,
    faint: -10,
    sootheBell: 2
  };
  return Math.min(255, Math.max(0, currentHappiness + (actions[action] || 0)));
}

export function calculateSOSChance(chain: number): number {
  return Math.min(15, 3 + Math.floor(chain / 10)); // simple example
}

export function calculateEncounterRate(baseRate: number, modifiers: number[]): number {
  return Math.min(100, baseRate * modifiers.reduce((acc, m) => acc * m, 1));
}

export function calculateRange(min: number, max: number): string {
  return `${min} - ${max}`;
}

export function calculateStat(base: number, iv: number, ev: number, level: number, nature: number, isHP = false): number {
  if (isHP) {
    return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
  }
  return Math.floor(((((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5) * nature);
}
