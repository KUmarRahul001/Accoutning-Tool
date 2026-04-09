import { Test, TestingModule } from '@nestjs/testing';
import { VendorsService } from './vendors.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';

describe('VendorsService', () => {
  let service: VendorsService;

  const mockPrisma = {
    organizationMember: {
      findUnique: jest.fn(),
    },
    vendor: {
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
        VendorsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<VendorsService>(VendorsService);
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

    it('should create vendor', async () => {
      (mockPrisma.organizationMember.findUnique as jest.Mock).mockResolvedValue(
        { id: '1' },
      );
      (mockPrisma.vendor.findFirst as jest.Mock).mockResolvedValue(null);
      (mockPrisma.vendor.create as jest.Mock).mockResolvedValue({
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
      (mockPrisma.vendor.findMany as jest.Mock).mockResolvedValue([
        { id: '1', name: 'Test' },
      ]);
      (mockPrisma.vendor.count as jest.Mock).mockResolvedValue(1);

      const result = await service.findAll('user1', 'org1', undefined, 1, 10);
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.totalPages).toBe(1);
    });
  });
});
