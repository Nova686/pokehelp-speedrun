import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils";
import Page from "@/app/calculators/sos/page";

describe("SOS Calculator Page", () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ percent: 0.5 }),
    });
  });

  it("computes SOS shiny percent", async () => {
    renderWithProviders(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /Calculer/i }));
    expect(await screen.findByText(/0.5%/i)).toBeInTheDocument();
  });
});
