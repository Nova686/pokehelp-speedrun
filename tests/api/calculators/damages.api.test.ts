import { POST } from "@/app/api/calculators/damages/route";

describe("API /calculators/damages", () => {
  it("returns min/max", async () => {
    const req = new Request("http://test/damages", {
      method: "POST",
      body: JSON.stringify({ level: 50, power: 80, atk: 120, defn: 100, stab: true, eff: 1, crit: false }),
    });
    const res = await POST(req);
    const json = await res.json();
    expect(json.min).toBeLessThanOrEqual(json.max);
  });
});
