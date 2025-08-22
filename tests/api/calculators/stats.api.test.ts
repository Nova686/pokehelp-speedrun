import { POST } from "@/app/api/calculators/stats/route";

describe("API /calculators/stats", () => {
  it("computes all stats", async () => {
    const req = new Request("http://test/stats", {
      method: "POST",
      body: JSON.stringify({
        level: 50,
        nature: 1,
        bases: [80,80,80,80,80,80],
        ivs:   [31,31,31,31,31,31],
        evs:   [0,0,0,0,0,0]
      }),
    });
    const res = await POST(req);
    const json = await res.json();
    expect(json).toHaveProperty("hp");
    expect(json).toHaveProperty("atk");
    expect(json).toHaveProperty("def");
    expect(json).toHaveProperty("spa");
    expect(json).toHaveProperty("spd");
    expect(json).toHaveProperty("spe");
  });
});
