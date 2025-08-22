import prisma from '@/lib/prisma';
import { GET, POST } from '@/app/api/speedrun/routes/route';
import { GET as GET_ONE, PUT, DELETE } from '@/app/api/speedrun/routes/[id]/route';

jest.mock('@/lib/prisma', () => ({
  speedrunRoute: {
    findMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('API /speedrun/routes', () => {
  afterEach(() => jest.clearAllMocks());

  it('GET should return list of routes', async () => {
    (prisma.speedrunRoute.findMany as jest.Mock).mockResolvedValue([
      { id: '1', title: 'Test route' },
    ]);

    const req = new Request('http://localhost/api/speedrun/routes', {
      method: 'GET',
    });

    const response = await GET(req);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data[0].title).toBe('Test route');
  });

  it('POST should create a route', async () => {
    (prisma.speedrunRoute.create as jest.Mock).mockResolvedValue({
      id: '123',
      title: 'New Route',
    });

    const req = new Request('http://localhost/api/speedrun/routes', {
      method: 'POST',
      body: JSON.stringify({ title: 'New Route', description: 'desc', steps: [] }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(req);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.title).toBe('New Route');
  });
});

describe('API /speedrun/routes/[id]', () => {
  it('GET should return a route by id', async () => {
    (prisma.speedrunRoute.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      title: 'Route Detail',
    });

    const req = new Request('http://localhost/api/speedrun/routes/1', {
      method: 'GET',
    });

    const response = await GET_ONE(req, { params: { id: '1' } });
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.title).toBe('Route Detail');
  });

  it('PUT should update a route', async () => {
    (prisma.speedrunRoute.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      createdBy: 'user1',
    });
    (prisma.speedrunRoute.update as jest.Mock).mockResolvedValue({
      id: '1',
      title: 'Updated Title',
    });

    const req = new Request('http://localhost/api/speedrun/routes/1', {
      method: 'PUT',
      body: JSON.stringify({ title: 'Updated Title', description: '', steps: [] }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await PUT(req, { params: { id: '1' } });
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.title).toBe('Updated Title');
  });

  it('DELETE should remove a route', async () => {
    (prisma.speedrunRoute.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      createdBy: 'user1',
    });

    const req = new Request('http://localhost/api/speedrun/routes/1', {
      method: 'DELETE',
    });

    const response = await DELETE(req, { params: { id: '1' } });
    expect(response.status).toBe(200);
  });
});
