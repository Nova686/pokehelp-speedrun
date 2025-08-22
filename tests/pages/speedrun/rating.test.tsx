import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SpeedrunDetail from "@/app/speedrun/[id]/page";
import * as authClient from "@/lib/auth-client";

jest.mock("next/navigation", () => ({
  useParams: () => ({ id: "abc" }),
}));

jest.mock("@/lib/auth-client", () => ({
  useSession: jest.fn(),
}));

describe("Speedrun Detail Rating UI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-ignore
    global.fetch = jest.fn((url: string, opts?: any) => {
      if (url.includes("/api/speedrun/routes/abc") && (!opts || opts.method === "GET")) {
        return Promise.resolve({
          json: async () => ({
            id: "abc",
            title: "Route ABC",
            description: "Desc",
            steps: ["S1", "S2"],
          }),
        });
      }
      if (url.includes("/rate") && opts?.method === "POST") {
        return Promise.resolve({ ok: true, json: async () => ({ id: "r1", value: 4 }) });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });
  });

  it("affiche le sélecteur et envoie la note quand connecté", async () => {
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: { user: { id: "u1" } },
      isPending: false,
    });

    render(<SpeedrunDetail />);

    expect(await screen.findByText("Route ABC")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "4" } });
    fireEvent.click(screen.getByRole("button", { name: /Noter/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/speedrun/routes/abc/rate",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("ne montre pas la zone de notation si non connecté", async () => {
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: null,
      isPending: false,
    });

    render(<SpeedrunDetail />);
    expect(await screen.findByText("Route ABC")).toBeInTheDocument();
    expect(screen.queryByRole("combobox")).toBeNull();
  });
});
