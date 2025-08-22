import {
  calculateIV,
  calculateEV,
  calculateDamage,
  calculateCatchRate,
  calculateHappiness,
  calculateSOSChance,
  calculateEncounterRate,
  calculateRange,
  calculateStat
} from "@/lib/calculations";

describe("lib/calculations", () => {
  it("calculateIV returns a value between 0..31 (approx clamp afterwards in API)", () => {
    const iv = calculateIV(50, 120, 80, 0, 1);
    expect(typeof iv).toBe("number");
  });

  it("calculateEV returns non-negative", () => {
    const ev = calculateEV(100, 120, 50, 80, 31);
    expect(ev).toBeGreaterThanOrEqual(0);
  });

  it("calculateDamage yields min integer", () => {
    const dmg = calculateDamage(50, 80, 120, 100, 1);
    expect(Number.isInteger(dmg)).toBe(true);
  });

  it("calculateCatchRate gives bounded percent", () => {
    const p = calculateCatchRate(100, 10, 1, 1, 200);
    expect(p).toBeGreaterThanOrEqual(0);
    expect(p).toBeLessThanOrEqual(100);
  });

  it("calculateHappiness respects bounds", () => {
    const v = calculateHappiness(250, "walk");
    expect(v).toBeLessThanOrEqual(255);
  });

  it("calculateSOSChance limited", () => {
    expect(calculateSOSChance(0)).toBeGreaterThanOrEqual(0);
  });

  it("calculateEncounterRate bounded", () => {
    const r = calculateEncounterRate(20, [1.1, 1.2]);
    expect(r).toBeLessThanOrEqual(100);
  });

  it("calculateRange formats", () => {
    expect(calculateRange(10, 20)).toBe("10 - 20");
  });

  it("calculateStat HP vs non-HP", () => {
    const hp = calculateStat(80, 31, 0, 50, 1, true);
    const atk = calculateStat(80, 31, 0, 50, 1, false);
    expect(hp).not.toBe(atk);
  });
});
