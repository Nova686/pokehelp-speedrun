export function calculateIV(
  level: number,
  stat: number,
  base: number,
  ev: number,
  nature: number
): number {
  const ivRaw = ((stat / nature - 5) * 100) / level - 2 * base - Math.floor(ev / 4);
  const iv = Math.round(ivRaw);
  return Math.max(0, Math.min(31, iv));
}

export function calculateEV(
  currentStat: number,
  targetStat: number,
  level: number
): number {
  const evRaw = ((targetStat - currentStat) * 4 * level) / 100;
  const ev = Math.round(evRaw);
  return Math.max(0, Math.min(252, ev));
}

export function calculateDamage(
  level: number,
  power: number,
  attack: number,
  defense: number,
  modifier: number
): number {
  const base = (((2 * level) / 5 + 2) * power * attack) / Math.max(1, defense);
  return Math.floor((base / 50 + 2) * modifier);
}

export function calculateCatchRate(
  hpMax: number,
  hpCurrent: number,
  ballRate: number,
  statusMultiplier: number,
  baseRate: number
): number {
  const rate = ((3 * hpMax - 2 * hpCurrent) * baseRate * ballRate) / (3 * hpMax);
  const a = rate * statusMultiplier;
  const capped = Math.max(1, Math.min(255, a));
  return Math.round((capped / 255) * 100);
}

export function calculateEncounterRate(baseRate: number, modifiers: number[]): number {
  const total = modifiers.reduce((acc, m) => acc * m, 1) * baseRate;
  return Math.min(100, Math.max(0, total));
}

export function calculateRange(min: number, max: number): string {
  return `${min} - ${max}`;
}

export function calculateStat(
  base: number,
  iv: number,
  ev: number,
  level: number,
  nature: number,
  isHP = false
): number {
  if (isHP) {
    return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
  }
  return Math.floor(((((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5) * nature);
}
