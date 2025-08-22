import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils";
import Page from "@/app/calculators/happiness/page";

describe("Happiness Calculator Page", () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ value: 75 }),
    });
  });

  it("updates happiness", async () => {
    renderWithProviders(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /Appliquer/i }));
    expect(await screen.findByText(/Bonheur estimé : 75/i)).toBeInTheDocument();
  });
});
