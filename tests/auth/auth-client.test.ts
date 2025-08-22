import { signInGoogle, signInDiscord } from "@/lib/auth-client";

jest.mock("better-auth/react", () => ({
  createAuthClient: () => ({
    signIn: {
      social: jest.fn(),
    },
  }),
}));

const { createAuthClient } = jest.requireMock("better-auth/react");

describe("Auth Client Wrappers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call signIn.social with provider google", () => {
    signInGoogle({ callbackURL: "/speedrun" });
    expect(createAuthClient().signIn.social).toHaveBeenCalledWith({
      provider: "google",
      callbackURL: "/speedrun",
      errorCallbackURL: undefined,
    });
  });

  it("should call signIn.social with provider discord", () => {
    signInDiscord({ callbackURL: "/speedrun" });
    expect(createAuthClient().signIn.social).toHaveBeenCalledWith({
      provider: "discord",
      callbackURL: "/speedrun",
      errorCallbackURL: undefined,
    });
  });
});
