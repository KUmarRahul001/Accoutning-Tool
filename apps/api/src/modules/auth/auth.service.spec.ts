import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';

jest.mock('bcrypt');
jest.mock('speakeasy');

describe('AuthService', () => {
  let service: AuthService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
    },
  };

  const mockJwt = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should throw an error for invalid credentials', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(
        service.login({ email: 'test@test.com', password: 'password' }),
      ).rejects.toThrow('Invalid credentials');
    });

    it('should return mfaRequired if mfa is enabled', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        passwordHash: 'hash',
        mfaEnabled: true,
      };
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login({
        email: 'test@test.com',
        password: 'password',
      });
      expect(result).toEqual({ mfaRequired: true, userId: '1' });
    });

    it('should return tokens if mfa is not enabled', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        passwordHash: 'hash',
        mfaEnabled: false,
      };
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (mockJwt.sign as jest.Mock).mockReturnValue('token');

      const result = await service.login({
        email: 'test@test.com',
        password: 'password',
      });
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('verifyMfa', () => {
    it('should throw if user has no totp secret', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        totpSecret: null,
      });
      await expect(service.verifyMfa('1', '123456')).rejects.toThrow();
    });

    it('should verify and return tokens', async () => {
      const user = { id: '1', email: 'test@test.com', totpSecret: 'secret' };
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      (speakeasy.totp.verify as jest.Mock).mockReturnValue(true);
      (mockJwt.sign as jest.Mock).mockReturnValue('token');

      const result = await service.verifyMfa('1', '123456');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });
});
