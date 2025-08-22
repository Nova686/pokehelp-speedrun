import { POST } from "@/app/api/calculators/happiness/route";

describe("API /calculators/happiness", () => {
  it("updates happiness with action", async () => {
    const req = new Request("http://test/happiness", {
      method: "POST",
      body: JSON.stringify({ current: 70, action: "walk" }),
    });
    const res = await POST(req);
    const json = await res.json();
    expect(json.value).toBeGreaterThanOrEqual(0);
    expect(json.value).toBeLessThanOrEqual(255);
  });
});
