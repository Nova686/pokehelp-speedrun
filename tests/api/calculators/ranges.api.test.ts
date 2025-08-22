import { POST } from "@/app/api/calculators/ranges/route";

describe("API /calculators/ranges", () => {
  it("returns min/max and 16 steps", async () => {
    const req = new Request("http://test/ranges", {
      method: "POST",
      body: JSON.stringify({ level: 50, power: 80, atk: 120, defn: 100, stab: true, eff: 1, crit: false }),
    });
    const res = await POST(req);
    const json = await res.json();
    expect(json.steps).toHaveLength(16);
    expect(json.min).toBeLessThanOrEqual(json.max);
  });
});
