import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils";
import Page from "@/app/calculators/stats/page";

describe("Stats Calculator Page", () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ hp: 150, atk: 120, def: 100, spa: 110, spd: 95, spe: 105 }),
    });
  });

  it("shows computed stats from API", async () => {
    renderWithProviders(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /Calculer/i }));
    expect(await screen.findByText(/HP: 150/i)).toBeInTheDocument();
  });
});
