import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import EditSpeedrunRoute from '@/app/speedrun/[id]/edit/page';
import { useParams, useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

beforeEach(() => {
  (useParams as jest.Mock).mockReturnValue({ id: '1' });
  (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
});

describe('Speedrun Edit Page', () => {
  it('renders and updates fields', async () => {
    global.fetch = jest.fn((url: string) => {
      if (url.includes('/api/speedrun/routes/1')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              id: '1',
              title: 'Old Title',
              description: 'Old Desc',
              steps: ['Step 1'],
            }),
        });
      }
      return Promise.resolve({ json: () => Promise.resolve({}) });
    }) as jest.Mock;

    render(<EditSpeedrunRoute />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Old Title')).toBeInTheDocument();
    });

    const titleInput = screen.getByDisplayValue('Old Title');
    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    expect(titleInput).toHaveValue('New Title');
  });

  it('calls PUT on save', async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    global.fetch = jest.fn((url: string, options?: any) => {
      if (options?.method === 'PUT') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: '1', title: 'Updated Title' }),
        });
      }
      if (url.includes('/api/speedrun/routes/1')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({ id: '1', title: 'Old Title', description: '', steps: [] }),
        });
      }
      return Promise.resolve({ json: () => Promise.resolve({}) });
    }) as jest.Mock;

    render(<EditSpeedrunRoute />);
    await waitFor(() => screen.getByDisplayValue('Old Title'));

    fireEvent.click(screen.getByText(/Enregistrer/i));
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/speedrun/1'));
  });
});
