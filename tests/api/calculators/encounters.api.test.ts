import { POST } from "@/app/api/calculators/encounters/route";

describe("API /calculators/encounters", () => {
  it("returns P(at least one)", async () => {
    const req = new Request("http://test/encounters", {
      method: "POST",
      body: JSON.stringify({ ratePercent: 20, trials: 100 }),
    });
    const res = await POST(req);
    const json = await res.json();
    expect(json.percent).toBeGreaterThanOrEqual(0);
    expect(json.percent).toBeLessThanOrEqual(100);
  });
});
