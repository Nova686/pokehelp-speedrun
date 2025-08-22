import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import SpeedrunDetail from '@/app/speedrun/[id]/page';
import { useParams, useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

beforeEach(() => {
  (useParams as jest.Mock).mockReturnValue({ id: '1' });
});

describe('Speedrun Delete Action', () => {
  it('calls DELETE on confirmation', async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    global.fetch = jest.fn((url: string, options?: any) => {
      if (url.includes('/api/speedrun/routes/1') && options?.method === 'DELETE') {
        return Promise.resolve({ ok: true });
      }
      if (url.includes('/api/speedrun/routes/1')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              id: '1',
              title: 'Detail Route',
              description: 'desc',
              steps: [],
              createdBy: 'user1',
              ratings: [],
            }),
        });
      }
      if (url.includes('/api/me')) {
        return Promise.resolve({
          json: () => Promise.resolve({ loggedIn: true, user: { id: 'user1' } }),
        });
      }
      return Promise.resolve({ json: () => Promise.resolve({}) });
    }) as jest.Mock;

    window.confirm = jest.fn(() => true);

    render(<SpeedrunDetail />);
    await waitFor(() => screen.getByText('Detail Route'));

    const deleteBtn = screen.getByText(/Supprimer/i);
    fireEvent.click(deleteBtn);

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/speedrun'));
  });
});
