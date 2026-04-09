import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';

describe('CustomersService', () => {
  let service: CustomersService;

  const mockPrisma = {
    organizationMember: {
      findUnique: jest.fn(),
    },
    customer: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw Forbidden if not a member', async () => {
      (mockPrisma.organizationMember.findUnique as jest.Mock).mockResolvedValue(
        null,
      );
      await expect(
        service.create('user1', { organizationId: 'org1', name: 'Test' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should create customer', async () => {
      (mockPrisma.organizationMember.findUnique as jest.Mock).mockResolvedValue(
        { id: '1' },
      );
      (mockPrisma.customer.findFirst as jest.Mock).mockResolvedValue(null);
      (mockPrisma.customer.create as jest.Mock).mockResolvedValue({
        id: '2',
        name: 'Test',
      });
      const result = await service.create('user1', {
        organizationId: 'org1',
        name: 'Test',
      });
      expect(result).toEqual({ id: '2', name: 'Test' });
    });
  });

  describe('findAll', () => {
    it('should return paginated data', async () => {
      (mockPrisma.organizationMember.findUnique as jest.Mock).mockResolvedValue(
        { id: '1' },
      );
      (mockPrisma.customer.findMany as jest.Mock).mockResolvedValue([
        { id: '1', name: 'Test' },
      ]);
      (mockPrisma.customer.count as jest.Mock).mockResolvedValue(1);

      const result = await service.findAll('user1', 'org1', undefined, 1, 10);
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.totalPages).toBe(1);
    });
  });
});
