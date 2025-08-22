import { render, screen, waitFor } from '@testing-library/react';
import SpeedrunDetail from '@/app/speedrun/[id]/page';
import { useParams } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

beforeEach(() => {
  (useParams as jest.Mock).mockReturnValue({ id: '1' });
});

global.fetch = jest.fn((url: string) => {
  if (url.includes('/api/speedrun/routes/1')) {
    return Promise.resolve({
      json: () => Promise.resolve({ id: '1', title: 'Detail Route', description: 'desc', steps: [] }),
    });
  }
  return Promise.resolve({ json: () => Promise.resolve({}) });
}) as jest.Mock;

describe('Speedrun Detail Page', () => {
  it('renders route detail', async () => {
    render(<SpeedrunDetail />);
    expect(screen.getByText(/Chargement/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Detail Route')).toBeInTheDocument();
    });
  });
});
