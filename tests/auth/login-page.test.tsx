import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "@/app/login/page";
import * as authClient from "@/lib/auth-client";

jest.mock("@/lib/auth-client", () => ({
  useSession: jest.fn(),
  signInGoogle: jest.fn(),
  signInDiscord: jest.fn(),
}));

describe("Login Page", () => {
  it("should show loading when pending", () => {
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: null,
      isPending: true,
    });

    render(<LoginPage />);
    expect(screen.getByText("Chargement…")).toBeInTheDocument();
  });

  it("should show message if user already connected", () => {
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: { user: { name: "Test User" } },
      isPending: false,
    });

    render(<LoginPage />);
    expect(screen.getByText(/Déjà connecté/i)).toBeInTheDocument();
  });

  it("should show buttons when user not connected", () => {
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: null,
      isPending: false,
    });

    render(<LoginPage />);
    const googleButton = screen.getByRole("button", { name: /continuer avec google/i });
    const discordButton = screen.getByRole("button", { name: /continuer avec discord/i });

    expect(googleButton).toBeInTheDocument();
    expect(discordButton).toBeInTheDocument();

    fireEvent.click(googleButton);
    expect(authClient.signInGoogle).toHaveBeenCalled();

    fireEvent.click(discordButton);
    expect(authClient.signInDiscord).toHaveBeenCalled();
  });
});
