import { POST } from "@/app/api/calculators/sos/route";

describe("API /calculators/sos", () => {
  it("returns shiny percent approx", async () => {
    const req = new Request("http://test/sos", {
      method: "POST",
      body: JSON.stringify({ calls: 50 }),
    });
    const res = await POST(req);
    const json = await res.json();
    expect(json.percent).toBeGreaterThan(0);
  });
});
