import { render, screen, fireEvent } from "@testing-library/react";
import UserPage from "@/app/user/page";
import * as authClient from "@/lib/auth-client";

jest.mock("@/lib/auth-client");

describe("UserPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("affiche 'Chargement…' pendant le pending", () => {
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: null,
      isPending: true,
      error: null,
    });

    render(<UserPage />);
    expect(screen.getByText(/Chargement…/i)).toBeInTheDocument();
  });

  it("affiche un message d'erreur si error est défini", () => {
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: null,
      isPending: false,
      error: "Erreur de session",
    });

    render(<UserPage />);
    expect(screen.getByText(/Erreur: Erreur de session/i)).toBeInTheDocument();
  });

  it("affiche un message si l'utilisateur n'est pas connecté", () => {
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: null,
      isPending: false,
      error: null,
    });

    render(<UserPage />);
    expect(screen.getByText(/Vous devez être connecté./i)).toBeInTheDocument();
  });

  it("affiche les infos utilisateur si connecté", () => {
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: {
        user: { name: "Noé", email: "noe@test.com", id: "user123" },
      },
      isPending: false,
      error: null,
    });

    render(<UserPage />);
    expect(screen.getByText(/Nom : Noé/i)).toBeInTheDocument();
    expect(screen.getByText(/Email : noe@test.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Id : user123/i)).toBeInTheDocument();
  });

  it("appelle signOut au clic sur le bouton", () => {
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: {
        user: { name: "Noé", email: "noe@test.com", id: "user123" },
      },
      isPending: false,
      error: null,
    });

    const signOutMock = jest.fn();
    (authClient.signOut as jest.Mock).mockImplementation(signOutMock);

    render(<UserPage />);
    fireEvent.click(screen.getByText(/Se déconnecter/i));

    expect(signOutMock).toHaveBeenCalledWith({
      fetchOptions: { onSuccess: expect.any(Function) },
    });
  });
});
