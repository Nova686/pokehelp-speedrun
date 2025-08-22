import { POST } from "@/app/api/speedrun/routes/route";
import { PUT, DELETE } from "@/app/api/speedrun/routes/[id]/route";
import prisma from "@/lib/prisma";
import * as auth from "@/lib/auth";

jest.mock("@/lib/prisma", () => ({
  speedrunRoute: {
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
  },
}));

describe("Speedrun API auth guards", () => {
  beforeEach(() => jest.clearAllMocks());

  it("POST /routes renvoie 401 si pas de session", async () => {
    jest.spyOn(auth, "getServerSessionFromHeaders").mockResolvedValue(null as any);

    const req = new Request("http://localhost/api/speedrun/routes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "A", description: "B", steps: ["s1"] }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("PUT /routes/[id] renvoie 403 si pas propriétaire", async () => {
    jest.spyOn(auth, "getServerSessionFromHeaders").mockResolvedValue({ user: { id: "u2" } } as any);
    (prisma.speedrunRoute.findUnique as jest.Mock).mockResolvedValue({ id: "abc", createdBy: "owner" });

    const req = new Request("http://localhost/api/speedrun/routes/abc", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "X", description: "Y", steps: [] }),
    });

    const res = await PUT(req, { params: { id: "abc" } });
    expect(res.status).toBe(403);
  });

  it("DELETE /routes/[id] renvoie 200 si propriétaire", async () => {
    jest.spyOn(auth, "getServerSessionFromHeaders").mockResolvedValue({ user: { id: "owner" } } as any);
    (prisma.speedrunRoute.findUnique as jest.Mock).mockResolvedValue({ id: "abc", createdBy: "owner" });
    (prisma.speedrunRoute.delete as jest.Mock).mockResolvedValue({ id: "abc" });

    const req = new Request("http://localhost/api/speedrun/routes/abc", { method: "DELETE" });
    const res = await DELETE(req, { params: { id: "abc" } });
    expect(res.status).toBe(200);
  });
});
