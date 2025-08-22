import { POST } from "@/app/api/calculators/catch/route";

describe("API /calculators/catch", () => {
  it("returns percent", async () => {
    const req = new Request("http://test/catch", {
      method: "POST",
      body: JSON.stringify({ hpMax: 100, hpCurrent: 10, ballRate: 1, statusMult: 1, baseRate: 200 }),
    });
    const res = await POST(req);
    const json = await res.json();
    expect(json.percent).toBeGreaterThanOrEqual(0);
    expect(json.percent).toBeLessThanOrEqual(100);
  });
});
