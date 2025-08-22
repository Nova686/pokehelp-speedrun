import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils";
import Page from "@/app/calculators/damages/page";

describe("Damages Calculator Page", () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ min: 20, max: 30 }),
    });
  });

  it("computes damage range via API", async () => {
    renderWithProviders(<Page />);

    fireEvent.change(screen.getByDisplayValue("60"), { target: { value: "80" } });
    fireEvent.click(screen.getByRole("button", { name: /Calculer/i }));

    expect(await screen.findByText(/Range : 20 - 30/i)).toBeInTheDocument();
  });
});
