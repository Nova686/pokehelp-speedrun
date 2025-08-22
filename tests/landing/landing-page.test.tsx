import { render, screen, fireEvent } from "@testing-library/react";
import LandingPage from "@/app/page";
import * as authClient from "@/lib/auth-client";

jest.mock("@/lib/auth-client", () => ({
  useSession: jest.fn(),
  signInGoogle: jest.fn(),
}));

describe("Landing Page", () => {
  it("should show loading when pending", () => {
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: null,
      isPending: true,
    });

    render(<LandingPage />);
    expect(screen.getByText("Chargement...")).toBeInTheDocument();
  });

  it("should show login button when user not connected", () => {
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: null,
      isPending: false,
    });

    render(<LandingPage />);
    const button = screen.getByRole("button", { name: /se connecter avec google/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(authClient.signInGoogle).toHaveBeenCalled();
  });

  it("should show link to platform when user is connected", () => {
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: { user: { name: "Test User" } },
      isPending: false,
    });

    render(<LandingPage />);
    expect(screen.getByRole("link", { name: /accéder à la plateforme/i })).toBeInTheDocument();
  });
});
