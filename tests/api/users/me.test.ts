import { GET } from "@/app/api/me/route";
import * as auth from "@/lib/auth";

describe("GET /api/me", () => {
  it("should return loggedIn: false when no session", async () => {
    jest.spyOn(auth, "getServerSessionFromHeaders").mockResolvedValue(null);

    const req = new Request("http://localhost/api/me");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.loggedIn).toBe(false);
    expect(data.user).toBeNull();
  });

  it("should return user data when session exists", async () => {
    jest.spyOn(auth, "getServerSessionFromHeaders").mockResolvedValue({
      user: { id: "user1", name: "Noé", email: "noe@test.com" },
    } as any);

    const req = new Request("http://localhost/api/me");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.loggedIn).toBe(true);
    expect(data.user.id).toBe("user1");
    expect(data.user.name).toBe("Noé");
  });
});
