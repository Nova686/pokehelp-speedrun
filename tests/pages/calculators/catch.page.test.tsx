import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils";
import Page from "@/app/calculators/catch/page";

describe("Catch Calculator Page", () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ percent: 42.5 }),
    });
  });

  it("displays catch probability", async () => {
    renderWithProviders(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /Calculer/i }));
    expect(await screen.findByText(/42.5%/i)).toBeInTheDocument();
  });
});
