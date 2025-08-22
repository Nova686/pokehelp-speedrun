import { render, screen, waitFor } from '@testing-library/react';
import SpeedrunListPage from '@/app/speedrun/page';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ id: '1', title: 'Test Route', description: 'desc', steps: [] }]),
  })
) as jest.Mock;

describe('Speedrun List Page', () => {
  it('displays routes from API', async () => {
    render(<SpeedrunListPage />);
    expect(screen.getByText(/Chargement/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Test Route')).toBeInTheDocument();
    });
  });
});
