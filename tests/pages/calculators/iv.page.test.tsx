import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils";
import Page from "@/app/calculators/iv/page";

describe("IV Calculator Page", () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ iv: 27 }),
    });
  });

  it("calls API and displays IV", async () => {
    renderWithProviders(<Page />);

    fireEvent.change(screen.getByPlaceholderText(/Stat observée/i), { target: { value: "120" } });
    fireEvent.change(screen.getByPlaceholderText(/Base stat/i), { target: { value: "80" } });
    fireEvent.change(screen.getByPlaceholderText(/Niveau/i), { target: { value: "50" } });
    fireEvent.change(screen.getByPlaceholderText(/EV/i), { target: { value: "0" } });

    fireEvent.click(screen.getByRole("button", { name: /Calculer/i }));

    const out = await screen.findByText(/IV estimé/i);
    expect(out).toHaveTextContent("27");
  });
});
