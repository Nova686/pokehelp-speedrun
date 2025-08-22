import { POST } from "@/app/api/calculators/ev/route";

describe("API /calculators/ev", () => {
  it("validates ev array", async () => {
    const req = new Request("http://test/ev", {
      method: "POST",
      body: JSON.stringify({ evs: [252, 252, 4, 0, 0, 0] }),
    });
    const res = await POST(req);
    const json = await res.json();
    expect(json.total).toBe(508);
    expect(json.perStatOk).toBe(true);
    expect(json.totalOk).toBe(true);
  });
});
