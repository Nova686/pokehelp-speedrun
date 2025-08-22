import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils";
import Page from "@/app/calculators/encounters/page";

describe("Encounters Calculator Page", () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ percent: 63.21 }),
    });
  });

  it("shows probability of at least one encounter", async () => {
    renderWithProviders(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /Calculer/i }));
    expect(await screen.findByText(/63.21%/i)).toBeInTheDocument();
  });
});
