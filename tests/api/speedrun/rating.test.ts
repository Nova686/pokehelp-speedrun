import { POST } from "@/app/api/speedrun/routes/[id]/rating/route";
import prisma from "@/lib/prisma";
import * as auth from "@/lib/auth";

jest.mock("@/lib/prisma", () => ({
  rating: {
    upsert: jest.fn(),
  },
}));

describe("POST /api/speedrun/routes/[id]/rate", () => {
  beforeEach(() => jest.clearAllMocks());

  it("401 si non connecté", async () => {
    jest.spyOn(auth, "getServerSessionFromHeaders").mockResolvedValue(null as any);

    const req = new Request("http://localhost/api/speedrun/routes/abc/rate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: 4 }),
    });

    const res = await POST(req, { params: { id: "abc" } });
    expect(res.status).toBe(401);
  });

  it("400 si value invalide", async () => {
    jest.spyOn(auth, "getServerSessionFromHeaders").mockResolvedValue({ user: { id: "u1" } } as any);

    const req = new Request("http://localhost/api/speedrun/routes/abc/rate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: 10 }),
    });

    const res = await POST(req, { params: { id: "abc" } });
    expect(res.status).toBe(400);
  });

  it("200 et upsert ok", async () => {
    jest.spyOn(auth, "getServerSessionFromHeaders").mockResolvedValue({ user: { id: "u1" } } as any);
    (prisma.rating.upsert as jest.Mock).mockResolvedValue({ id: "r1", value: 5 });

    const req = new Request("http://localhost/api/speedrun/routes/abc/rate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: 5 }),
    });

    const res = await POST(req, { params: { id: "abc" } });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.value).toBe(5);
  });
});
