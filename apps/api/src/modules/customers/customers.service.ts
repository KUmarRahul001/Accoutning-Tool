import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  private async verifyOrganizationMembership(
    userId: string,
    organizationId: string,
  ) {
    const membership = await this.prisma.organizationMember.findUnique({
      where: { userId_organizationId: { userId, organizationId } },
    });
    if (!membership) {
      throw new ForbiddenException('User is not a member of this organization');
    }
  }

  async create(userId: string, dto: CreateCustomerDto) {
    await this.verifyOrganizationMembership(userId, dto.organizationId);

    if (dto.gstin) {
      const existing = await this.prisma.customer.findFirst({
        where: {
          organizationId: dto.organizationId,
          gstin: dto.gstin,
          deletedAt: null,
        },
      });
      if (existing)
        throw new BadRequestException(
          'Customer with this GSTIN already exists in this organization',
        );
    }

    return this.prisma.customer.create({
      data: {
        organizationId: dto.organizationId,
        name: dto.name,
        gstin: dto.gstin,
        email: dto.email,
        phone: dto.phone,
        isRegistered: !!dto.gstin,
        addresses: dto.addresses ? { create: dto.addresses } : undefined,
        contacts: dto.contacts ? { create: dto.contacts } : undefined,
      },
      include: { addresses: true, contacts: true },
    });
  }

  async findAll(
    userId: string,
    organizationId: string,
    search?: string,
    page = 1,
    limit = 10,
  ) {
    await this.verifyOrganizationMembership(userId, organizationId);

    const skip = (page - 1) * limit;
    const where = {
      organizationId,
      deletedAt: null,
      ...(search
        ? { name: { contains: search, mode: 'insensitive' as const } }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take: Number(limit),
      }),
      this.prisma.customer.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, id: string, organizationId: string) {
    await this.verifyOrganizationMembership(userId, organizationId);

    const customer = await this.prisma.customer.findFirst({
      where: { id, organizationId, deletedAt: null },
      include: { addresses: true, contacts: true },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async update(
    userId: string,
    id: string,
    organizationId: string,
    dto: UpdateCustomerDto,
  ) {
    await this.findOne(userId, id, organizationId); // implicitly verifies membership and existence

    if (dto.gstin) {
      const existing = await this.prisma.customer.findFirst({
        where: {
          organizationId,
          gstin: dto.gstin,
          id: { not: id },
          deletedAt: null,
        },
      });
      if (existing)
        throw new BadRequestException(
          'Customer with this GSTIN already exists',
        );
    }

    return this.prisma.customer.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.gstin !== undefined ? { isRegistered: !!dto.gstin } : {}),
      },
    });
  }

  async remove(userId: string, id: string, organizationId: string) {
    await this.findOne(userId, id, organizationId);
    return this.prisma.customer.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
