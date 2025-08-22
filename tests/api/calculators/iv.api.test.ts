import { POST } from "@/app/api/calculators/iv/route";

describe("API /calculators/iv", () => {
  it("returns iv number", async () => {
    const req = new Request("http://test/iv", {
      method: "POST",
      body: JSON.stringify({ level: 50, stat: 120, base: 80, ev: 0, nature: 1 }),
    });
    const res = await POST(req);
    const json = await res.json();
    expect(typeof json.iv).toBe("number");
    expect(json.iv).toBeGreaterThanOrEqual(0);
    expect(json.iv).toBeLessThanOrEqual(31);
  });
});
