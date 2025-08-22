import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils";
import Page from "@/app/calculators/ranges/page";

describe("Ranges Calculator Page", () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ min: 22, max: 31, steps: [22,23,24,25,26,27,28,29,30,31,31,31,31,31,31,31] }),
    });
  });

  it("shows range and steps grid", async () => {
    renderWithProviders(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /Calculer/i }));
    expect(await screen.findByText(/Range : 22 - 31/i)).toBeInTheDocument();
    expect(await screen.findAllByText("31")).toHaveLength(7);
  });
});
