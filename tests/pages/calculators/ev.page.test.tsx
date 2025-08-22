import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils";
import Page from "@/app/calculators/ev/page";

describe("EV Calculator Page", () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ total: 508, perStatOk: true, totalOk: true }),
    });
  });

  it("validates EV totals", async () => {
    renderWithProviders(<Page />);

    const inputs = screen.getAllByRole("spinbutton");
    fireEvent.change(inputs[0], { target: { value: "252" } });
    fireEvent.change(inputs[1], { target: { value: "252" } });
    fireEvent.change(inputs[2], { target: { value: "4" } });

    fireEvent.click(screen.getByRole("button", { name: /Vérifier/i }));

    expect(await screen.findByText(/Total : 508/i)).toBeInTheDocument();
  });
});
