import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NewSpeedrunRoute from "@/app/speedrun/new/page";
import * as authClient from "@/lib/auth-client";

jest.mock("@/lib/auth-client", () => ({
  useSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe("New Speedrun Route Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
  });

  it("redirige vers /login si non connecté", () => {
    (authClient.useSession as jest.Mock).mockReturnValue({ data: null, isPending: false });
    render(<NewSpeedrunRoute />);
    expect(screen.getByText(/Chargement/i)).toBeInTheDocument();
  });

  it("soumet le formulaire quand connecté", async () => {
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: { user: { id: "user1" } },
      isPending: false,
    });

    render(<NewSpeedrunRoute />);

    fireEvent.change(screen.getByPlaceholderText(/Titre/i), { target: { value: "Route A" } });
    fireEvent.change(screen.getByPlaceholderText(/Description/i), { target: { value: "Desc" } });
    fireEvent.change(screen.getByPlaceholderText(/Étapes/i), { target: { value: "Step 1\nStep 2" } });

    fireEvent.click(screen.getByRole("button", { name: /Créer/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/speedrun/routes", expect.any(Object));
    });
  });
});
